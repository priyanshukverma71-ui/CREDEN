import { Router, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, requireRoles, AuthenticatedRequest } from '../middleware/auth.js';
import { ComplianceEngine } from '../services/complianceEngine.js';
import { AuditService } from '../services/auditService.js';

const router = Router();

// Overall compliance summary
router.get('/summary', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { academicSession = '2024-2025' } = req.query;

  try {
    let institutionId: string | undefined = undefined;
    if (['INSTITUTION_ADMIN', 'DATA_ENTRY_OPERATOR'].includes(req.user!.role)) {
      institutionId = req.user!.institutionId || undefined;
    }

    const reports = await ComplianceEngine.evaluateAll(institutionId, academicSession as string);

    const totalApproved = reports.reduce((s, r) => s + r.approvedIntake, 0);
    const totalEnrolled = reports.reduce((s, r) => s + r.actualEnrolment, 0);
    const overIntakeCourses = reports.filter((r) => r.isOverIntake);
    const totalExcessSeats = overIntakeCourses.reduce((s, r) => s + r.excessCount, 0);
    const averageUtilization = totalApproved > 0 ? (totalEnrolled / totalApproved) * 100 : 0;

    res.json({
      academicSession,
      totalCoursesAudited: reports.length,
      totalApprovedSeats: totalApproved,
      totalEnrolledStudents: totalEnrolled,
      nationalUtilizationRate: parseFloat(averageUtilization.toFixed(1)),
      flaggedOverIntakeCourses: overIntakeCourses.length,
      totalExcessAdmissions: totalExcessSeats,
      reports: reports.slice(0, 50),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List compliance discrepancies
router.get('/discrepancies', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { status } = req.query;
  const where: any = {};

  if (['INSTITUTION_ADMIN', 'DATA_ENTRY_OPERATOR'].includes(req.user!.role)) {
    where.institutionId = req.user!.institutionId;
  }

  if (status) where.status = status as string;

  try {
    const discrepancies = await prisma.complianceDiscrepancy.findMany({
      where,
      include: {
        institution: { select: { id: true, name: true, code: true, state: true } },
        course: { select: { id: true, courseName: true, courseCode: true, approvedIntake: true } },
        reviewedBy: { select: { fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(discrepancies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Review / Resolve Discrepancy Case
router.post('/discrepancies/:id/review', authenticateToken, requireRoles('AICTE_ADMIN', 'VERIFICATION_OFFICER'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, explanation } = req.body;

  if (!status || !explanation) {
    res.status(400).json({ error: 'Status and reasoned explanation are required.' });
    return;
  }

  try {
    const discrepancy = await prisma.complianceDiscrepancy.findUnique({
      where: { id },
      include: { institution: true, course: true },
    });

    if (!discrepancy) {
      res.status(404).json({ error: 'Discrepancy record not found.' });
      return;
    }

    const updated = await prisma.complianceDiscrepancy.update({
      where: { id },
      data: {
        status,
        explanation: `${discrepancy.explanation ? discrepancy.explanation + '\n---\n' : ''}[Decision by ${req.user!.fullName} (${req.user!.role}) at ${new Date().toISOString()}]: ${explanation}`,
        reviewedByUserId: req.user!.id,
        resolvedAt: ['EXPLAINED_JUSTIFIED', 'RESOLVED'].includes(status) ? new Date() : null,
      },
    });

    await AuditService.recordEvent({
      actorId: req.user!.id,
      actorRole: req.user!.role,
      actorEmail: req.user!.email,
      institutionId: discrepancy.institutionId,
      action: 'COMPLIANCE_DISCREPANCY_REVIEW',
      targetType: 'ComplianceDiscrepancy',
      targetId: id,
      details: { newStatus: status, explanation },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
