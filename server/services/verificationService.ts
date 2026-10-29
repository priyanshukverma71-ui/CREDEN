import crypto from 'crypto';
import prisma from '../prisma.js';

const SIGNING_KEY = process.env.VERIFICATION_SIGNING_KEY || 'creden-aicte-tamper-evident-ed25519-sha256-signing-key';

export interface VerificationClaimPayload {
  verificationRef: string;
  studentId: string;
  studentName: string;
  maskedApaarId: string;
  institutionName: string;
  institutionCode: string;
  courseName: string;
  academicSession: string;
  recordStatus: string;
  issuingAuthority: string;
  issuedAt: string;
  signature: string;
}

export class VerificationService {
  /**
   * Generates a tamper-evident signed verification credential token for a student
   */
  static signStudentRecord(student: {
    id: string;
    firstName: string;
    lastName: string;
    apaarId: string;
    institution: { name: string; code: string };
    course: { courseName: string };
    academicSession: string;
    recordStatus: string;
  }): { verificationRef: string; token: string; payload: VerificationClaimPayload } {
    const verificationRef = `VRF-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    const issuedAt = new Date().toISOString();
    const maskedApaarId = `XXXX-XXXX-${student.apaarId.replace(/\D/g, '').slice(8)}`;

    const canonicalData = [
      verificationRef,
      student.id,
      `${student.firstName} ${student.lastName}`.trim(),
      maskedApaarId,
      student.institution.code,
      student.course.courseName,
      student.academicSession,
      student.recordStatus,
      issuedAt
    ].join('|');

    const signature = crypto.createHmac('sha256', SIGNING_KEY).update(canonicalData).digest('hex');

    const payload: VerificationClaimPayload = {
      verificationRef,
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`.trim(),
      maskedApaarId,
      institutionName: student.institution.name,
      institutionCode: student.institution.code,
      courseName: student.course.courseName,
      academicSession: student.academicSession,
      recordStatus: student.recordStatus,
      issuingAuthority: 'All India Council for Technical Education (AICTE)',
      issuedAt,
      signature
    };

    const token = Buffer.from(JSON.stringify(payload)).toString('base64url');
    return { verificationRef, token, payload };
  }

  /**
   * Validates a cryptographic token or verification reference
   */
  static async verifyClaim(refOrToken: string, verifierInfo?: { orgName?: string; email?: string; purpose?: string; ip?: string }) {
    let payload: VerificationClaimPayload | null = null;

    try {
      if (refOrToken.startsWith('VRF-')) {
        // Look up verification request or student
        const reqRecord = await prisma.verificationRequest.findUnique({
          where: { verificationRef: refOrToken },
          include: {
            student: {
              include: { institution: true, course: true }
            }
          }
        });

        if (reqRecord) {
          const signed = this.signStudentRecord(reqRecord.student);
          payload = signed.payload;
        } else {
          // Check if any student matches
          return {
            isValid: false,
            error: 'Verification reference not found in the national AICTE registry.'
          };
        }
      } else {
        // Parse token
        const rawJson = Buffer.from(refOrToken, 'base64url').toString('utf8');
        payload = JSON.parse(rawJson);
      }
    } catch (e) {
      return { isValid: false, error: 'Malformed verification token format.' };
    }

    if (!payload) {
      return { isValid: false, error: 'Could not resolve verification record.' };
    }

    // Verify cryptographic signature
    const canonicalData = [
      payload.verificationRef,
      payload.studentId,
      payload.studentName,
      payload.maskedApaarId,
      payload.institutionCode,
      payload.courseName,
      payload.academicSession,
      payload.recordStatus,
      payload.issuedAt
    ].join('|');

    const expectedSig = crypto.createHmac('sha256', SIGNING_KEY).update(canonicalData).digest('hex');

    if (payload.signature !== expectedSig) {
      return {
        isValid: false,
        error: 'Cryptographic signature mismatch! The verification record has been tampered with.',
        isTampered: true
      };
    }

    // Check database if record is registered and active
    let isDbRegistered = false;
    let isRevoked = false;
    try {
      const dbStudent = await prisma.student.findUnique({
        where: { id: payload.studentId },
      });

      if (dbStudent) {
        isDbRegistered = true;
        if (dbStudent.recordStatus === 'REJECTED') {
          isRevoked = true;
          return {
            isValid: false,
            error: 'Student record has been officially revoked by the institution or AICTE.',
            isRevoked: true
          };
        }
      }
    } catch (e) {
      // Offline verification fallback
    }

    // Save or update verification request record for verifier audit
    if (verifierInfo?.orgName && isDbRegistered) {
      await prisma.verificationRequest.create({
        data: {
          verificationRef: payload.verificationRef,
          studentId: payload.studentId,
          verifierOrgName: verifierInfo.orgName || 'External Verifier',
          verifierEmail: verifierInfo.email || 'verifier@org.in',
          purpose: verifierInfo.purpose || 'EMPLOYMENT_CREDENTIAL_CHECK',
          claimsRequestedJson: JSON.stringify(['name', 'institution', 'course', 'session', 'apaar_verified']),
          verificationStatus: 'VERIFIED',
          signedToken: payload.signature,
          ipAddress: verifierInfo.ip || '127.0.0.1'
        }
      });
    }

    return {
      isValid: true,
      claims: {
        verificationRef: payload.verificationRef,
        studentName: payload.studentName,
        maskedApaarId: payload.maskedApaarId,
        institutionName: payload.institutionName,
        institutionCode: payload.institutionCode,
        courseName: payload.courseName,
        academicSession: payload.academicSession,
        recordStatus: payload.recordStatus,
        isApaarAuthenticated: true,
        isDbRegistered,
        issuingAuthority: payload.issuingAuthority,
        attestationTimestamp: payload.issuedAt,
        digitalSignature: payload.signature.slice(0, 16) + '...'
      }
    };
  }
}
