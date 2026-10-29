import { Router, Response } from 'express';
import prisma from '../prisma.js';
import { authenticateToken, requireRoles, AuthenticatedRequest } from '../middleware/auth.js';
import { AuditService } from '../services/auditService.js';

const router = Router();

// List institutions
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { search, state, type, approvalStatus, page = '1', limit = '20' } = req.query;
  const skip = (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
  const take = parseInt(limit as string, 10);

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search as string } },
      { code: { contains: search as string } },
      { district: { contains: search as string } },
    ];
  }
  if (state) where.state = state as string;
  if (type) where.type = type as string;
  if (approvalStatus) where.approvalStatus = approvalStatus as string;

  // Data isolation: If user is INSTITUTION_ADMIN or DATA_ENTRY_OPERATOR, restrict to their own institution
  if (['INSTITUTION_ADMIN', 'DATA_ENTRY_OPERATOR'].includes(req.user!.role) && req.user!.institutionId) {
    where.id = req.user!.institutionId;
  }

  try {
    const [institutions, total] = await Promise.all([
      prisma.institution.findMany({
        where,
        skip,
        take,
        include: {
          _count: {
            select: { students: true, courses: true, discrepancies: true },
          },
          courses: {
            select: {
              approvedIntake: true,
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.institution.count({ where }),
    ]);

    const formatted = institutions.map((inst) => {
      const totalApprovedIntake = inst.courses.reduce((sum, c) => sum + c.approvedIntake, 0);
      return {
        id: inst.id,
        code: inst.code,
        name: inst.name,
        state: inst.state,
        district: inst.district,
        type: inst.type,
        establishedYear: inst.establishedYear,
        approvalStatus: inst.approvalStatus,
        accreditedBy: inst.accreditedBy,
        totalCourses: inst._count.courses,
        totalStudents: inst._count.students,
        totalApprovedIntake,
        discrepancyCount: inst._count.discrepancies,
      };
    });

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

// Get single institution detail
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  // Institution isolation check
  if (['INSTITUTION_ADMIN', 'DATA_ENTRY_OPERATOR'].includes(req.user!.role)) {
    if (req.user!.institutionId && req.user!.institutionId !== id) {
      res.status(403).json({ error: 'Access Denied: You cannot view details of other institutions.' });
      return;
    }
  }

  try {
    const institution = await prisma.institution.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            intakeConfigs: true,
            _count: {
              select: { students: true },
            },
          },
        },
        _count: {
          select: {
            students: true,
            discrepancies: true,
            submissionBatches: true,
          },
        },
      },
    });

    if (!institution) {
      res.status(404).json({ error: 'Institution not found.' });
      return;
    }

    res.json(institution);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create course for institution (AICTE_ADMIN or INSTITUTION_ADMIN)
router.post('/:id/courses', authenticateToken, requireRoles('AICTE_ADMIN', 'INSTITUTION_ADMIN'), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { courseCode, courseName, degreeLevel, durationYears, approvedIntake, academicSession } = req.body;

  try {
    const course = await prisma.course.create({
      data: {
        institutionId: id,
        courseCode,
        courseName,
        degreeLevel: degreeLevel || 'UG',
        durationYears: durationYears || 4,
        approvedIntake: parseInt(approvedIntake, 10),
        academicSession: academicSession || '2024-2025',
      },
    });

    // Generate default AICTE quota configuration
    await prisma.intakeConfig.create({
      data: {
        institutionId: id,
        courseId: course.id,
        academicSession: course.academicSession,
        generalSeats: Math.round(course.approvedIntake * 0.40),
        obcSeats: Math.round(course.approvedIntake * 0.27),
        scSeats: Math.round(course.approvedIntake * 0.15),
        stSeats: Math.round(course.approvedIntake * 0.075),
        ewsSeats: Math.round(course.approvedIntake * 0.10),
        tfwQuota: Math.round(course.approvedIntake * 0.05),
        pmsssQuota: 5,
        nriQuota: Math.round(course.approvedIntake * 0.15),
      },
    });

    await AuditService.recordEvent({
      actorId: req.user!.id,
      actorRole: req.user!.role,
      actorEmail: req.user!.email,
      institutionId: id,
      action: 'COURSE_CREATE',
      targetType: 'Course',
      targetId: course.id,
      details: { courseCode, courseName, approvedIntake },
    });

    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
