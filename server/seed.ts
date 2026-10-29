import bcrypt from 'bcryptjs';
import prisma from './prisma.js';
import { AuditService } from './services/auditService.js';
import { ComplianceEngine } from './services/complianceEngine.js';

// Verhoeff algorithm helper to generate valid 12-digit Indian APAAR IDs
function generateVerhoeffApaar(prefix11: string): string {
  const digits = prefix11.replace(/\D/g, '').padEnd(11, '7').slice(0, 11);
  const dTable = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
  ];
  const pTable = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
  ];
  const invTable = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

  let c = 0;
  const reversed = digits.split('').reverse();
  for (let i = 0; i < reversed.length; i++) {
    const digit = parseInt(reversed[i], 10);
    c = dTable[c][pTable[(i + 1) % 8][digit]];
  }
  const checkDigit = invTable[c];
  const full12 = digits + checkDigit.toString();
  return `${full12.slice(0, 4)}-${full12.slice(4, 8)}-${full12.slice(8, 12)}`;
}

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

  console.log('[SEED] Creating institutions (10 diverse national technical institutions)...');
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

  // 5. IIT Roorkee
  const iitr = await prisma.institution.create({
    data: {
      code: '1-10928375',
      name: 'Indian Institute of Technology Roorkee',
      state: 'Uttarakhand',
      district: 'Haridwar',
      type: 'CENTRAL_UNIVERSITY',
      establishedYear: 1847,
      approvalStatus: 'APPROVED',
      address: 'Roorkee, Haridwar District, Uttarakhand 247667',
      website: 'http://iitr.ac.in',
      contactEmail: 'admin@iitr.ac.in',
      contactPhone: '+91-1332-285311',
      accreditedBy: 'Institute of National Importance, NIRF #5',
    },
  });

  // 6. BITS Pilani
  const bits = await prisma.institution.create({
    data: {
      code: '1-10928376',
      name: 'Birla Institute of Technology and Science, Pilani',
      state: 'Rajasthan',
      district: 'Jhunjhunu',
      type: 'PRIVATE_UNAIDED',
      establishedYear: 1964,
      approvalStatus: 'APPROVED',
      address: 'Vidya Vihar, Pilani, Rajasthan 333031',
      website: 'http://bits-pilani.ac.in',
      contactEmail: 'admin@bits-pilani.ac.in',
      contactPhone: '+91-1596-242207',
      accreditedBy: 'NAAC A, Institute of Eminence',
    },
  });

  // 7. Jadavpur University
  const ju = await prisma.institution.create({
    data: {
      code: '1-10928377',
      name: 'Jadavpur University (Faculty of Engineering & Tech)',
      state: 'West Bengal',
      district: 'Kolkata',
      type: 'GOVERNMENT',
      establishedYear: 1955,
      approvalStatus: 'APPROVED',
      address: '188 Raja S.C. Mallick Rd, Jadavpur, Kolkata 700032',
      website: 'http://jaduniv.edu.in',
      contactEmail: 'admin@jadavpuruniversity.in',
      contactPhone: '+91-33-24146666',
      accreditedBy: 'NAAC A++, NIRF Top-10',
    },
  });

  // 8. PSG College of Technology
  const psg = await prisma.institution.create({
    data: {
      code: '1-10928378',
      name: 'PSG College of Technology',
      state: 'Tamil Nadu',
      district: 'Coimbatore',
      type: 'GOVERNMENT_AIDED',
      establishedYear: 1951,
      approvalStatus: 'APPROVED',
      address: 'Avinashi Rd, Peelamedu, Coimbatore, Tamil Nadu 641004',
      website: 'http://psgtech.edu',
      contactEmail: 'admin@psgtech.ac.in',
      contactPhone: '+91-422-2572177',
      accreditedBy: 'NBA Tier-1, NAAC A+',
    },
  });

  // 9. Thapar Institute
  const thapar = await prisma.institution.create({
    data: {
      code: '1-10928379',
      name: 'Thapar Institute of Engineering and Technology',
      state: 'Punjab',
      district: 'Patiala',
      type: 'PRIVATE_UNAIDED',
      establishedYear: 1956,
      approvalStatus: 'APPROVED',
      address: 'Bhadson Rd, Adarsh Nagar, Prem Nagar, Patiala, Punjab 147004',
      website: 'http://thapar.edu',
      contactEmail: 'admin@thapar.edu',
      contactPhone: '+91-175-2393021',
      accreditedBy: 'NAAC A+, ABET Accredited',
    },
  });

  // 10. Government Polytechnic Mumbai
  const gpm = await prisma.institution.create({
    data: {
      code: '1-10928380',
      name: 'Government Polytechnic Mumbai',
      state: 'Maharashtra',
      district: 'Mumbai Suburban',
      type: 'GOVERNMENT',
      establishedYear: 1960,
      approvalStatus: 'APPROVED',
      address: '49 Kherwadi, Ali Yavar Jung Marg, Bandra East, Mumbai 400051',
      website: 'http://gpmumbai.ac.in',
      contactEmail: 'admin@gpmumbai.ac.in',
      contactPhone: '+91-22-26474587',
      accreditedBy: 'NBA Accredited Diploma Institute',
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

  // 2. DTU Institution Admin & Operator
  const dtuAdmin = await prisma.user.create({
    data: {
      email: 'admin@dtu.ac.in',
      passwordHash,
      fullName: 'Prof. S. K. Raman (DTU Dean Academic)',
      role: 'INSTITUTION_ADMIN',
      institutionId: dtu.id,
    },
  });

  const dtuOperator = await prisma.user.create({
    data: {
      email: 'operator@dtu.ac.in',
      passwordHash,
      fullName: 'Meera Joshi (DTU Academic Officer)',
      role: 'DATA_ENTRY_OPERATOR',
      institutionId: dtu.id,
    },
  });

  // 3. COEP Institution Admin
  await prisma.user.create({
    data: {
      email: 'admin@coep.ac.in',
      passwordHash,
      fullName: 'Dr. Anand Deshmukh (COEP Registrar)',
      role: 'INSTITUTION_ADMIN',
      institutionId: coep.id,
    },
  });

  // 4. IIT Roorkee Admin
  await prisma.user.create({
    data: {
      email: 'admin@iitr.ac.in',
      passwordHash,
      fullName: 'Prof. Rajeshwar Sahai (IIT Roorkee Dean)',
      role: 'INSTITUTION_ADMIN',
      institutionId: iitr.id,
    },
  });

  // 5. BITS Pilani Admin
  await prisma.user.create({
    data: {
      email: 'admin@bits-pilani.ac.in',
      passwordHash,
      fullName: 'Dr. Sudhir Chandra (BITS Pilani Admissions Dean)',
      role: 'INSTITUTION_ADMIN',
      institutionId: bits.id,
    },
  });

  // 6. Verification Officer
  const verifOfficer = await prisma.user.create({
    data: {
      email: 'officer@aicte.gov.in',
      passwordHash,
      fullName: 'S. Chandrasekhar (AICTE Verification Bureau)',
      role: 'VERIFICATION_OFFICER',
    },
  });

  // 7. Auditor
  await prisma.user.create({
    data: {
      email: 'auditor@cag.gov.in',
      passwordHash,
      fullName: 'R. K. Mukherjee (CAG Academic Audit)',
      role: 'AUDITOR',
    },
  });

  // 8. External Verifier
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
      tfwQuota: 6,
      pmsssQuota: 5,
      nriQuota: 18,
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

  await prisma.intakeConfig.create({
    data: {
      institutionId: vit.id,
      courseId: vitCse.id,
      academicSession: '2024-2025',
      generalSeats: 120,
      obcSeats: 64,
      scSeats: 36,
      stSeats: 18,
      ewsSeats: 2,
      tfwQuota: 12,
      pmsssQuota: 0,
      nriQuota: 36,
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

  await prisma.intakeConfig.create({
    data: {
      institutionId: nitk.id,
      courseId: nitkCse.id,
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

  // IIT Roorkee Course
  const iitrDs = await prisma.course.create({
    data: {
      institutionId: iitr.id,
      courseCode: 'IITR-DSAI-501',
      courseName: 'B.Tech Data Science & Artificial Intelligence',
      degreeLevel: 'UG',
      durationYears: 4,
      approvedIntake: 60,
      academicSession: '2024-2025',
    },
  });

  await prisma.intakeConfig.create({
    data: {
      institutionId: iitr.id,
      courseId: iitrDs.id,
      academicSession: '2024-2025',
      generalSeats: 24,
      obcSeats: 16,
      scSeats: 9,
      stSeats: 5,
      ewsSeats: 6,
      tfwQuota: 0,
      pmsssQuota: 2,
      nriQuota: 0,
    },
  });

  // BITS Pilani Course
  const bitsCs = await prisma.course.create({
    data: {
      institutionId: bits.id,
      courseCode: 'BITS-CS-601',
      courseName: 'B.E. Computer Science',
      degreeLevel: 'UG',
      durationYears: 4,
      approvedIntake: 180,
      academicSession: '2024-2025',
    },
  });

  await prisma.intakeConfig.create({
    data: {
      institutionId: bits.id,
      courseId: bitsCs.id,
      academicSession: '2024-2025',
      generalSeats: 150,
      obcSeats: 0,
      scSeats: 0,
      stSeats: 0,
      ewsSeats: 0,
      tfwQuota: 9,
      pmsssQuota: 0,
      nriQuota: 27,
    },
  });

  // Jadavpur University Course
  const juIt = await prisma.course.create({
    data: {
      institutionId: ju.id,
      courseCode: 'JU-IT-701',
      courseName: 'B.E. Information Technology',
      degreeLevel: 'UG',
      durationYears: 4,
      approvedIntake: 60,
      academicSession: '2024-2025',
    },
  });

  await prisma.intakeConfig.create({
    data: {
      institutionId: ju.id,
      courseId: juIt.id,
      academicSession: '2024-2025',
      generalSeats: 28,
      obcSeats: 14,
      scSeats: 12,
      stSeats: 4,
      ewsSeats: 2,
      tfwQuota: 3,
      pmsssQuota: 2,
      nriQuota: 0,
    },
  });

  // PSG Tech Course
  const psgRa = await prisma.course.create({
    data: {
      institutionId: psg.id,
      courseCode: 'PSG-RA-801',
      courseName: 'B.Tech Robotics and Automation',
      degreeLevel: 'UG',
      durationYears: 4,
      approvedIntake: 60,
      academicSession: '2024-2025',
    },
  });

  await prisma.intakeConfig.create({
    data: {
      institutionId: psg.id,
      courseId: psgRa.id,
      academicSession: '2024-2025',
      generalSeats: 24,
      obcSeats: 16,
      scSeats: 9,
      stSeats: 5,
      ewsSeats: 6,
      tfwQuota: 3,
      pmsssQuota: 0,
      nriQuota: 9,
    },
  });

  // Thapar Course
  const thaparCoe = await prisma.course.create({
    data: {
      institutionId: thapar.id,
      courseCode: 'TIET-COE-901',
      courseName: 'B.E. Computer Engineering',
      degreeLevel: 'UG',
      durationYears: 4,
      approvedIntake: 180,
      academicSession: '2024-2025',
    },
  });

  await prisma.intakeConfig.create({
    data: {
      institutionId: thapar.id,
      courseId: thaparCoe.id,
      academicSession: '2024-2025',
      generalSeats: 90,
      obcSeats: 36,
      scSeats: 27,
      stSeats: 14,
      ewsSeats: 13,
      tfwQuota: 9,
      pmsssQuota: 0,
      nriQuota: 27,
    },
  });

  // Government Polytechnic Mumbai Course
  const gpmDip = await prisma.course.create({
    data: {
      institutionId: gpm.id,
      courseCode: 'GPM-DIP-101',
      courseName: 'Diploma in Computer Engineering',
      degreeLevel: 'DIPLOMA',
      durationYears: 3,
      approvedIntake: 60,
      academicSession: '2024-2025',
    },
  });

  await prisma.intakeConfig.create({
    data: {
      institutionId: gpm.id,
      courseId: gpmDip.id,
      academicSession: '2024-2025',
      generalSeats: 24,
      obcSeats: 16,
      scSeats: 9,
      stSeats: 5,
      ewsSeats: 6,
      tfwQuota: 3,
      pmsssQuota: 0,
      nriQuota: 0,
    },
  });

  console.log('[SEED] Seeding representative students with real AICTE problem scenarios...');

  // 1. Verified student (Aarav Sharma)
  const aaravApaar = generateVerhoeffApaar('98745612345');
  await prisma.student.create({
    data: {
      apaarId: aaravApaar,
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
  const diyaApaar = generateVerhoeffApaar('87634521987');
  await prisma.student.create({
    data: {
      apaarId: diyaApaar,
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

  // 3. Problem Scenario 1: CROSS-INSTITUTION CONCURRENT ENROLMENT
  // Priya Sharma enrolled concurrently in DTU and COEP
  const priyaApaar = generateVerhoeffApaar('76523410876');
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
      evidenceNotes: 'CRITICAL CONCURRENT ENROLMENT: Student Priya Sharma is concurrently admitted to B.Tech CSE at Delhi Technological University and College of Engineering Pune for academic session 2024-2025.',
    },
  });

  // 4. Problem Scenario 2: FUZZY IDENTITY DUPLICATE CANDIDATE
  const rohanA = await prisma.student.create({
    data: {
      apaarId: generateVerhoeffApaar('65412309765'),
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
      apaarId: generateVerhoeffApaar('54301298654'),
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
      evidenceNotes: 'Fuzzy Match (92% confidence): Same DOB (2005-02-18), same gender (MALE), and near-identical names ("Rohan Gupta" vs "Rohan K Gupta") admitted to same course.',
    },
  });

  // 5. Problem Scenario 3: CROSS-STATE CONCURRENT ENROLMENT (IIT Roorkee & BITS Pilani)
  const arjunApaar = generateVerhoeffApaar('43210987654');
  const arjunIitr = await prisma.student.create({
    data: {
      apaarId: arjunApaar,
      studentRollNumber: '2024-IITR-DSAI-007',
      institutionId: iitr.id,
      courseId: iitrDs.id,
      firstName: 'Arjun',
      lastName: 'Mathur',
      dateOfBirth: '2005-09-30',
      gender: 'MALE',
      category: 'GENERAL',
      admissionCategory: 'MERIT',
      academicSession: '2024-2025',
      admissionDate: '2024-07-19',
      recordStatus: 'UNDER_REVIEW',
      provenance: 'JOSAA_CENTRAL_COUNSELLING',
    },
  });

  const arjunBits = await prisma.student.create({
    data: {
      apaarId: arjunApaar,
      studentRollNumber: '2024-BITS-CS-028',
      institutionId: bits.id,
      courseId: bitsCs.id,
      firstName: 'Arjun',
      lastName: 'Mathur',
      dateOfBirth: '2005-09-30',
      gender: 'MALE',
      category: 'GENERAL',
      admissionCategory: 'MERIT',
      academicSession: '2024-2025',
      admissionDate: '2024-07-26',
      recordStatus: 'UNDER_REVIEW',
      provenance: 'BITS_DIRECT_COUNSELLING',
    },
  });

  await prisma.duplicateCase.create({
    data: {
      caseReference: 'DUP-2024-0125',
      studentIdA: arjunIitr.id,
      studentIdB: arjunBits.id,
      matchType: 'CONCURRENT_ENROLMENT',
      confidenceScore: 1.0,
      matchingFieldsJson: JSON.stringify(['apaarId', 'firstName', 'lastName', 'dateOfBirth']),
      status: 'OPEN',
      assignedToUserId: verifOfficer.id,
      evidenceNotes: 'Concurrent Enrolment Alert: Student Arjun Mathur holds active admission in B.Tech Data Science (IIT Roorkee) and B.E. Computer Science (BITS Pilani) for academic session 2024-2025.',
    },
  });

  // 6. Problem Scenario 4: CORRECTION REQUIRED (Repetitive APAAR Sequence)
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

  // Seed cohort of students across DTU, COEP, VIT, NITK, IIT Roorkee, BITS, Jadavpur, PSG, Thapar, GPM
  console.log('[SEED] Populating diverse student cohorts across institutions with authentic Verhoeff IDs...');
  const firstNames = [
    'Ananya', 'Aditya', 'Ishaan', 'Kavya', 'Manish', 'Neha', 'Pranav', 'Riya',
    'Siddharth', 'Tanvi', 'Varun', 'Zoya', 'Nikhil', 'Pooja', 'Rahul', 'Sneha',
    'Tushar', 'Akash', 'Bhavna', 'Chetan', 'Devika', 'Gaurav', 'Harini', 'Jatin',
    'Kiran', 'Lata', 'Madhav', 'Nandini', 'Omkar', 'Pallavi', 'Ritika', 'Sameer'
  ];
  const lastNames = [
    'Verma', 'Kumar', 'Iyer', 'Reddy', 'Mehta', 'Nair', 'Bose', 'Chopra',
    'Das', 'Gill', 'Joshi', 'Kulkarni', 'Malhotra', 'Pandey', 'Rao', 'Sen',
    'Thakur', 'Bhat', 'Dutta', 'Garg', 'Hegde', 'Kaul', 'Mishra', 'Pillai',
    'Saxena', 'Tiwari', 'Uppal', 'Vyas', 'Walia', 'Yadav', 'Banerjee', 'Nambiar'
  ];

  // DTU Students (25 students)
  for (let i = 0; i < 25; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const apaar = generateVerhoeffApaar(`9182${(1000000 + i * 4731).toString().slice(0, 7)}`);
    await prisma.student.create({
      data: {
        apaarId: apaar,
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

  // Jadavpur University Students (18 students)
  for (let i = 0; i < 18; i++) {
    const fn = firstNames[(i + 4) % firstNames.length];
    const ln = lastNames[(i + 2) % lastNames.length];
    const apaar = generateVerhoeffApaar(`7192${(2000000 + i * 5321).toString().slice(0, 7)}`);
    await prisma.student.create({
      data: {
        apaarId: apaar,
        studentRollNumber: `2024-JU-IT-${(i + 1).toString().padStart(3, '0')}`,
        institutionId: ju.id,
        courseId: juIt.id,
        firstName: fn,
        lastName: ln,
        dateOfBirth: `2005-0${(i % 8) + 1}-12`,
        gender: i % 2 === 0 ? 'FEMALE' : 'MALE',
        category: i % 3 === 0 ? 'OBC' : 'GENERAL',
        admissionCategory: 'MERIT',
        academicSession: '2024-2025',
        admissionDate: '2024-07-23',
        recordStatus: 'VERIFIED',
      },
    });
  }

  // PSG Tech Students (16 students)
  for (let i = 0; i < 16; i++) {
    const fn = firstNames[(i + 8) % firstNames.length];
    const ln = lastNames[(i + 6) % lastNames.length];
    const apaar = generateVerhoeffApaar(`6283${(3000000 + i * 6214).toString().slice(0, 7)}`);
    await prisma.student.create({
      data: {
        apaarId: apaar,
        studentRollNumber: `2024-PSG-RA-${(i + 1).toString().padStart(3, '0')}`,
        institutionId: psg.id,
        courseId: psgRa.id,
        firstName: fn,
        lastName: ln,
        dateOfBirth: `2005-0${(i % 7) + 2}-18`,
        gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
        category: i % 4 === 0 ? 'SC' : 'OBC',
        admissionCategory: 'MERIT',
        supernumeraryQuota: i === 0 ? 'TFW' : 'NONE',
        academicSession: '2024-2025',
        admissionDate: '2024-07-24',
        recordStatus: 'VERIFIED',
      },
    });
  }

  // Thapar Institute Students (20 students)
  for (let i = 0; i < 20; i++) {
    const fn = firstNames[(i + 12) % firstNames.length];
    const ln = lastNames[(i + 10) % lastNames.length];
    const apaar = generateVerhoeffApaar(`5394${(4000000 + i * 7129).toString().slice(0, 7)}`);
    await prisma.student.create({
      data: {
        apaarId: apaar,
        studentRollNumber: `2024-TIET-COE-${(i + 1).toString().padStart(3, '0')}`,
        institutionId: thapar.id,
        courseId: thaparCoe.id,
        firstName: fn,
        lastName: ln,
        dateOfBirth: `2005-0${(i % 9) + 1}-08`,
        gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
        category: 'GENERAL',
        admissionCategory: 'MERIT',
        academicSession: '2024-2025',
        admissionDate: '2024-07-27',
        recordStatus: 'VERIFIED',
      },
    });
  }

  // Government Polytechnic Mumbai Students (12 diploma students)
  for (let i = 0; i < 12; i++) {
    const fn = firstNames[(i + 16) % firstNames.length];
    const ln = lastNames[(i + 14) % lastNames.length];
    const apaar = generateVerhoeffApaar(`4485${(5000000 + i * 8432).toString().slice(0, 7)}`);
    await prisma.student.create({
      data: {
        apaarId: apaar,
        studentRollNumber: `2024-GPM-DIP-${(i + 1).toString().padStart(3, '0')}`,
        institutionId: gpm.id,
        courseId: gpmDip.id,
        firstName: fn,
        lastName: ln,
        dateOfBirth: `2006-0${(i % 6) + 1}-20`,
        gender: i % 2 === 0 ? 'FEMALE' : 'MALE',
        category: i % 2 === 0 ? 'OBC' : 'SC',
        admissionCategory: 'MERIT',
        academicSession: '2024-2025',
        admissionDate: '2024-08-01',
        recordStatus: 'VERIFIED',
      },
    });
  }

  // Create Submission Batches
  const batch1 = await prisma.submissionBatch.create({
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

  await prisma.submissionBatch.create({
    data: {
      batchNumber: 'BATCH-2024-JU-001',
      institutionId: ju.id,
      submittedByUserId: aicteAdmin.id,
      academicSession: '2024-2025',
      totalRecords: 18,
      validRecords: 18,
      flaggedRecords: 0,
      rejectedRecords: 0,
      status: 'VERIFIED',
      fileName: 'jadavpur_it_admissions_round1.csv',
    },
  });

  // Create Compliance Discrepancies
  // 1. VIT Over-Intake (+8 seats)
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

  // 2. Thapar Institute Over-Intake (+12 seats)
  await prisma.complianceDiscrepancy.create({
    data: {
      id: `DISC-${thapar.id}-${thaparCoe.id}-2024-2025`,
      institutionId: thapar.id,
      courseId: thaparCoe.id,
      academicSession: '2024-2025',
      discrepancyType: 'OVER_INTAKE',
      approvedLimit: 180,
      actualCount: 192,
      excessCount: 12,
      status: 'OPEN',
      explanation: 'Excess Admissions: 192 candidates admitted against approved capacity of 180 seats. Unapproved institutional quota increase detected.',
    },
  });

  // 3. PSG Tech Supernumerary Quota Breach
  await prisma.complianceDiscrepancy.create({
    data: {
      id: `DISC-${psg.id}-${psgRa.id}-2024-2025`,
      institutionId: psg.id,
      courseId: psgRa.id,
      academicSession: '2024-2025',
      discrepancyType: 'SUPERNUMERARY_EXCESS',
      approvedLimit: 3,
      actualCount: 6,
      excessCount: 3,
      status: 'OPEN',
      explanation: 'Supernumerary Quota Violation: Tuition Fee Waiver (TFW) admissions exceed statutory 5% cap (allocated 6 vs allowed 3).',
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
    targetId: batch1.id,
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

  await AuditService.recordEvent({
    actorId: verifOfficer.id,
    actorRole: 'VERIFICATION_OFFICER',
    actorEmail: verifOfficer.email,
    action: 'FLAG_CONCURRENT_ENROLMENT',
    targetType: 'DuplicateCase',
    targetId: 'DUP-2024-0125',
    details: { studentName: 'Arjun Mathur', institutions: ['IIT Roorkee', 'BITS Pilani'] },
  });

  // Notifications
  await prisma.notification.create({
    data: {
      recipientRole: 'AICTE_ADMIN',
      title: 'Excess Intake Alert Detected (VIT)',
      message: 'VIT Computer Science submitted 248 admissions against 240 approved intake (+8 excess).',
      linkUrl: '#compliance',
      severity: 'WARNING',
    },
  });

  await prisma.notification.create({
    data: {
      recipientRole: 'AICTE_ADMIN',
      title: 'Excess Intake Alert Detected (Thapar)',
      message: 'Thapar Institute Computer Engineering admitted 192 students against 180 approved seats (+12 excess).',
      linkUrl: '#compliance',
      severity: 'ERROR',
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
      recipientRole: 'VERIFICATION_OFFICER',
      title: 'National Registry Cross-State Match (IIT Roorkee / BITS)',
      message: 'Concurrent enrolment case DUP-2024-0125 (Arjun Mathur) flagged for hearing.',
      linkUrl: '#duplicates',
      severity: 'WARNING',
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

  console.log('[SEED] Seeding completed successfully with 10 institutions and rich testing data!');
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
