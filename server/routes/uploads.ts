import { Router, Response } from 'express';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import prisma from '../prisma.js';
import { authenticateToken, requireRoles, AuthenticatedRequest } from '../middleware/auth.js';
import { ApaarValidationEngine } from '../services/apaarValidator.js';
import { DuplicateDetector } from '../services/duplicateDetector.js';
import { ComplianceEngine } from '../services/complianceEngine.js';
import { AuditService } from '../services/auditService.js';

const router = Router();
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  storage: multer.memoryStorage(),
});

// Download standard AICTE CSV template
router.get('/template-csv', (_req, res: Response) => {
  const headers = [
    'apaarId',
    'studentRollNumber',
    'firstName',
    'lastName',
    'dateOfBirth',
    'gender',
    'category',
    'admissionCategory',
    'supernumeraryQuota',
    'nriOciStatus',
    'courseCode',
    'academicSession',
    'admissionDate'
  ];

  const sampleRows = [
    [
      '9874-5612-3450',
      '2024-CSE-001',
      'Aarav',
      'Sharma',
      '2005-04-12',
      'MALE',
      'GENERAL',
      'MERIT',
      'NONE',
      'NONE',
      'CSE-UG-101',
      '2024-2025',
      '2024-07-15'
    ],
    [
      '8763-4521-9872',
      '2024-CSE-002',
      'Diya',
      'Patel',
      '2005-08-23',
      'FEMALE',
      'OBC',
      'MERIT',
      'TFW',
      'NONE',
      'CSE-UG-101',
      '2024-2025',
      '2024-07-16'
    ],
    [
      '7652-3410-8761',
      '2024-CSE-003',
      'Vikram',
      'Singh',
      '2004-11-30',
      'MALE',
      'SC',
      'MERIT',
      'NONE',
      'NONE',
      'CSE-UG-101',
      '2024-2025',
      '2024-07-16'
    ]
  ];

  const csvContent = [headers.join(','), ...sampleRows.map(r => r.join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="aicte_student_upload_template.csv"');
  res.send(csvContent);
});

// Step 1 & 2: Parse and Preview uploaded file
router.post('/parse-preview', authenticateToken, upload.single('file'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    let rawCsv = '';

    if (req.file) {
      rawCsv = req.file.buffer.toString('utf8');
    } else if (req.body.csvText) {
      rawCsv = req.body.csvText;
    } else {
      res.status(400).json({ error: 'No CSV file or text provided.' });
      return;
    }

    const records = parse(rawCsv, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    if (records.length === 0) {
      res.status(400).json({ error: 'Uploaded file contains no data rows.' });
      return;
    }

    const availableColumns = Object.keys(records[0]);
    const expectedFields = [
      'apaarId',
      'studentRollNumber',
      'firstName',
      'lastName',
      'dateOfBirth',
      'gender',
      'category',
      'courseCode'
    ];

    // Column mapping detection
    const detectedMapping: Record<string, string> = {};
    for (const exp of expectedFields) {
      const match = availableColumns.find((c) =>
        c.toLowerCase().replace(/[^a-z0-9]/g, '') === exp.toLowerCase().replace(/[^a-z0-9]/g, '')
      );
      if (match) detectedMapping[exp] = match;
    }

    // Evaluate first 20 records for validation preview
    const evaluatedRows: any[] = [];
    let validCount = 0;
    let errorCount = 0;

    for (let i = 0; i < Math.min(records.length, 50); i++) {
      const row = records[i];
      const errors: string[] = [];
      const warnings: string[] = [];

      const apaar = row['apaarId'] || row[detectedMapping['apaarId']] || '';
      const roll = row['studentRollNumber'] || row[detectedMapping['studentRollNumber']] || '';
      const fname = row['firstName'] || row[detectedMapping['firstName']] || '';
      const lname = row['lastName'] || row[detectedMapping['lastName']] || '';

      if (!apaar) errors.push('Missing APAAR Identifier');
      else {
        const syntaxOutcomes = ApaarValidationEngine.validateSyntax(apaar);
        for (const out of syntaxOutcomes) {
          if (out.resultStatus === 'FAILED') errors.push(out.message);
        }
      }

      if (!roll) errors.push('Missing Student Roll Number');
      if (!fname) errors.push('Missing First Name');

      if (errors.length > 0) errorCount++;
      else validCount++;

      evaluatedRows.push({
        rowIndex: i + 1,
        data: row,
        errors,
        warnings,
        isValid: errors.length === 0,
      });
    }

    res.json({
      totalRows: records.length,
      sampleRows: evaluatedRows.slice(0, 10),
      detectedMapping,
      availableColumns,
      previewSummary: {
        totalEvaluated: evaluatedRows.length,
        validInPreview: validCount,
        errorsInPreview: errorCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error parsing CSV file: ' + error.message });
  }
});

// Step 5 & 6: Submit Batch for Ingestion & Processing
router.post('/submit-batch', authenticateToken, requireRoles('AICTE_ADMIN', 'INSTITUTION_ADMIN', 'DATA_ENTRY_OPERATOR'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { records, institutionId, courseId, academicSession = '2024-2025', fileName = 'bulk_upload.csv' } = req.body;

  const targetInstId = req.user!.institutionId || institutionId;
  if (!targetInstId) {
    res.status(400).json({ error: 'Institution ID required.' });
    return;
  }

  if (!records || !Array.isArray(records) || records.length === 0) {
    res.status(400).json({ error: 'No records provided for submission.' });
    return;
  }

  try {
    const batchNumber = `BATCH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const batch = await prisma.submissionBatch.create({
      data: {
        batchNumber,
        institutionId: targetInstId,
        submittedByUserId: req.user!.id,
        academicSession,
        totalRecords: records.length,
        status: 'PROCESSING',
        fileName,
      },
    });

    let successCount = 0;
    let flaggedCount = 0;
    let rejectedCount = 0;
    const errorRows: any[] = [];
    const insertedStudentIds: string[] = [];

    // Resolve course
    let targetCourseId = courseId;
    if (!targetCourseId) {
      const defaultCourse = await prisma.course.findFirst({
        where: { institutionId: targetInstId },
      });
      targetCourseId = defaultCourse?.id;
    }

    if (!targetCourseId) {
      res.status(400).json({ error: 'No valid academic course found for institution.' });
      return;
    }

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rawApaar = row.apaarId || row.apaar || '';
      const rollNumber = row.studentRollNumber || row.rollNo || `2024-REC-${i + 1}`;
      const firstName = row.firstName || row.first_name || 'Student';
      const lastName = row.lastName || row.last_name || `${i + 1}`;
      const dateOfBirth = row.dateOfBirth || row.dob || '2005-01-01';
      const gender = (row.gender || 'MALE').toUpperCase();
      const category = (row.category || 'GENERAL').toUpperCase();
      const supernumerary = (row.supernumeraryQuota || 'NONE').toUpperCase();
      const nriOci = (row.nriOciStatus || 'NONE').toUpperCase();

      const normalizedApaar = ApaarValidationEngine.normalizeApaar(rawApaar);
      const syntaxOutcomes = ApaarValidationEngine.validateSyntax(normalizedApaar);
      const isSyntaxFail = syntaxOutcomes.some((s) => s.resultStatus === 'FAILED');

      if (isSyntaxFail) {
        rejectedCount++;
        errorRows.push({
          row: i + 1,
          rollNumber,
          apaar: rawApaar,
          reason: syntaxOutcomes.map((s) => s.message).join('; '),
        });
        continue;
      }

      // Check intra-file duplicate
      const duplicateInBatch = records.slice(0, i).some(
        (prev) => ApaarValidationEngine.normalizeApaar(prev.apaarId || prev.apaar || '') === normalizedApaar
      );

      if (duplicateInBatch) {
        flaggedCount++;
        errorRows.push({
          row: i + 1,
          rollNumber,
          apaar: rawApaar,
          reason: 'Duplicate APAAR detected within this same uploaded batch file.',
        });
        continue;
      }

      try {
        const student = await prisma.student.create({
          data: {
            apaarId: normalizedApaar,
            studentRollNumber: rollNumber,
            institutionId: targetInstId,
            courseId: targetCourseId,
            firstName,
            lastName,
            dateOfBirth,
            gender,
            category,
            admissionCategory: row.admissionCategory || 'MERIT',
            supernumeraryQuota: supernumerary,
            nriOciStatus: nriOci,
            academicSession,
            admissionDate: row.admissionDate || new Date().toISOString().split('T')[0],
            recordStatus: 'VERIFIED',
            provenance: `BATCH_UPLOAD_${batchNumber}`,
          },
        });

        insertedStudentIds.push(student.id);
        successCount++;

        // Duplicate detector scan
        await DuplicateDetector.scanStudent(student.id);
      } catch (err: any) {
        rejectedCount++;
        errorRows.push({
          row: i + 1,
          rollNumber,
          reason: 'Database insertion error: ' + err.message,
        });
      }
    }

    // Run compliance re-check on the affected course
    await ComplianceEngine.evaluateCourseCompliance(targetInstId, targetCourseId, academicSession);

    // Update batch status
    await prisma.submissionBatch.update({
      where: { id: batch.id },
      data: {
        validRecords: successCount,
        flaggedRecords: flaggedCount,
        rejectedRecords: rejectedCount,
        status: rejectedCount > 0 ? 'REQUIRES_CORRECTION' : 'APPROVED',
      },
    });

    await AuditService.recordEvent({
      actorId: req.user!.id,
      actorRole: req.user!.role,
      actorEmail: req.user!.email,
      institutionId: targetInstId,
      action: 'BULK_UPLOAD_INGESTION',
      targetType: 'SubmissionBatch',
      targetId: batch.id,
      details: {
        batchNumber,
        total: records.length,
        successCount,
        rejectedCount,
        courseId: targetCourseId,
      },
    });

    res.json({
      batchId: batch.id,
      batchNumber,
      totalProcessed: records.length,
      validRecords: successCount,
      flaggedRecords: flaggedCount,
      rejectedRecords: rejectedCount,
      status: rejectedCount > 0 ? 'REQUIRES_CORRECTION' : 'APPROVED',
      errorRows,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// List submission batches
router.get('/batches', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const where: any = {};
  if (['INSTITUTION_ADMIN', 'DATA_ENTRY_OPERATOR'].includes(req.user!.role)) {
    where.institutionId = req.user!.institutionId;
  }

  try {
    const batches = await prisma.submissionBatch.findMany({
      where,
      include: {
        institution: { select: { name: true, code: true } },
        submittedBy: { select: { fullName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(batches);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
