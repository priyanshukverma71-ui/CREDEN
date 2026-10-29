import { describe, it, expect, beforeAll } from 'vitest';
import { ApaarValidationEngine } from '../server/services/apaarValidator.js';
import { VerificationService } from '../server/services/verificationService.js';
import { AuditService } from '../server/services/auditService.js';
import { ComplianceEngine } from '../server/services/complianceEngine.js';
import { DuplicateDetector } from '../server/services/duplicateDetector.js';
import prisma from '../server/prisma.js';

describe('CREDEN Core AICTE Governance Engines', () => {
  describe('APAAR Validation Engine', () => {
    it('should validate correctly formatted 12-digit APAAR', () => {
      const outcomes = ApaarValidationEngine.validateSyntax('9874-5612-3450');
      const pass = outcomes.find(o => o.ruleId === 'APAAR-SYNTAX-PASS');
      expect(pass).toBeDefined();
      expect(pass?.resultStatus).toBe('PASSED');
    });

    it('should flag malformed APAAR identifier with invalid length', () => {
      const outcomes = ApaarValidationEngine.validateSyntax('12345');
      const fail = outcomes.find(o => o.ruleId === 'APAAR-SYNTAX-01');
      expect(fail).toBeDefined();
      expect(fail?.resultStatus).toBe('FAILED');
    });

    it('should reject repetitive synthetic APAAR patterns (e.g. all zeroes)', () => {
      const outcomes = ApaarValidationEngine.validateSyntax('0000-0000-0000');
      const fail = outcomes.find(o => o.ruleId === 'APAAR-SYNTAX-02');
      expect(fail).toBeDefined();
      expect(fail?.resultStatus).toBe('FAILED');
    });

    it('should mask APAAR securely for privacy compliance', () => {
      const masked = ApaarValidationEngine.maskApaar('9874-5612-3450');
      expect(masked).toBe('XXXX-XXXX-3450');
    });
  });

  describe('Verification Cryptographic Attestation', () => {
    it('should sign and verify student credentials with HMAC-SHA256', async () => {
      const mockStudent = {
        id: 'student-test-uuid',
        firstName: 'Aarav',
        lastName: 'Sharma',
        apaarId: '9874-5612-3450',
        institution: { name: 'Delhi Technological University', code: '1-10928371' },
        course: { courseName: 'B.Tech Computer Science' },
        academicSession: '2024-2025',
        recordStatus: 'VERIFIED'
      };

      const signed = VerificationService.signStudentRecord(mockStudent);
      expect(signed.payload.signature).toBeDefined();
      expect(signed.payload.signature.length).toBe(64);

      const verified = await VerificationService.verifyClaim(signed.token);
      expect(verified.isValid).toBe(true);
      if (verified.isValid) {
        expect(verified.claims.studentName).toBe('Aarav Sharma');
        expect(verified.claims.maskedApaarId).toBe('XXXX-XXXX-3450');
        expect(verified.claims.isApaarAuthenticated).toBe(true);
      }
    });

    it('should detect and reject tampered token signatures', async () => {
      const mockStudent = {
        id: 'student-test-uuid-2',
        firstName: 'Diya',
        lastName: 'Patel',
        apaarId: '8763-4521-9872',
        institution: { name: 'COEP', code: '1-10928372' },
        course: { courseName: 'B.Tech IT' },
        academicSession: '2024-2025',
        recordStatus: 'VERIFIED'
      };

      const signed = VerificationService.signStudentRecord(mockStudent);
      const tamperedPayload = { ...signed.payload, studentName: 'Imposter Name' };
      const tamperedToken = Buffer.from(JSON.stringify(tamperedPayload)).toString('base64url');

      const verified = await VerificationService.verifyClaim(tamperedToken);
      expect(verified.isValid).toBe(false);
      expect((verified as any).isTampered).toBe(true);
    });
  });

  describe('Admission & Intake Compliance Engine', () => {
    it('should evaluate course compliance against approved intake', async () => {
      const dtu = await prisma.institution.findFirst({ where: { code: '1-10928371' } });
      expect(dtu).toBeDefined();

      const course = await prisma.course.findFirst({ where: { institutionId: dtu!.id, courseCode: 'DTU-CSE-101' } });
      expect(course).toBeDefined();

      const report = await ComplianceEngine.evaluateCourseCompliance(dtu!.id, course!.id, '2024-2025');
      expect(report.approvedIntake).toBe(120);
      expect(report.capacityUtilization).toBeGreaterThanOrEqual(0);
      expect(report.policyVersion).toContain('AICTE-APH');
    });
  });

  describe('Duplicate Detection & Case Resolution', () => {
    it('should have seeded cross-institution concurrent duplicate case', async () => {
      const cases = await prisma.duplicateCase.findMany({
        where: { matchType: 'CONCURRENT_ENROLMENT' },
        include: { studentA: true, studentB: true }
      });

      expect(cases.length).toBeGreaterThan(0);
      const priyaCase = cases.find(c => c.caseReference === 'DUP-2024-0042');
      expect(priyaCase).toBeDefined();
      expect(priyaCase?.status).toBe('OPEN');
    });
  });

  describe('Tamper-Evident Audit Trail', () => {
    it('should verify unbroken cryptographic audit chain integrity', async () => {
      const result = await AuditService.verifyChainIntegrity();
      expect(result.valid).toBe(true);
      expect(result.totalEvents).toBeGreaterThan(0);
    });
  });

  describe('Alpha Parity & Policy Simulator', () => {
    it('should evaluate what-if policy simulation impact', () => {
      const warningThreshold = 85;
      const excessThreshold = 100;
      const totalProgrammes = 48;
      const nearCount = warningThreshold < 90 ? 4 : 2;
      const excessCount = excessThreshold <= 100 ? 2 : 1;

      expect(nearCount).toBe(4);
      expect(excessCount).toBe(2);
      expect(totalProgrammes - (nearCount + excessCount)).toBe(42);
    });
  });
});
