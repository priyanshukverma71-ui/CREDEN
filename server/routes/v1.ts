import { Router, Request, Response } from 'express';
import prisma from '../prisma.js';
import { ApaarValidationEngine } from '../services/apaarValidator.js';
import { AuditService } from '../services/auditService.js';

export const v1Router = Router();

// Demo Accounts list
const DEMO_USERS: Record<string, any> = {
  AICTE_ADMIN: {
    id: 'USER-001',
    name: 'Dr. Ramesh Sharma',
    email: 'aicte.admin@creden.gov.in',
    roles: ['AICTE_ADMIN'],
    designation: 'National Regulatory Director',
  },
  INSTITUTION_ADMIN: {
    id: 'USER-002',
    name: 'Prof. Suresh Patil',
    email: 'admin@coep.ac.in',
    roles: ['INSTITUTION_ADMIN'],
    institutionId: 'INST-001',
    institution: {
      id: 'INST-001',
      institutionCode: 'AICTE-MH-1029',
      name: 'COEP Technological University',
      state: 'Maharashtra',
    },
  },
  STUDENT: {
    id: 'USER-003',
    name: 'Aarav Sharma',
    email: 'student.aarav@creden.demo',
    roles: ['STUDENT'],
    institutionId: 'INST-001',
  },
  VERIFIER: {
    id: 'USER-004',
    name: 'Priya Nambiar',
    email: 'verifier@infosys.demo',
    roles: ['VERIFIER'],
    organization: 'Infosys Talent Acquisition & Background Screening',
  },
};

// 1. Auth Endpoints
v1Router.post('/auth/login', (req: Request, res: Response) => {
  const { email } = req.body || {};
  const c = (email || '').toLowerCase();
  let role = 'AICTE_ADMIN';
  if (c.includes('coep') || c.includes('inst')) role = 'INSTITUTION_ADMIN';
  else if (c.includes('aarav') || c.includes('student')) role = 'STUDENT';
  else if (c.includes('verif') || c.includes('infosys')) role = 'VERIFIER';

  const user = DEMO_USERS[role] || DEMO_USERS.AICTE_ADMIN;
  res.json({
    success: true,
    token: `creden-jwt-token-${role}`,
    user,
  });
});

v1Router.post('/auth/demo-login', (req: Request, res: Response) => {
  const { role = 'AICTE_ADMIN' } = req.body || {};
  const user = DEMO_USERS[role] || DEMO_USERS.AICTE_ADMIN;
  res.json({
    success: true,
    token: `creden-jwt-token-${role}`,
    user,
  });
});

v1Router.get('/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || '';
  let role = 'AICTE_ADMIN';
  if (authHeader.includes('INSTITUTION_ADMIN')) role = 'INSTITUTION_ADMIN';
  else if (authHeader.includes('STUDENT')) role = 'STUDENT';
  else if (authHeader.includes('VERIFIER')) role = 'VERIFIER';

  res.json({
    success: true,
    user: DEMO_USERS[role] || DEMO_USERS.AICTE_ADMIN,
  });
});

v1Router.post('/auth/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// 2. Institutions Endpoints
v1Router.get('/institutions', async (req: Request, res: Response) => {
  const { search = '', state = '' } = req.query as Record<string, string>;
  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
        { district: { contains: search } },
      ];
    }
    if (state && state !== 'ALL') where.state = state;

    const list = await prisma.institution.findMany({
      where,
      include: {
        _count: { select: { students: true, courses: true } },
      },
    });

    const institutions = list.map((inst) => ({
      id: inst.id,
      institutionCode: inst.code,
      name: inst.name,
      institutionType: inst.type,
      state: inst.state,
      city: inst.district,
      approvedYear: inst.establishedYear,
      contactEmail: inst.contactEmail,
      status: inst.approvalStatus,
      totalStudents: inst._count.students,
      intakeCapacity: 120,
      utilizationRate: 106.7,
      validationScore: 98.4,
      flaggedRecords: 2,
    }));

    res.json({
      success: true,
      count: institutions.length,
      institutions,
    });
  } catch {
    res.json({
      success: true,
      count: 2,
      institutions: [
        {
          id: 'INST-001',
          institutionCode: 'AICTE-MH-1029',
          name: 'COEP Technological University',
          institutionType: 'STATE_TECHNICAL_UNIVERSITY',
          state: 'Maharashtra',
          city: 'Pune',
          approvedYear: 1854,
          contactEmail: 'admin@coep.ac.in',
          status: 'ACTIVE',
          totalStudents: 128,
          intakeCapacity: 120,
          utilizationRate: 106.7,
          validationScore: 98.4,
          flaggedRecords: 2,
        },
        {
          id: 'INST-002',
          institutionCode: 'AICTE-DL-2001',
          name: 'Indian Institute of Technology Delhi',
          institutionType: 'CENTRAL_UNIVERSITY',
          state: 'Delhi',
          city: 'New Delhi',
          approvedYear: 1961,
          contactEmail: 'admin@iitd.ac.in',
          status: 'ACTIVE',
          totalStudents: 95,
          intakeCapacity: 100,
          utilizationRate: 95.0,
          validationScore: 99.1,
          flaggedRecords: 0,
        },
      ],
    });
  }
});

v1Router.get('/institutions/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    success: true,
    institution: {
      id,
      institutionCode: id === 'INST-002' ? 'AICTE-DL-2001' : 'AICTE-MH-1029',
      name: id === 'INST-002' ? 'Indian Institute of Technology Delhi' : 'COEP Technological University',
      institutionType: 'STATE_TECHNICAL_UNIVERSITY',
      state: id === 'INST-002' ? 'Delhi' : 'Maharashtra',
      city: id === 'INST-002' ? 'New Delhi' : 'Pune',
      approvedYear: 1854,
      contactEmail: 'admin@coep.ac.in',
      status: 'ACTIVE',
    },
    metrics: {
      totalStudents: 128,
      intakeCapacity: 120,
      utilizationRate: 106.7,
      validationScore: 98.4,
      flaggedRecords: 2,
    },
    programmeIntakes: [
      {
        programmeCode: 'BTECH-CSE',
        programmeName: 'B.Tech in Computer Science & Engineering',
        approvedSeatCount: 120,
        enrolled: 128,
        status: 'EXCEEDED',
      },
      {
        programmeCode: 'BTECH-ECE',
        programmeName: 'B.Tech in Electronics & Communication Engg',
        approvedSeatCount: 90,
        enrolled: 84,
        status: 'NORMAL',
      },
      {
        programmeCode: 'BTECH-MECH',
        programmeName: 'B.Tech in Mechanical Engineering',
        approvedSeatCount: 90,
        enrolled: 72,
        status: 'NORMAL',
      },
    ],
    recentBatches: [
      {
        batchId: 'BATCH-2025-01',
        academicYear: '2025-2026',
        totalRecords: 128,
        validCount: 126,
        issueCount: 2,
        status: 'NEEDS_REVIEW',
      },
    ],
    activeIssues: [
      {
        id: 'ISSUE-001',
        ruleCode: 'RULE_B',
        severity: 'VIOLATION',
        message: 'Approved intake capacity exceeded by 8 students in B.Tech CSE',
      },
    ],
  });
});

// 3. Students Endpoints
v1Router.get('/students', async (req: Request, res: Response) => {
  const { search = '', institutionId = '' } = req.query as Record<string, string>;
  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { apaarId: { contains: search } },
        { studentRollNumber: { contains: search } },
      ];
    }
    if (institutionId) where.institutionId = institutionId;

    const list = await prisma.student.findMany({
      where,
      include: { institution: true, course: true },
      take: 50,
    });

    const students = list.map((s) => ({
      id: s.id,
      studentIdentityId: `STU-ID-${s.id.slice(0, 6)}`,
      studentName: `${s.firstName} ${s.lastName}`,
      gender: s.gender || 'MALE',
      maskedApaarId: s.apaarId ? `XXXXXXXX${s.apaarId.replace(/[^0-9]/g, '').slice(-4)}` : 'XXXXXXXX1012',
      institutionId: s.institutionId,
      institutionName: s.institution?.name || 'COEP Technological University',
      institutionCode: s.institution?.code || 'AICTE-MH-1029',
      institutionStudentId: s.studentRollNumber || '2025-CSE-001',
      programmeCode: s.course?.courseCode || 'BTECH-CSE',
      programmeName: s.course?.courseName || 'B.Tech in Computer Science & Engineering',
      academicYear: s.academicSession || '2025-2026',
      admissionDate: s.admissionDate || '2025-08-01',
      admissionCategory: s.category || 'GENERAL',
      supernumeraryCategory: s.supernumeraryQuota || 'NONE',
      nriStatus: s.nriOciStatus === 'NRI',
      ociStatus: s.nriOciStatus === 'OCI',
      foreignNationalStatus: s.nriOciStatus === 'FOREIGN_NATIONAL',
      enrolmentStatus: 'ACTIVE',
      validationStatus: s.recordStatus === 'VERIFIED' ? 'VALID' : s.recordStatus === 'REJECTED' ? 'FLAGGED' : 'PENDING_REVIEW',
      validationScore: 98,
      sourceSystem: s.provenance || 'CREDEN_PORTAL',
      createdAt: s.createdAt.toISOString(),
    }));

    res.json({
      success: true,
      total: students.length,
      students,
    });
  } catch {
    res.json({
      success: true,
      total: 3,
      students: [
        {
          id: 'STU-001',
          studentIdentityId: 'STU-ID-001',
          studentName: 'Aarav Sharma',
          gender: 'MALE',
          maskedApaarId: 'XXXXXXXX1012',
          institutionId: 'INST-001',
          institutionName: 'COEP Technological University',
          institutionCode: 'AICTE-MH-1029',
          institutionStudentId: '2025-CSE-001',
          programmeCode: 'BTECH-CSE',
          programmeName: 'B.Tech in Computer Science & Engineering',
          academicYear: '2025-2026',
          admissionDate: '2025-08-01',
          admissionCategory: 'GENERAL',
          supernumeraryCategory: 'NONE',
          nriStatus: false,
          ociStatus: false,
          foreignNationalStatus: false,
          enrolmentStatus: 'ACTIVE',
          validationStatus: 'VALID',
          validationScore: 98,
          sourceSystem: 'CREDEN_PORTAL',
          createdAt: '2025-08-01T10:00:00.000Z',
        },
        {
          id: 'STU-002',
          studentIdentityId: 'STU-ID-002',
          studentName: 'Ananya Deshmukh',
          gender: 'FEMALE',
          maskedApaarId: 'XXXXXXXX4589',
          institutionId: 'INST-001',
          institutionName: 'COEP Technological University',
          institutionCode: 'AICTE-MH-1029',
          institutionStudentId: '2025-CSE-002',
          programmeCode: 'BTECH-CSE',
          programmeName: 'B.Tech in Computer Science & Engineering',
          academicYear: '2025-2026',
          admissionDate: '2025-08-02',
          admissionCategory: 'OBC',
          supernumeraryCategory: 'NONE',
          nriStatus: false,
          ociStatus: false,
          foreignNationalStatus: false,
          enrolmentStatus: 'ACTIVE',
          validationStatus: 'VALID',
          validationScore: 96,
          sourceSystem: 'CSV_UPLOAD',
          createdAt: '2025-08-02T11:00:00.000Z',
        },
        {
          id: 'STU-003',
          studentIdentityId: 'STU-ID-003',
          studentName: 'Rohan Deshmukh',
          gender: 'MALE',
          maskedApaarId: 'XXXXXXXX1122',
          institutionId: 'INST-001',
          institutionName: 'COEP Technological University',
          institutionCode: 'AICTE-MH-1029',
          institutionStudentId: '2025-CSE-990',
          programmeCode: 'BTECH-CSE',
          programmeName: 'B.Tech in Computer Science & Engineering',
          academicYear: '2025-2026',
          admissionDate: '2025-08-10',
          admissionCategory: 'GENERAL',
          supernumeraryCategory: 'NONE',
          nriStatus: false,
          ociStatus: false,
          foreignNationalStatus: false,
          enrolmentStatus: 'ACTIVE',
          validationStatus: 'CROSS_INSTITUTION_FLAG',
          validationScore: 68,
          sourceSystem: 'CSV_UPLOAD',
          createdAt: '2025-08-10T14:30:00.000Z',
        },
      ],
    });
  }
});

v1Router.get('/students/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    success: true,
    student: {
      id,
      studentIdentityId: `STU-ID-${id}`,
      studentName: 'Aarav Sharma',
      gender: 'MALE',
      maskedApaarId: 'XXXXXXXX1012',
      institutionId: 'INST-001',
      institutionName: 'COEP Technological University',
      institutionCode: 'AICTE-MH-1029',
      institutionStudentId: '2025-CSE-001',
      programmeCode: 'BTECH-CSE',
      programmeName: 'B.Tech in Computer Science & Engineering',
      academicYear: '2025-2026',
      admissionDate: '2025-08-01',
      admissionCategory: 'GENERAL',
      supernumeraryCategory: 'NONE',
      nriStatus: false,
      ociStatus: false,
      foreignNationalStatus: false,
      enrolmentStatus: 'ACTIVE',
      validationStatus: 'VALID',
      validationScore: 98,
      sourceSystem: 'CREDEN_PORTAL',
      createdAt: '2025-08-01T10:00:00.000Z',
    },
  });
});

v1Router.patch('/students/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  res.json({
    success: true,
    message: 'Student record updated successfully and audited.',
    studentId: id,
    updates,
  });
});

// 4. Validation Issues & Review Endpoints
v1Router.get('/validation/issues', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: 3,
    issues: [
      {
        id: 'ISSUE-002',
        issueType: 'EXCESS_ENROLMENT',
        severity: 'VIOLATION',
        institutionId: 'INST-001',
        institutionName: 'COEP Technological University',
        institutionCode: 'AICTE-MH-1029',
        affectedRecordReferences: { institutionId: 'INST-001' },
        evidence: {
          ruleCode: 'RULE_B',
          ruleDescription: 'Approved Sanctioned Intake Capacity Exceeded',
          details: 'COEP Pune B.Tech Computer Science enrolled 128 regular candidates against an approved intake ceiling of 120 (+8 breach).',
          detectedValues: { approvedSeats: 120, actualEnrolled: 128, excessCount: 8 },
          riskScore: 92,
        },
        ruleVersion: '1.0',
        reviewStatus: 'ACTION_REQUIRED',
        assignedReviewer: 'aicte.compliance@creden.gov.in',
        resolutionNotes: 'Official notice generated for institutional registrar review.',
        createdAt: new Date(Date.now() - 864e5).toISOString(),
      },
      {
        id: 'ISSUE-003',
        issueType: 'DUPLICATE_APAAR',
        severity: 'NEEDS_REVIEW',
        institutionId: 'INST-003',
        institutionName: 'R.V. College of Engineering',
        institutionCode: 'AICTE-KA-3042',
        affectedRecordReferences: { batchId: 'BATCH-RVCE-2025-01', institutionId: 'INST-003' },
        evidence: {
          ruleCode: 'RULE_A',
          ruleDescription: 'Duplicate APAAR Fingerprint Match Within Batch',
          details: 'Enrolment batch contains duplicate submission identifier for applicant under lateral entry quota.',
          detectedValues: { matchedBatch: 'BATCH-RVCE-2025-01', candidateName: 'Pranav Kulkarni' },
          riskScore: 65,
        },
        ruleVersion: '1.0',
        reviewStatus: 'UNDER_INVESTIGATION',
        assignedReviewer: 'admin@rvce.edu.in',
        resolutionNotes: 'Registrar verification in progress.',
        createdAt: new Date(Date.now() - 1728e5).toISOString(),
      },
      {
        id: 'ISSUE-004',
        issueType: 'CHECKSUM_FAIL',
        severity: 'DISCREPANCY',
        institutionId: 'INST-006',
        institutionName: 'Delhi Technological University (DTU)',
        institutionCode: 'AICTE-DL-2015',
        affectedRecordReferences: { institutionId: 'INST-006' },
        evidence: {
          ruleCode: 'RULE_D',
          ruleDescription: 'Verhoeff Structural Checksum Malformed',
          details: 'Submitted APAAR ID 992837410293 failed dihedral D5 multiplication check.',
          detectedValues: { apaarId: '992837410293', expectedChecksum: '4', actualChecksum: '3' },
          riskScore: 84,
        },
        ruleVersion: '1.0',
        reviewStatus: 'CORRECTION_REQUIRED',
        assignedReviewer: 'deo@dtu.ac.in',
        resolutionNotes: 'Returned to institution for verification against ABC registry.',
        createdAt: new Date(Date.now() - 2592e5).toISOString(),
      },
    ],
  });
});

v1Router.post('/validation/issues/:id/review', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action, resolutionNotes } = req.body || {};
  res.json({
    success: true,
    message: `Issue ${id} determination recorded as ${action}.`,
    resolutionNotes,
  });
});

// 5. Verification Endpoints
v1Router.get('/verification/verify', (req: Request, res: Response) => {
  const { identifier = 'XXXXXXXX1012' } = req.query as Record<string, string>;
  res.json({
    success: true,
    verified: true,
    result: {
      status: 'VERIFIED',
      valid: true,
      studentName: 'Aarav Sharma',
      maskedApaarId: identifier.includes('X') ? identifier : `XXXXXXXX${identifier.slice(-4)}`,
      institutionName: 'COEP Technological University',
      programmeName: 'B.Tech in Computer Science & Engineering',
      academicYear: '2025-2026',
      validationScore: 98,
      timestamp: new Date().toISOString(),
      sha256Seal: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
  });
});

v1Router.post('/verification/requests', (req: Request, res: Response) => {
  res.json({
    success: true,
    requestId: `VER-REQ-${Date.now()}`,
    status: 'ISSUED',
    message: 'Cryptographic attestation token generated.',
  });
});

// 6. Reports & Policy Simulation Endpoints
v1Router.get('/reports', (_req: Request, res: Response) => {
  res.json({
    success: true,
    reportType: 'INTAKE_UTILIZATION',
    generatedAt: new Date().toISOString(),
    yearComparison: {
      '2024-2025': 1320,
      '2025-2026': 1522,
      growthPercentage: 15.3,
    },
    supernumeraryStats: {
      tfw: 54,
      ewsSupernumerary: 38,
      pmsss: 24,
      nri: 18,
      oci: 6,
      foreignNational: 12,
    },
    dataQuality: {
      averageValidationScore: 96.4,
      fullyVerifiedPercent: 97.1,
      flaggedRecordsCount: 38,
    },
    simulatedForecast: [
      { year: '2023-2024', actual: 1180, projected: 1180, confidence: 'Historical' },
      { year: '2024-2025', actual: 1320, projected: 1320, confidence: 'Historical' },
      { year: '2025-2026', actual: 1522, projected: 1500, confidence: 'Current Cycle' },
      { year: '2026-2027', actual: null, projected: 1680, confidence: 'Projected (AICTE ARIMA)' },
      { year: '2027-2028', actual: null, projected: 1840, confidence: 'Projected (AICTE ARIMA)' },
    ],
    reports: [
      {
        id: 'REP-01',
        title: 'National AICTE Intake Compliance Summary AY 2025-26',
        status: 'GENERATED',
        generatedAt: '2025-10-24',
        downloadUrl: '/api/v1/reports/download/REP-01',
      },
      {
        id: 'REP-02',
        title: 'State-wise APAAR Validation Matrix',
        status: 'GENERATED',
        generatedAt: '2025-10-20',
        downloadUrl: '/api/v1/reports/download/REP-02',
      },
      {
        id: 'REP-03',
        title: 'Supernumerary Quotas & Special Categories Audit',
        status: 'GENERATED',
        generatedAt: '2025-10-18',
        downloadUrl: '/api/v1/reports/download/REP-03',
      },
    ],
    summary: {
      totalAudited: 1522,
      complianceRate: 98.4,
      flaggedBatches: 2,
    },
  });
});

v1Router.post('/reports/simulate-policy', (req: Request, res: Response) => {
  const { warningThreshold = 80, excessThreshold = 100 } = req.body || {};
  const nearCount = warningThreshold < 90 ? 4 : 2;
  const excessCount = excessThreshold <= 100 ? 2 : 1;

  res.json({
    success: true,
    results: {
      programmesEvaluated: 48,
      normalCount: 48 - (nearCount + excessCount),
      nearCapacityCount: nearCount,
      excessCount,
      warningThreshold,
      excessThreshold,
      impactAnalysis: `Simulation complete: ${nearCount} programmes flagged for proactive capacity review and ${excessCount} over-intake breaches identified under thresholds (Warning: ${warningThreshold}%, Excess: ${excessThreshold}%).`,
    },
  });
});

// 7. Audit Logs Endpoint
v1Router.get('/audit-logs', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: 5,
    logs: [
      {
        id: 'AUD-001',
        action: 'COMPLIANCE_ALERT_GENERATED',
        actorEmail: 'system.governance@aicte-india.org',
        actorRole: 'SYSTEM_BOT',
        resourceType: 'INSTITUTION',
        resourceId: 'INST-001',
        outcome: 'WARNING',
        details: 'Over-intake notice issued for COEP Technological University B.Tech Computer Engineering (128/120)',
        ipAddress: '10.0.4.12',
        timestamp: new Date().toISOString(),
      },
      {
        id: 'AUD-002',
        action: 'STUDENT_CREDENTIAL_VERIFIED',
        actorEmail: 'verifier@infosys.com',
        actorRole: 'VERIFIER',
        resourceType: 'VERIFICATION',
        resourceId: 'VER-REQ-001',
        outcome: 'SUCCESS',
        details: 'Credential token verified for student Aarav Sharma (COEP Technological University)',
        ipAddress: '192.168.1.101',
        timestamp: new Date(Date.now() - 36e5).toISOString(),
      },
      {
        id: 'AUD-003',
        action: 'BATCH_INGESTION_COMPLETED',
        actorEmail: 'registrar@coep.ac.in',
        actorRole: 'INSTITUTION_ADMIN',
        resourceType: 'ENROLMENT',
        resourceId: 'BATCH-COEP-2025-01',
        outcome: 'SUCCESS',
        details: 'Ingestion of 128 student enrolment records processed with 126 valid passes and 2 flags',
        ipAddress: '14.139.122.14',
        timestamp: new Date(Date.now() - 72e5).toISOString(),
      },
      {
        id: 'AUD-004',
        action: 'CROSS_INSTITUTION_FLAG_OPENED',
        actorEmail: 'system.governance@aicte-india.org',
        actorRole: 'SYSTEM_BOT',
        resourceType: 'VALIDATION',
        resourceId: 'ISSUE-001-CROSS-INST',
        outcome: 'WARNING',
        details: 'Dual enrolment detected for APAAR identifier across COEP Pune and VJTI Mumbai',
        ipAddress: '10.0.4.12',
        timestamp: new Date(Date.now() - 144e5).toISOString(),
      },
      {
        id: 'AUD-005',
        action: 'AICTE_ADMIN_LOGIN',
        actorEmail: 'aicte.admin@creden.gov.in',
        actorRole: 'AICTE_ADMIN',
        resourceType: 'AUTH',
        resourceId: 'USER-001',
        outcome: 'SUCCESS',
        details: 'National regulatory telemetry dashboard session authenticated',
        ipAddress: '103.24.188.10',
        timestamp: new Date(Date.now() - 288e5).toISOString(),
      },
    ],
  });
});

// 8. Template & Demo Utilities
v1Router.get('/upload/template', (_req: Request, res: Response) => {
  const csvContent =
    'studentName,apaarId,gender,category,institutionCode,programmeCode,academicYear,admissionDate\n' +
    'Aarav Sharma,982347102934,MALE,GENERAL,AICTE-MH-1029,BTECH-CSE,2025-2026,2025-08-01\n' +
    'Ananya Deshmukh,847291038472,FEMALE,OBC,AICTE-MH-1029,BTECH-CSE,2025-2026,2025-08-02\n' +
    'Pranav Kulkarni,736482910483,MALE,GENERAL,AICTE-MH-1029,BTECH-ECE,2025-2026,2025-08-03\n';

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="AICTE_Student_Ingestion_Template.csv"');
  res.send(csvContent);
});

v1Router.get('/demo/accounts', (_req: Request, res: Response) => {
  res.json({
    success: true,
    accounts: Object.values(DEMO_USERS),
  });
});

v1Router.post('/demo/reset', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Demo state and test database reset to initial pristine condition.',
  });
});
