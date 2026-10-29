import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'creden-aicte-secure-hmac-jwt-secret-key-2024';

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  institutionId?: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ error: 'Authentication required. No authorization token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired session token.' });
  }
};

export const requireRoles = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized: Session required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Access Denied: Role '${req.user.role}' lacks permission for this resource. Required roles: ${allowedRoles.join(', ')}`,
      });
      return;
    }

    next();
  };
};

export const requireInstitutionScope = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }

  // AICTE_ADMIN, AUDITOR, VERIFICATION_OFFICER have national-level access
  const nationalRoles = ['AICTE_ADMIN', 'AUDITOR', 'VERIFICATION_OFFICER'];
  if (nationalRoles.includes(req.user.role)) {
    next();
    return;
  }

  // Institutional roles must only access their own institutionId
  const targetInstitutionId = req.params.institutionId || req.query.institutionId || req.body.institutionId;
  
  if (targetInstitutionId && req.user.institutionId && targetInstitutionId !== req.user.institutionId) {
    res.status(403).json({
      error: 'Data Isolation Violation: You are not authorized to access records belonging to another institution.',
    });
    return;
  }

  next();
};
