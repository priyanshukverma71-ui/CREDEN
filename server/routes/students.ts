import { Router, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, requireRoles, AuthenticatedRequest } from '../middleware/auth.js';
import { ApaarValidationEngine } from '../services/apaarValidator.js';
import { DuplicateDetector } from '../services/duplicateDetector.js';
import { AuditService } from '../services/auditService.js';
import { VerificationService } from '../services/verificationService.js';

const router = Router();

// List students with pagination & filters
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const {
    institutionId,
    courseId,
    academicSession,
    recordStatus,
    category,
    search,
    page = '1',
    limit = '25',
  } = req.query;

  const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
  const take = parseInt(limit as string, 10);

  const where: any = {};

  // Data isolation
  if (['INSTITUTION_ADMIN', 'DATA_ENTRY_OPERATOR'].includes(req.user!.role)) {
    where.institutionId = req.user!.institutionId;
  } else if (institutionId) {
    where.institutionId = institutionId as string;
  }

  if (courseId) where.courseId = courseId as string;
  if (academicSession) where.academicSession = academicSession as string;
  if (recordStatus) where.recordStatus = recordStatus as string;
  if (category) where.category = category as string;

  if (search) {
    const s = search as string;
    where.OR = [
      { firstName: { contains: s } },
      { lastName: { contains: s } },
      { studentRollNumber: { contains: s } },
      { apaarId: { contains: s } },
    ];
  }

  try {
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take,
        include: {
          institution: { select: { id: true, name: true, code: true } },
          course: { select: { id: true, courseName: true, courseCode: true } },
          validationResults: {
            take: 3,
            orderBy: { validatedAt: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.student.count({ where }),
    ]);

    // Mask APAAR for non-privileged or general list views
    const formatted = students.map((s) => ({
      ...s,
      maskedApaarId: ApaarValidationEngine.maskApaar(s.apaarId),
      // Only keep full apaarId if privileged role
      apaarId: ['AICTE_ADMIN', 'VERIFICATION_OFFICER', 'INSTITUTION_ADMIN'].includes(req.user!.role)
        ? s.apaarId
        : ApaarValidationEngine.maskApaar(s.apaarId),
    }));

    res.json({
      data: formatted,
      pagination: {
        total,
        page: parseInt(page as string, 10),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get single student
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        institution: true,
        course: true,
        validationResults: {
          orderBy: { validatedAt: 'desc' },
        },
        versions: {
          orderBy: { versionNumber: 'desc' },
        },
        duplicateAsPrimary: {
          include: {
            studentB: {
              include: { institution: true, course: true },
            },
          },
        },
        duplicateAsSecondary: {
          include: {
            studentA: {
              include: { institution: true, course: true },
            },
          },
        },
      },
    });

    if (!student) {
      res.status(404).json({ error: 'Student record not found.' });
      return;
    }

    // Institution isolation
    if (['INSTITUTION_ADMIN', 'DATA_ENTRY_OPERATOR'].includes(req.user!.role)) {
      if (student.institutionId !== req.user!.institutionId) {
        res.status(403).json({ error: 'Data Isolation: Cannot access records of other institutions.' });
        return;
      }
    }

    res.json({
      ...student,
      maskedApaarId: ApaarValidationEngine.maskApaar(student.apaarId),
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create single student record manually
router.post('/', authenticateToken, requireRoles('AICTE_ADMIN', 'INSTITUTION_ADMIN', 'DATA_ENTRY_OPERATOR'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const {
    apaarId,
    studentRollNumber,
    institutionId,
    courseId,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    category,
    admissionCategory = 'MERIT',
    supernumeraryQuota = 'NONE',
    nriOciStatus = 'NONE',
    academicSession = '2024-2025',
    admissionDate = new Date().toISOString().split('T')[0],
  } = req.body;

  const targetInstId = req.user!.institutionId || institutionId;
  if (!targetInstId) {
    res.status(400).json({ error: 'Institution ID is required.' });
    return;
  }

  try {
    const normalizedApaar = ApaarValidationEngine.normalizeApaar(apaarId);

    // Initial syntax validation
    const syntaxOutcomes = ApaarValidationEngine.validateSyntax(normalizedApaar);
    const hasSyntaxError = syntaxOutcomes.some((o) => o.resultStatus === 'FAILED');

    // Create the student
    const student = await prisma.student.create({
      data: {
        apaarId: normalizedApaar,
        studentRollNumber,
        institutionId: targetInstId,
        courseId,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        category,
        admissionCategory,
        supernumeraryQuota,
        nriOciStatus,
        academicSession,
        admissionDate,
        recordStatus: hasSyntaxError ? 'CORRECTION_REQUIRED' : 'VALIDATING',
        provenance: `MANUAL_ENTRY_BY_${req.user!.role}`,
      },
      include: {
        institution: true,
        course: true,
      },
    });

    // Record initial version 1
    await prisma.studentRecordVersion.create({
      data: {
        studentId: student.id,
        versionNumber: 1,
        changedBy: req.user!.email,
        reason: 'Initial manual ingestion',
        snapshotJson: JSON.stringify(student),
      },
    });

    // Save syntax validation results
    for (const out of syntaxOutcomes) {
      await prisma.validationResult.create({
        data: {
          studentId: student.id,
          ruleId: out.ruleId,
          ruleVersion: out.ruleVersion,
          severity: out.severity,
          resultStatus: out.resultStatus,
          message: out.message,
          detailsJson: out.details ? JSON.stringify(out.details) : null,
          recommendedAction: out.recommendedAction,
        },
      });
    }

    // Check database duplicates & concurrent enrolments
    const dupOutcomes = await ApaarValidationEngine.checkDatabaseDuplicates(
      student.id,
      normalizedApaar,
      targetInstId,
      academicSession
    );

    for (const out of dupOutcomes) {
      await prisma.validationResult.create({
        data: {
          studentId: student.id,
          ruleId: out.ruleId,
          ruleVersion: out.ruleVersion,
          severity: out.severity,
          resultStatus: out.resultStatus,
          message: out.message,
          detailsJson: out.details ? JSON.stringify(out.details) : null,
          recommendedAction: out.recommendedAction,
        },
      });
    }

    // Trigger full duplicate detector
    await DuplicateDetector.scanStudent(student.id);

    // Check if authoritative check should be simulated
    if (!hasSyntaxError) {
      const sim = ApaarValidationEngine.simulateAuthoritativeVerification(
        normalizedApaar,
        `${firstName} ${lastName}`
      );
      if (sim.authoritativeStatus === 'VERIFIED') {
        await prisma.student.update({
          where: { id: student.id },
          data: { recordStatus: 'VERIFIED' },
        });
      } else {
        await prisma.student.update({
          where: { id: student.id },
          data: { recordStatus: 'UNDER_REVIEW' },
        });
      }
    }

    // Audit log
    await AuditService.recordEvent({
      actorId: req.user!.id,
      actorRole: req.user!.role,
      actorEmail: req.user!.email,
      institutionId: targetInstId,
      action: 'STUDENT_CREATE_MANUAL',
      targetType: 'Student',
      targetId: student.id,
      details: { rollNumber: studentRollNumber, courseId, hasSyntaxError },
    });

    res.status(201).json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update student record with versioning snapshot
router.put('/:id', authenticateToken, requireRoles('AICTE_ADMIN', 'INSTITUTION_ADMIN', 'DATA_ENTRY_OPERATOR'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;
  const { reason = 'Authorized administrative correction' } = updateData;

  try {
    const existing = await prisma.student.findUnique({
      where: { id },
      include: { versions: { orderBy: { versionNumber: 'desc' }, take: 1 } },
    });

    if (!existing) {
      res.status(404).json({ error: 'Student record not found.' });
      return;
    }

    // Data isolation
    if (['INSTITUTION_ADMIN', 'DATA_ENTRY_OPERATOR'].includes(req.user!.role)) {
      if (existing.institutionId !== req.user!.institutionId) {
        res.status(403).json({ error: 'Data Isolation: Cannot modify records of other institutions.' });
        return;
      }
    }

    const nextVersion = (existing.versions[0]?.versionNumber || 1) + 1;

    // Snapshot existing before update
    await prisma.studentRecordVersion.create({
      data: {
        studentId: id,
        versionNumber: nextVersion,
        changedBy: req.user!.email,
        reason,
        snapshotJson: JSON.stringify(existing),
      },
    });

    const updated = await prisma.student.update({
      where: { id },
      data: {
        firstName: updateData.firstName ?? existing.firstName,
        lastName: updateData.lastName ?? existing.lastName,
        apaarId: updateData.apaarId ? ApaarValidationEngine.normalizeApaar(updateData.apaarId) : existing.apaarId,
        studentRollNumber: updateData.studentRollNumber ?? existing.studentRollNumber,
        dateOfBirth: updateData.dateOfBirth ?? existing.dateOfBirth,
        gender: updateData.gender ?? existing.gender,
        category: updateData.category ?? existing.category,
        admissionCategory: updateData.admissionCategory ?? existing.admissionCategory,
        supernumeraryQuota: updateData.supernumeraryQuota ?? existing.supernumeraryQuota,
        nriOciStatus: updateData.nriOciStatus ?? existing.nriOciStatus,
        recordStatus: updateData.recordStatus ?? 'VALIDATING',
      },
      include: { institution: true, course: true },
    });

    // Re-run validation & duplicate detection
    const syntax = ApaarValidationEngine.validateSyntax(updated.apaarId);
    if (syntax.some((s) => s.resultStatus === 'FAILED')) {
      await prisma.student.update({
        where: { id },
        data: { recordStatus: 'CORRECTION_REQUIRED' },
      });
    } else {
      await prisma.student.update({
        where: { id },
        data: { recordStatus: 'VERIFIED' },
      });
    }

    await DuplicateDetector.scanStudent(id);

    await AuditService.recordEvent({
      actorId: req.user!.id,
      actorRole: req.user!.role,
      actorEmail: req.user!.email,
      institutionId: existing.institutionId,
      action: 'STUDENT_UPDATE_CORRECTION',
      targetType: 'Student',
      targetId: id,
      details: { version: nextVersion, reason },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get printable / verifiable certificate payload
router.get('/:id/certificate', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const student = await prisma.student.findUnique({
      where: { id },
      include: { institution: true, course: true },
    });

    if (!student) {
      res.status(404).json({ error: 'Student record not found.' });
      return;
    }

    const signed = VerificationService.signStudentRecord(student);

    res.json({
      certificateReferenceNumber: `AIC-CERT-${student.academicSession}-${student.studentRollNumber}`,
      studentName: `${student.firstName} ${student.lastName}`.trim(),
      maskedApaarId: ApaarValidationEngine.maskApaar(student.apaarId),
      studentRollNumber: student.studentRollNumber,
      institutionName: student.institution.name,
      institutionCode: student.institution.code,
      courseName: student.course.courseName,
      degreeLevel: student.course.degreeLevel,
      academicSession: student.academicSession,
      admissionDate: student.admissionDate,
      recordStatus: student.recordStatus,
      verificationRef: signed.verificationRef,
      verificationToken: signed.token,
      verificationUrl: `/verify?ref=${signed.verificationRef}`,
      digitalSignature: signed.payload.signature,
      issuedDate: new Date().toISOString().split('T')[0],
      accreditationStatus: student.institution.accreditedBy || 'AICTE Approved Technical Programme',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
