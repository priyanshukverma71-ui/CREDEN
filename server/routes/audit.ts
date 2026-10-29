import { Router, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, requireRoles, AuthenticatedRequest } from '../middleware/auth.js';
import { AuditService } from '../services/auditService.js';

const router = Router();

// Query audit logs
router.get('/logs', authenticateToken, requireRoles('AICTE_ADMIN', 'AUDITOR', 'VERIFICATION_OFFICER'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { action, actorRole, targetType, page = '1', limit = '50' } = req.query;
  const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
  const take = parseInt(limit as string, 10);

  const where: any = {};
  if (action) where.action = action as string;
  if (actorRole) where.actorRole = actorRole as string;
  if (targetType) where.targetType = targetType as string;

  try {
    const [events, total] = await Promise.all([
      prisma.auditEvent.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: { fullName: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditEvent.count({ where }),
    ]);

    res.json({
      data: events,
      pagination: {
        total,
        page: parseInt(page as string, 10),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Verify cryptographic hash chain integrity
router.get('/verify-integrity', authenticateToken, requireRoles('AICTE_ADMIN', 'AUDITOR'), async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const integrityCheck = await AuditService.verifyChainIntegrity();
    res.json({
      status: integrityCheck.valid ? 'UNCOMPROMISED' : 'INTEGRITY_VIOLATION_DETECTED',
      ...integrityCheck,
      verifiedAt: new Date().toISOString(),
      algorithm: 'HMAC-SHA256 Chained Integrity Block',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
