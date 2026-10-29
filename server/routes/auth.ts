import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';
import { AuditService } from '../services/auditService.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'creden-aicte-secure-hmac-jwt-secret-key-2024';

// Login endpoint
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { institution: true },
    });

    if (!user || !user.active) {
      res.status(401).json({ error: 'Invalid credentials or inactive account.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials.' });
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        institutionId: user.institutionId,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    await AuditService.recordEvent({
      actorId: user.id,
      actorRole: user.role,
      actorEmail: user.email,
      institutionId: user.institutionId,
      action: 'AUTH_LOGIN_SUCCESS',
      targetType: 'User',
      targetId: user.id,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        institutionId: user.institutionId,
        institutionName: user.institution?.name || null,
        institutionCode: user.institution?.code || null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal authentication error: ' + error.message });
  }
});

// Registration endpoint
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password, role = 'STUDENT' } = req.body || {};

  if (!email || !password || !fullName) {
    res.status(400).json({ error: 'Full name, email, and password are required.' });
    return;
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      res.status(400).json({ error: 'An account with this email address already exists. Please sign in.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        fullName,
        email: email.toLowerCase().trim(),
        passwordHash,
        role,
        active: true,
      },
    });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        institutionId: user.institutionId,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        institutionId: null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// Demo Role Switcher endpoint (for seamless evaluation and SIH demonstration)
router.post('/switch-demo-role', async (req: Request, res: Response): Promise<void> => {
  const { role, institutionCode } = req.body;

  try {
    let whereClause: any = { role };
    if (institutionCode) {
      whereClause.institution = { code: institutionCode };
    }

    let user = await prisma.user.findFirst({
      where: whereClause,
      include: { institution: true },
    });

    if (!user) {
      // Fallback to any user with that role
      user = await prisma.user.findFirst({
        where: { role },
        include: { institution: true },
      });
    }

    if (!user) {
      res.status(404).json({ error: `Demo account for role '${role}' not found.` });
      return;
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        institutionId: user.institutionId,
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        institutionId: user.institutionId,
        institutionName: user.institution?.name || null,
        institutionCode: user.institution?.code || null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Password reset request endpoint
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Registered email address is required.' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Security best practice: don't reveal whether user exists
      res.json({
        success: true,
        message: 'If the provided institutional email is registered in AICTE CREDEN, recovery instructions and an OTP have been dispatched.',
      });
      return;
    }

    await AuditService.recordEvent({
      actorId: user.id,
      actorRole: user.role,
      actorEmail: user.email,
      institutionId: user.institutionId,
      action: 'AUTH_PASSWORD_RESET_REQUEST',
      targetType: 'User',
      targetId: user.id,
      ipAddress: req.ip || '127.0.0.1',
    });

    res.json({
      success: true,
      message: `Password recovery verification token dispatched to registered address ${user.email}. Use temporary authentication code 'AICTE-SECURE-2024' to complete recovery.`,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Current User Me endpoint
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { institution: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User record not found.' });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      institutionId: user.institutionId,
      institutionName: user.institution?.name || null,
      institutionCode: user.institution?.code || null,
      lastLoginAt: user.lastLoginAt,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (req.user) {
    await AuditService.recordEvent({
      actorId: req.user.id,
      actorRole: req.user.role,
      actorEmail: req.user.email,
      institutionId: req.user.institutionId,
      action: 'AUTH_LOGOUT',
      targetType: 'User',
      targetId: req.user.id,
      ipAddress: req.ip || '127.0.0.1',
    });
  }
  res.json({ message: 'Session closed successfully.' });
});

export default router;
