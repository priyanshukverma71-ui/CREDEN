import bcrypt from 'bcryptjs';
import prisma from './prisma.js';
import { AuditService } from './services/auditService.js';
import { ComplianceEngine } from './services/complianceEngine.js';

export async function seedDatabase() {
  console.log('[SEED] Clearing existing records for clean reproducible state...');
  
  // Clean in correct foreign key order
  await prisma.notification.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.verificationRequest.deleteMany();
  await prisma.duplicateCase.deleteMany();
  await prisma.validationResult.deleteMany();
  await prisma.studentRecordVersion.deleteMany();
  await prisma.complianceDiscrepancy.deleteMany();
  await prisma.student.deleteMany();
  await prisma.submissionBatch.deleteMany();
  await prisma.intakeConfig.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
  await prisma.institution.deleteMany();

  console.log('[SEED] Creating institutions...');
  const passwordHash = await bcrypt.hash('CredenSecure#2024', 10);

  // 1. DTU
  const dtu = await prisma.institution.create({
    data: {
      code: '1-10928371',
      name: 'Delhi Technological University (DTU)',
      state: 'Delhi',
      district: 'North West Delhi',
      type: 'GOVERNMENT',
      establishedYear: 1941,
      approvalStatus: 'APPROVED',
      address: 'Shahbad Daulatpur, Bawana Road, Delhi - 110042',
      website: 'http://dtu.ac.in',
      contactEmail: 'admin@dtu.ac.in',
      contactPhone: '+91-11-27871018',
      accreditedBy: 'NBA, NAAC A+',
    },
  });

  // 2. COEP
  const coep = await prisma.institution.create({
    data: {
      code: '1-10928372',
      name: 'College of Engineering Pune (COEP Tech)',
      state: 'Maharashtra',
      district: 'Pune',
      type: 'GOVERNMENT_AIDED',
      establishedYear: 1854,
      approvalStatus: 'APPROVED',
      address: 'Wellesley Rd, Shivajinagar, Pune, Maharashtra 411005',
      website: 'http://coep.org.in',
      contactEmail: 'admin@coep.ac.in',
      contactPhone: '+91-20-25507000',
      accreditedBy: 'NBA Tier-1, NAAC A++',
    },
  });

  // 3. VIT
  const vit = await prisma.institution.create({
    data: {
      code: '1-10928373',
      name: 'Vellore Institute of Technology',
      state: 'Tamil Nadu',
      district: 'Vellore',
      type: 'PRIVATE_UNAIDED',
      establishedYear: 1984,
      approvalStatus: 'APPROVED',
      address: 'Katpadi, Vellore, Tamil Nadu 632014',
      website: 'http://vit.ac.in',
      contactEmail: 'admin@vit.ac.in',
      contactPhone: '+91-416-2243091',
      accreditedBy: 'ABET, NAAC A++',
    },
  });

  // 4. NITK
  const nitk = await prisma.institution.create({
    data: {
      code: '1-10928374',
      name: 'National Institute of Technology Karnataka (NITK)',
      state: 'Karnataka',
      district: 'Dakshina Kannada',
      type: 'CENTRAL_UNIVERSITY',
      establishedYear: 1960,
      approvalStatus: 'APPROVED',
      address: 'Srinivasnagar, Surathkal, Mangalore, Karnataka 575025',
      website: 'http://nitk.ac.in',
      contactEmail: 'admin@nitk.ac.in',
      contactPhone: '+91-824-2474000',
      accreditedBy: 'NBA, NIRF Top-15',
    },
  });

  console.log('[SEED] Creating role-based users...');
  // 1. AICTE Administrator
  const aicteAdmin = await prisma.user.create({
    data: {
      email: 'aicte.admin@aicte-india.org',
      passwordHash,
      fullName: 'Dr. Rajiv V. AICTE National Director',
      role: 'AICTE_ADMIN',
    },
  });

  // 2. DTU Institution Admin
  const dtuAdmin = await prisma.user.create({
    data: {
      email: 'admin@dtu.ac.in',
      passwordHash,
      fullName: 'Prof. S. K. Raman (DTU Dean Academic)',
      role: 'INSTITUTION_ADMIN',
      institutionId: dtu.id,
    },
  });

  // 3. DTU Data Entry Operator
  const dtuOperator = await prisma.user.create({
    data: {
      email: 'operator@dtu.ac.in',
      passwordHash,
      fullName: 'Meera Joshi (DTU Academic Officer)',
      role: 'DATA_ENTRY_OPERATOR',
      institutionId: dtu.id,
    },
  });

  // 4. COEP Institution Admin
  const coepAdmin = await prisma.user.create({
    data: {
      email: 'admin@coep.ac.in',
      passwordHash,
      fullName: 'Dr. Anand Deshmukh (COEP Registrar)',
      role: 'INSTITUTION_ADMIN',
      institutionId: coep.id,
    },
  });

  // 5. Verification Officer
  const verifOfficer = await prisma.user.create({
    data: {
      email: 'officer@aicte.gov.in',
      passwordHash,
      fullName: 'S. Chandrasekhar (AICTE Verification Bureau)',
      role: 'VERIFICATION_OFFICER',
    },
  });

  // 6. Auditor
  const auditor = await prisma.user.create({
    data: {
      email: 'auditor@cag.gov.in',
      passwordHash,
      fullName: 'R. K. Mukherjee (CAG Academic Audit)',
      role: 'AUDITOR',
    },
  });

  // 7. External Verifier
  await prisma.user.create({
    data: {
      email: 'hr@tcs.com',
      passwordHash,
      fullName: 'Vikramaditya Roy (TCS Background Screening)',
      role: 'EXTERNAL_VERIFIER',
    },
  });

  console.log('[SEED] Creating courses & approved intake configurations...');
  // DTU Courses
  const dtuCse = await prisma.course.create({
    data: {
      institutionId: dtu.id,
      courseCode: 'DTU-CSE-101',
      courseName: 'B.Tech Computer Science & Engineering',
      degreeLevel: 'UG',
      durationYears: 4,
      approvedIntake: 120,
      academicSession: '2024-2025',
    },
  });

  await prisma.intakeConfig.create({
    data: {
      institutionId: dtu.id,
      courseId: dtuCse.id,
      academicSession: '2024-2025',
      generalSeats: 48,
      obcSeats: 32,
      scSeats: 18,
      stSeats: 9,
      ewsSeats: 13,
      tfwQuota: 6, // 5% supernumerary
      pmsssQuota: 5,
      nriQuota: 18, // 15% supernumerary
      policyVersion: 'AICTE-APH-2024-V2.1',
    },
  });

  const dtuAi = await prisma.course.create({
    data: {
      institutionId: dtu.id,
      courseCode: 'DTU-AI-102',
      courseName: 'B.Tech Artificial Intelligence & Data Science',
      degreeLevel: 'UG',
      durationYears: 4,
      approvedIntake: 60,
      academicSession: '2024-2025',
    },
  });

  await prisma.intakeConfig.create({
    data: {
      institutionId: dtu.id,
      courseId: dtuAi.id,
      academicSession: '2024-2025',
      generalSeats: 24,
      obcSeats: 16,
      scSeats: 9,
      stSeats: 5,
      ewsSeats: 6,
      tfwQuota: 3,
      pmsssQuota: 2,
      nriQuota: 9,
      policyVersion: 'AICTE-APH-2024-V2.1',
    },
  });

  // COEP Course
  const coepCse = await prisma.course.create({
    data: {
      institutionId: coep.id,
      courseCode: 'COEP-CSE-201',
      courseName: 'B.Tech Computer Engineering',
      degreeLevel: 'UG',
      durationYears: 4,
      approvedIntake: 120,
      academicSession: '2024-2025',
    },
  });

  await prisma.intakeConfig.create({
    data: {
      institutionId: coep.id,
      courseId: coepCse.id,
      academicSession: '2024-2025',
      generalSeats: 48,
      obcSeats: 32,
      scSeats: 18,
      stSeats: 9,
      ewsSeats: 13,
      tfwQuota: 6,
      pmsssQuota: 4,
      nriQuota: 18,
    },
  });

  // VIT Course
  const vitCse = await prisma.course.create({
    data: {
      institutionId: vit.id,
      courseCode: 'VIT-CSE-301',
      courseName: 'B.Tech Computer Science and Engineering',
      degreeLevel: 'UG',
      durationYears: 4,
      approvedIntake: 240,
      academicSession: '2024-2025',
    },
  });

  // NITK Course
  const nitkCse = await prisma.course.create({
    data: {
      institutionId: nitk.id,
      courseCode: 'NITK-CSE-401',
      courseName: 'B.Tech Computer Science & Engineering',
      degreeLevel: 'UG',
      durationYears: 4,
      approvedIntake: 120,
      academicSession: '2024-2025',
    },
  });

  console.log('[SEED] Seeding representative students with real AICTE problem scenarios...');
  // 1. Verified student (Aarav Sharma)
  const aarav = await prisma.student.create({
    data: {
      apaarId: '9874-5612-3450',
      studentRollNumber: '2024-DTU-CSE-001',
      institutionId: dtu.id,
      courseId: dtuCse.id,
      firstName: 'Aarav',
      lastName: 'Sharma',
      dateOfBirth: '2005-04-12',
      gender: 'MALE',
      category: 'GENERAL',
      admissionCategory: 'MERIT',
      supernumeraryQuota: 'NONE',
      nriOciStatus: 'NONE',
      academicSession: '2024-2025',
      admissionDate: '2024-07-15',
      recordStatus: 'VERIFIED',
      provenance: 'AICTE_CENTRAL_ENROLMENT_PORTAL',
    },
  });

  // Student role account for Aarav
  await prisma.user.create({
    data: {
      email: 'student@aicte.gov.in',
      passwordHash,
      fullName: 'Aarav Sharma (Student)',
      role: 'STUDENT',
      institutionId: dtu.id,
    },
  });

  // 2. Verified student with TFW supernumerary quota (Diya Patel)
  await prisma.student.create({
    data: {
      apaarId: '8763-4521-9872',
      studentRollNumber: '2024-DTU-CSE-002',
      institutionId: dtu.id,
      courseId: dtuCse.id,
      firstName: 'Diya',
      lastName: 'Patel',
      dateOfBirth: '2005-08-23',
      gender: 'FEMALE',
      category: 'OBC',
      admissionCategory: 'MERIT',
      supernumeraryQuota: 'TFW',
      nriOciStatus: 'NONE',
      academicSession: '2024-2025',
      admissionDate: '2024-07-16',
      recordStatus: 'VERIFIED',
      provenance: 'BATCH_UPLOAD_BATCH-2024-001',
    },
  });

  // 3. Problem Scenario: CROSS-INSTITUTION CONCURRENT ENROLMENT
  // Priya Sharma enrolled concurrently in DTU and COEP for session 2024-2025
  const priyaApaar = '7652-3410-8761';
  const priyaDtu = await prisma.student.create({
    data: {
      apaarId: priyaApaar,
      studentRollNumber: '2024-DTU-CSE-003',
      institutionId: dtu.id,
      courseId: dtuCse.id,
      firstName: 'Priya',
      lastName: 'Sharma',
      dateOfBirth: '2005-11-14',
      gender: 'FEMALE',
      category: 'GENERAL',
      admissionCategory: 'MERIT',
      supernumeraryQuota: 'NONE',
      academicSession: '2024-2025',
      admissionDate: '2024-07-18',
      recordStatus: 'UNDER_REVIEW',
      provenance: 'INSTITUTION_DIRECT_ADMISSION',
    },
  });

  const priyaCoep = await prisma.student.create({
    data: {
      apaarId: priyaApaar,
      studentRollNumber: '2024-COEP-CSE-045',
      institutionId: coep.id,
      courseId: coepCse.id,
      firstName: 'Priya',
      lastName: 'Sharma',
      dateOfBirth: '2005-11-14',
      gender: 'FEMALE',
      category: 'GENERAL',
      admissionCategory: 'MERIT',
      supernumeraryQuota: 'NONE',
      academicSession: '2024-2025',
      admissionDate: '2024-07-22',
      recordStatus: 'UNDER_REVIEW',
      provenance: 'STATE_CAP_ROUND_ADMISSION',
    },
  });

  // Duplicate Case for Priya Sharma
  await prisma.duplicateCase.create({
    data: {
      caseReference: 'DUP-2024-0042',
      studentIdA: priyaDtu.id,
      studentIdB: priyaCoep.id,
      matchType: 'CONCURRENT_ENROLMENT',
      confidenceScore: 1.0,
      matchingFieldsJson: JSON.stringify(['apaarId', 'dateOfBirth', 'academicSession', 'firstName', 'lastName']),
      status: 'OPEN',
      assignedToUserId: verifOfficer.id,
      evidenceNotes: 'CRITICAL CONCURRENT ENROLMENT: Student Priya Sharma (APAAR 7652-3410-8761) is concurrently admitted to B.Tech CSE at Delhi Technological University and College of Engineering Pune for the identical academic session 2024-2025.',
    },
  });

  // 4. Problem Scenario: FUZZY IDENTITY DUPLICATE CANDIDATE
  // Rohan Gupta vs Rohan K. Gupta with identical DOB and Gender
  const rohanA = await prisma.student.create({
    data: {
      apaarId: '6541-2309-7650',
      studentRollNumber: '2024-DTU-AI-011',
      institutionId: dtu.id,
      courseId: dtuAi.id,
      firstName: 'Rohan',
      lastName: 'Gupta',
      dateOfBirth: '2005-02-18',
      gender: 'MALE',
      category: 'GENERAL',
      admissionCategory: 'MERIT',
      academicSession: '2024-2025',
      admissionDate: '2024-07-20',
      recordStatus: 'UNDER_REVIEW',
    },
  });

  const rohanB = await prisma.student.create({
    data: {
      apaarId: '5430-1298-6549',
      studentRollNumber: '2024-DTU-AI-019',
      institutionId: dtu.id,
      courseId: dtuAi.id,
      firstName: 'Rohan K',
      lastName: 'Gupta',
      dateOfBirth: '2005-02-18',
      gender: 'MALE',
      category: 'GENERAL',
      admissionCategory: 'MERIT',
      academicSession: '2024-2025',
      admissionDate: '2024-07-24',
      recordStatus: 'UNDER_REVIEW',
    },
  });

  await prisma.duplicateCase.create({
    data: {
      caseReference: 'DUP-2024-0088',
      studentIdA: rohanA.id,
      studentIdB: rohanB.id,
      matchType: 'FUZZY_IDENTITY',
      confidenceScore: 0.92,
      matchingFieldsJson: JSON.stringify(['name_similarity', 'dateOfBirth', 'gender', 'institutionId']),
      status: 'OPEN',
      assignedToUserId: verifOfficer.id,
      evidenceNotes: 'Fuzzy Match (92% confidence): Same DOB (2005-02-18), same gender (MALE), and near-identical names ("Rohan Gupta" vs "Rohan K Gupta") admitted to same course. Suspected dual APAAR registration.',
    },
  });

  // 5. Problem Scenario: INVALID APAAR SYNTAX NEEDING CORRECTION
  const correctionStudent = await prisma.student.create({
    data: {
      apaarId: '0000-0000-0000',
      studentRollNumber: '2024-DTU-CSE-099',
      institutionId: dtu.id,
      courseId: dtuCse.id,
      firstName: 'Kabir',
      lastName: 'Verma',
      dateOfBirth: '2005-06-10',
      gender: 'MALE',
      category: 'EWS',
      admissionCategory: 'MERIT',
      academicSession: '2024-2025',
      admissionDate: '2024-07-28',
      recordStatus: 'CORRECTION_REQUIRED',
    },
  });

  await prisma.validationResult.create({
    data: {
      studentId: correctionStudent.id,
      ruleId: 'APAAR-SYNTAX-02',
      ruleVersion: 'AICTE-APAAR-VAL-2.1',
      severity: 'CRITICAL',
      resultStatus: 'FAILED',
      message: 'Non-genuine repetitive or sequential sequence detected in APAAR ID.',
      recommendedAction: 'Obtain and enter genuine APAAR issued by the Ministry of Education.',
      reviewStatus: 'PENDING',
    },
  });

  // Seed 30 more students into DTU CSE to demonstrate intake utilization and +4 excess
  console.log('[SEED] Populating batch of students to demonstrate intake rules...');
  const firstNames = ['Ananya', 'Aditya', 'Ishaan', 'Kavya', 'Manish', 'Neha', 'Pranav', 'Riya', 'Siddharth', 'Tanvi', 'Varun', 'Zoya', 'Nikhil', 'Pooja', 'Rahul', 'Sneha', 'Tushar', 'Akash', 'Bhavna', 'Chetan', 'Devika', 'Gaurav', 'Harini', 'Jatin', 'Kiran', 'Lata', 'Madhav', 'Nandini', 'Omkar', 'Pallavi'];
  const lastNames = ['Verma', 'Kumar', 'Iyer', 'Reddy', 'Mehta', 'Nair', 'Bose', 'Chopra', 'Das', 'Gill', 'Joshi', 'Kulkarni', 'Malhotra', 'Pandey', 'Rao', 'Sen', 'Thakur', 'Bhat', 'Dutta', 'Garg', 'Hegde', 'Kaul', 'Mishra', 'Pillai', 'Saxena', 'Tiwari', 'Uppal', 'Vyas', 'Walia', 'Yadav'];

  for (let i = 0; i < 25; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const randDigits = 1000 + i * 37;
    await prisma.student.create({
      data: {
        apaarId: `9182-${randDigits}-4501`,
        studentRollNumber: `2024-DTU-CSE-${(i + 4).toString().padStart(3, '0')}`,
        institutionId: dtu.id,
        courseId: dtuCse.id,
        firstName: fn,
        lastName: ln,
        dateOfBirth: `2005-0${(i % 9) + 1}-15`,
        gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
        category: i % 4 === 0 ? 'OBC' : (i % 5 === 0 ? 'SC' : 'GENERAL'),
        admissionCategory: 'MERIT',
        academicSession: '2024-2025',
        admissionDate: '2024-07-25',
        recordStatus: 'VERIFIED',
      },
    });
  }

  // Populate students into COEP, VIT, NITK
  for (let i = 0; i < 15; i++) {
    await prisma.student.create({
      data: {
        apaarId: `8271-${2000 + i * 43}-3412`,
        studentRollNumber: `2024-COEP-CSE-${(i + 1).toString().padStart(3, '0')}`,
        institutionId: coep.id,
        courseId: coepCse.id,
        firstName: firstNames[(i + 5) % firstNames.length],
        lastName: lastNames[(i + 3) % lastNames.length],
        dateOfBirth: '2005-03-20',
        gender: 'MALE',
        category: 'GENERAL',
        admissionCategory: 'MERIT',
        academicSession: '2024-2025',
        admissionDate: '2024-07-21',
        recordStatus: 'VERIFIED',
      },
    });
  }

  // Create a Submission Batch
  const batch = await prisma.submissionBatch.create({
    data: {
      batchNumber: 'BATCH-2024-DTU-001',
      institutionId: dtu.id,
      submittedByUserId: dtuOperator.id,
      academicSession: '2024-2025',
      totalRecords: 28,
      validRecords: 26,
      flaggedRecords: 1,
      rejectedRecords: 1,
      status: 'REQUIRES_CORRECTION',
      fileName: 'dtu_cse_admissions_round1.csv',
    },
  });

  // Create a pre-existing Compliance Discrepancy (e.g. at VIT for review demo)
  await prisma.complianceDiscrepancy.create({
    data: {
      id: `DISC-${vit.id}-${vitCse.id}-2024-2025`,
      institutionId: vit.id,
      courseId: vitCse.id,
      academicSession: '2024-2025',
      discrepancyType: 'OVER_INTAKE',
      approvedLimit: 240,
      actualCount: 248,
      excessCount: 8,
      status: 'OPEN',
      explanation: 'Automated Detection: 248 admissions submitted for approval against sanctioned intake of 240. Excess of +8 seats violates AICTE Approval Process Handbook (APH 2024-25, Clause 4.2).',
    },
  });

  // Seed Tamper-evident Audit Events
  console.log('[SEED] Writing genesis audit trail...');
  await AuditService.recordEvent({
    actorId: aicteAdmin.id,
    actorRole: 'AICTE_ADMIN',
    actorEmail: aicteAdmin.email,
    action: 'SYSTEM_INITIALIZATION',
    targetType: 'System',
    targetId: 'AICTE_CREDEN_PORTAL_ROOT',
    details: { environment: 'PRODUCTION_SYNTHETIC', policyVersion: 'AICTE-APH-2024-25' },
  });

  await AuditService.recordEvent({
    actorId: dtuOperator.id,
    actorRole: 'DATA_ENTRY_OPERATOR',
    actorEmail: dtuOperator.email,
    institutionId: dtu.id,
    action: 'BULK_UPLOAD_INGESTION',
    targetType: 'SubmissionBatch',
    targetId: batch.id,
    details: { fileName: 'dtu_cse_admissions_round1.csv', records: 28 },
  });

  await AuditService.recordEvent({
    actorId: verifOfficer.id,
    actorRole: 'VERIFICATION_OFFICER',
    actorEmail: verifOfficer.email,
    action: 'FLAG_CONCURRENT_ENROLMENT',
    targetType: 'DuplicateCase',
    targetId: 'DUP-2024-0042',
    details: { studentName: 'Priya Sharma', institutions: ['DTU', 'COEP'] },
  });

  // Notifications
  await prisma.notification.create({
    data: {
      recipientRole: 'AICTE_ADMIN',
      title: 'Excess Intake Alert Detected',
      message: 'VIT Computer Science submitted 248 admissions against 240 approved intake (+8 excess).',
      linkUrl: '#compliance',
      severity: 'WARNING',
    },
  });

  await prisma.notification.create({
    data: {
      recipientRole: 'VERIFICATION_OFFICER',
      title: 'High-Priority Duplicate Case Assigned',
      message: 'Concurrent enrolment case DUP-2024-0042 (Priya Sharma) awaits officer review.',
      linkUrl: '#duplicates',
      severity: 'ERROR',
    },
  });

  await prisma.notification.create({
    data: {
      recipientUserId: dtuAdmin.id,
      institutionId: dtu.id,
      title: 'Submission Batch Requires Correction',
      message: 'Batch BATCH-2024-DTU-001 has 1 record with invalid APAAR syntax.',
      linkUrl: '#students',
      severity: 'WARNING',
    },
  });

  console.log('[SEED] Seeding completed successfully!');
}

// Execute directly if run as a script
if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase()
    .then(() => {
      console.log('Seed executed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed execution error:', err);
      process.exit(1);
    });
}
