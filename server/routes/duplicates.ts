import { Router, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, requireRoles, AuthenticatedRequest } from '../middleware/auth.js';
import { AuditService } from '../services/auditService.js';
import { ApaarValidationEngine } from '../services/apaarValidator.js';

const router = Router();

// List duplicate cases
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { status, matchType } = req.query;
  const where: any = {};

  if (status) where.status = status as string;
  if (matchType) where.matchType = matchType as string;

  // Institution isolation
  if (['INSTITUTION_ADMIN', 'DATA_ENTRY_OPERATOR'].includes(req.user!.role)) {
    where.OR = [
      { studentA: { institutionId: req.user!.institutionId } },
      { studentB: { institutionId: req.user!.institutionId } },
    ];
  }

  try {
    const cases = await prisma.duplicateCase.findMany({
      where,
      include: {
        studentA: {
          include: {
            institution: { select: { id: true, name: true, code: true, state: true } },
            course: { select: { courseName: true, courseCode: true } },
          },
        },
        studentB: {
          include: {
            institution: { select: { id: true, name: true, code: true, state: true } },
            course: { select: { courseName: true, courseCode: true } },
          },
        },
        assignedTo: { select: { fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = cases.map((c) => ({
      ...c,
      studentA: {
        ...c.studentA,
        maskedApaarId: ApaarValidationEngine.maskApaar(c.studentA.apaarId),
      },
      studentB: {
        ...c.studentB,
        maskedApaarId: ApaarValidationEngine.maskApaar(c.studentB.apaarId),
      },
    }));

    res.json(formatted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single duplicate case with full side-by-side comparison
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const c = await prisma.duplicateCase.findUnique({
      where: { id },
      include: {
        studentA: {
          include: { institution: true, course: true },
        },
        studentB: {
          include: { institution: true, course: true },
        },
        assignedTo: { select: { fullName: true, email: true } },
      },
    });

    if (!c) {
      res.status(404).json({ error: 'Duplicate case record not found.' });
      return;
    }

    res.json({
      ...c,
      studentA: {
        ...c.studentA,
        maskedApaarId: ApaarValidationEngine.maskApaar(c.studentA.apaarId),
      },
      studentB: {
        ...c.studentB,
        maskedApaarId: ApaarValidationEngine.maskApaar(c.studentB.apaarId),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Resolve duplicate case
router.post('/:id/resolve', authenticateToken, requireRoles('AICTE_ADMIN', 'VERIFICATION_OFFICER'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { status, resolutionReason, deDupAction } = req.body;

  if (!status || !resolutionReason) {
    res.status(400).json({ error: 'Status and resolutionReason are required.' });
    return;
  }

  try {
    const duplicateCase = await prisma.duplicateCase.findUnique({
      where: { id },
      include: { studentA: true, studentB: true },
    });

    if (!duplicateCase) {
      res.status(404).json({ error: 'Case not found.' });
      return;
    }

    const updated = await prisma.duplicateCase.update({
      where: { id },
      data: {
        status,
        resolutionReason: `[Resolved by ${req.user!.fullName} (${req.user!.role}) at ${new Date().toISOString()}]: ${resolutionReason}`,
        resolvedAt: new Date(),
      },
    });

    // Optional corrective action on records
    if (status === 'CONFIRMED_DUPLICATE' && deDupAction === 'REVOKE_SECONDARY') {
      await prisma.student.update({
        where: { id: duplicateCase.studentIdB },
        data: { recordStatus: 'REJECTED' },
      });
    } else if (status === 'FALSE_POSITIVE') {
      // Mark both verified
      await prisma.student.update({
        where: { id: duplicateCase.studentIdA },
        data: { recordStatus: 'VERIFIED' },
      });
      await prisma.student.update({
        where: { id: duplicateCase.studentIdB },
        data: { recordStatus: 'VERIFIED' },
      });
    }

    await AuditService.recordEvent({
      actorId: req.user!.id,
      actorRole: req.user!.role,
      actorEmail: req.user!.email,
      action: 'DUPLICATE_CASE_RESOLVE',
      targetType: 'DuplicateCase',
      targetId: id,
      details: {
        caseReference: duplicateCase.caseReference,
        status,
        resolutionReason,
        deDupAction,
      },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
