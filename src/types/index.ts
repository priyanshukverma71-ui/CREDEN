export type UserRole =
  | 'AICTE_ADMIN'
  | 'INSTITUTION_ADMIN'
  | 'DATA_ENTRY_OPERATOR'
  | 'VERIFICATION_OFFICER'
  | 'AUDITOR'
  | 'EXTERNAL_VERIFIER'
  | 'STUDENT';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  institutionId?: string | null;
  institutionName?: string | null;
  institutionCode?: string | null;
}

export interface Institution {
  id: string;
  code: string;
  name: string;
  state: string;
  district: string;
  type: string;
  establishedYear: number;
  approvalStatus: string;
  accreditedBy?: string | null;
  totalCourses?: number;
  totalStudents?: number;
  totalApprovedIntake?: number;
  discrepancyCount?: number;
}

export interface Course {
  id: string;
  institutionId: string;
  courseCode: string;
  courseName: string;
  degreeLevel: string;
  durationYears: number;
  approvedIntake: number;
  academicSession: string;
  intakeConfigs?: IntakeConfig[];
  _count?: { students: number };
}

export interface IntakeConfig {
  id: string;
  courseId: string;
  academicSession: string;
  generalSeats: number;
  obcSeats: number;
  scSeats: number;
  stSeats: number;
  ewsSeats: number;
  tfwQuota: number;
  pmsssQuota: number;
  nriQuota: number;
  foreignQuota: number;
  policyVersion: string;
}

export interface Student {
  id: string;
  apaarId: string;
  maskedApaarId?: string;
  studentRollNumber: string;
  institutionId: string;
  courseId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  category: string;
  admissionCategory: string;
  supernumeraryQuota: string;
  nriOciStatus: string;
  academicSession: string;
  admissionDate: string;
  recordStatus: 'DRAFT' | 'SUBMITTED' | 'VALIDATING' | 'UNDER_REVIEW' | 'VERIFIED' | 'CORRECTION_REQUIRED' | 'REJECTED' | 'CLOSED';
  provenance: string;
  createdAt: string;
  institution?: { id: string; name: string; code: string; state?: string };
  course?: { id: string; courseName: string; courseCode: string; degreeLevel?: string };
  validationResults?: ValidationResult[];
}

export interface ValidationResult {
  id: string;
  ruleId: string;
  ruleVersion: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  resultStatus: 'PASSED' | 'FLAGGED' | 'FAILED';
  message: string;
  detailsJson?: string | null;
  recommendedAction: string;
  reviewStatus: 'PENDING' | 'RESOLVED' | 'IGNORED';
  validatedAt: string;
}

export interface DuplicateCase {
  id: string;
  caseReference: string;
  studentIdA: string;
  studentIdB: string;
  matchType: string;
  confidenceScore: number;
  matchingFieldsJson: string;
  status: 'OPEN' | 'INVESTIGATING' | 'CONFIRMED_DUPLICATE' | 'FALSE_POSITIVE' | 'RESOLVED';
  evidenceNotes?: string | null;
  resolutionReason?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
  studentA: Student;
  studentB: Student;
  assignedTo?: { fullName: string; email: string } | null;
}

export interface ComplianceDiscrepancy {
  id: string;
  institutionId: string;
  courseId: string;
  academicSession: string;
  discrepancyType: string;
  approvedLimit: number;
  actualCount: number;
  excessCount: number;
  status: 'OPEN' | 'UNDER_REVIEW' | 'EXPLAINED_JUSTIFIED' | 'SANCTIONED' | 'RESOLVED';
  explanation?: string | null;
  createdAt: string;
  resolvedAt?: string | null;
  institution: { id: string; name: string; code: string; state: string };
  course: { id: string; courseName: string; courseCode: string; approvedIntake: number };
  reviewedBy?: { fullName: string; email: string } | null;
}

export interface SubmissionBatch {
  id: string;
  batchNumber: string;
  institutionId: string;
  submittedByUserId: string;
  academicSession: string;
  totalRecords: number;
  validRecords: number;
  flaggedRecords: number;
  rejectedRecords: number;
  status: 'DRAFT' | 'SUBMITTED' | 'PROCESSING' | 'VALIDATED' | 'REQUIRES_CORRECTION' | 'APPROVED';
  fileName?: string | null;
  createdAt: string;
  institution?: { name: string; code: string };
  submittedBy?: { fullName: string; email: string };
}

export interface VerificationClaim {
  verificationRef: string;
  studentName: string;
  maskedApaarId: string;
  institutionName: string;
  institutionCode: string;
  courseName: string;
  academicSession: string;
  recordStatus: string;
  isApaarAuthenticated: boolean;
  issuingAuthority: string;
  attestationTimestamp: string;
  digitalSignature: string;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  actorRole: string;
  actorEmail: string;
  institutionId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  detailsJson?: string | null;
  ipAddress?: string | null;
  prevHash?: string | null;
  integrityHash: string;
  createdAt: string;
  user?: { fullName: string; email: string };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  linkUrl?: string | null;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createdAt: string;
}

export type ModuleId =
  | 'overview'
  | 'institutions'
  | 'students'
  | 'submissions'
  | 'apaar'
  | 'admissions'
  | 'duplicates'
  | 'compliance'
  | 'verification'
  | 'reports'
  | 'audit'
  | 'integration'
  | 'settings';
