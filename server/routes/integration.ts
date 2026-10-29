import { Router, Request, Response } from 'express';
import { ApaarValidationEngine } from '../services/apaarValidator.js';
import { seedDatabase } from '../seed.js';
import { authenticateToken, requireRoles, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// Integration health & status
router.get('/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    mode: 'SIMULATION_ENVIRONMENT',
    adapters: [
      {
        id: 'digilocker-apaar-adapter',
        name: 'DigiLocker APAAR / ABC Registry Gateway',
        status: 'OPERATIONAL',
        protocol: 'REST / HTTPS (OAuth 2.0 PKCE)',
        endpoint: 'https://api.digitallocker.gov.in/public/oauth2/1/token (Mocked)',
        latencyMs: 42,
        isSimulation: true,
        lastHeartbeat: new Date().toISOString(),
      },
      {
        id: 'ndear-academic-registry',
        name: 'NDEAR National Student Repository',
        status: 'OPERATIONAL',
        protocol: 'gRPC / JSON-RPC',
        endpoint: 'https://ndear.education.gov.in/v1/verify (Mocked)',
        latencyMs: 65,
        isSimulation: true,
        lastHeartbeat: new Date().toISOString(),
      },
      {
        id: 'aicte-approvals-bureau',
        name: 'AICTE Approvals Process Bureau Service',
        status: 'OPERATIONAL',
        protocol: 'REST / JSON',
        endpoint: 'https://facilities.aicte-india.org/dashboard (Internal Sync)',
        latencyMs: 18,
        isSimulation: false,
        lastHeartbeat: new Date().toISOString(),
      },
    ],
  });
});

// Interactive simulation adapter call
router.post('/simulate-call', (req: Request, res: Response) => {
  const { apaarId, studentName } = req.body;
  if (!apaarId) {
    res.status(400).json({ error: 'apaarId is required' });
    return;
  }

  const result = ApaarValidationEngine.simulateAuthoritativeVerification(
    apaarId,
    studentName || 'Student Name'
  );

  res.json({
    adapter: 'DigiLocker-NDEAR-Sandbox',
    calledAt: new Date().toISOString(),
    ...result,
  });
});

// OpenAPI 3.0 specification
router.get('/openapi.json', (_req: Request, res: Response) => {
  res.json({
    openapi: '3.0.0',
    info: {
      title: 'CREDEN - AICTE Student Data Management & Verification API',
      version: '2.1.0',
      description: 'Authoritative data governance, intake compliance, and APAAR verification API for AICTE approved institutions.',
    },
    paths: {
      '/api/auth/login': {
        post: { summary: 'Authenticate user with email and password' },
      },
      '/api/students': {
        get: { summary: 'List student records with filter and pagination' },
        post: { summary: 'Create single student record with automated checks' },
      },
      '/api/uploads/submit-batch': {
        post: { summary: 'Smart bulk student ingestion with rule validation' },
      },
      '/api/compliance/summary': {
        get: { summary: 'Intake compliance and quota adherence calculations' },
      },
      '/api/duplicates': {
        get: { summary: 'List duplicate investigation cases' },
      },
      '/api/verification/query': {
        post: { summary: 'Cryptographic claim verification with minimal disclosure' },
      },
      '/api/audit/logs': {
        get: { summary: 'Append-only tamper-evident audit events' },
      },
    },
  });
});

// 1-Click Reproducible SIH Demonstration Reset & Re-Seed
router.post('/reset-seed', authenticateToken, requireRoles('AICTE_ADMIN'), async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    await seedDatabase();
    res.json({
      success: true,
      message: 'Demonstration database successfully reset and seeded with reproducible synthetic AICTE data.',
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Seed error: ' + error.message });
  }
});

export default router;
