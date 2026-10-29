import { Router, Request, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { VerificationService } from '../services/verificationService.js';
import { AuditService } from '../services/auditService.js';

const router = Router();

// Public / Authorized verification query
router.post('/query', async (req: Request, res: Response): Promise<void> => {
  const { referenceOrToken, verifierOrgName, verifierEmail, purpose } = req.body;

  if (!referenceOrToken) {
    res.status(400).json({ error: 'Verification reference number or token is required.' });
    return;
  }

  try {
    const result = await VerificationService.verifyClaim(referenceOrToken.trim(), {
      orgName: verifierOrgName,
      email: verifierEmail,
      purpose,
      ip: req.ip,
    });

    if (!result.isValid) {
      res.status(404).json({
        isValid: false,
        error: result.error,
        isTampered: (result as any).isTampered || false,
      });
      return;
    }

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Verification history
router.get('/history', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const where: any = {};
    if (['INSTITUTION_ADMIN', 'DATA_ENTRY_OPERATOR'].includes(req.user!.role)) {
      where.student = { institutionId: req.user!.institutionId };
    }

    const history = await prisma.verificationRequest.findMany({
      where,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentRollNumber: true,
            institution: { select: { name: true, code: true } },
            course: { select: { courseName: true } },
          },
        },
      },
      orderBy: { verifiedAt: 'desc' },
      take: 50,
    });

    res.json(history);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
