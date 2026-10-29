import { Router, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Get user notifications
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { recipientUserId: req.user!.id },
          { recipientRole: req.user!.role },
          { recipientRole: null, recipientUserId: null }, // broadcast
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all as read
router.post('/mark-read', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    await prisma.notification.updateMany({
      where: {
        OR: [
          { recipientUserId: req.user!.id },
          { recipientRole: req.user!.role },
        ],
      },
      data: { isRead: true },
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
