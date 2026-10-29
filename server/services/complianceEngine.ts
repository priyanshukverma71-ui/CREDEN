import prisma from '../prisma.js';

export interface IntakeComplianceReport {
  institutionId: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  academicSession: string;
  approvedIntake: number;
  actualEnrolment: number;
  capacityUtilization: number; // percentage
  remainingCapacity: number;
  excessCount: number;
  isOverIntake: boolean;
  
  categoryBreakdown: {
    general: { approved: number; actual: number; diff: number };
    obc: { approved: number; actual: number; diff: number };
    sc: { approved: number; actual: number; diff: number };
    st: { approved: number; actual: number; diff: number };
    ews: { approved: number; actual: number; diff: number };
  };

  supernumeraryBreakdown: {
    tfw: { allowed: number; actual: number; excess: number };
    pmsss: { allowed: number; actual: number; excess: number };
    nri: { allowed: number; actual: number; excess: number };
  };

  policyVersion: string;
  status: 'COMPLIANT' | 'OVER_INTAKE' | 'QUOTA_BREACH' | 'WARNING';
  actionRequired: string | null;
}

export class ComplianceEngine {
  static POLICY_VERSION = 'AICTE-APH-2024-25-RULES-V2.1';

  /**
   * Evaluates admission compliance for a specific course & session in an institution
   */
  static async evaluateCourseCompliance(
    institutionId: string,
    courseId: string,
    academicSession: string
  ): Promise<IntakeComplianceReport> {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        intakeConfigs: {
          where: { academicSession },
          take: 1
        }
      }
    });

    if (!course) {
      throw new Error(`Course ${courseId} not found`);
    }

    const config = course.intakeConfigs[0] || {
      generalSeats: Math.round(course.approvedIntake * 0.40),
      obcSeats: Math.round(course.approvedIntake * 0.27),
      scSeats: Math.round(course.approvedIntake * 0.15),
      stSeats: Math.round(course.approvedIntake * 0.075),
      ewsSeats: Math.round(course.approvedIntake * 0.10),
      tfwQuota: Math.round(course.approvedIntake * 0.05), // AICTE 5% supernumerary
      pmsssQuota: 5,
      nriQuota: Math.round(course.approvedIntake * 0.15), // AICTE max 15% NRI
    };

    // Query actual admitted students
    const students = await prisma.student.findMany({
      where: {
        institutionId,
        courseId,
        academicSession,
        recordStatus: { notIn: ['REJECTED', 'CLOSED'] }
      }
    });

    // Partition into regular and supernumerary
    const regularStudents = students.filter(s => s.supernumeraryQuota === 'NONE' || !s.supernumeraryQuota);
    const tfwStudents = students.filter(s => s.supernumeraryQuota === 'TFW');
    const pmsssStudents = students.filter(s => s.supernumeraryQuota === 'PMSSS');
    const nriStudents = students.filter(s => s.nriOciStatus === 'NRI' || s.nriOciStatus === 'OCI');

    // Category counts for regular admissions
    const generalCount = regularStudents.filter(s => s.category === 'GENERAL').length;
    const obcCount = regularStudents.filter(s => s.category === 'OBC').length;
    const scCount = regularStudents.filter(s => s.category === 'SC').length;
    const stCount = regularStudents.filter(s => s.category === 'ST').length;
    const ewsCount = regularStudents.filter(s => s.category === 'EWS').length;

    const actualRegular = regularStudents.length;
    const approvedIntake = course.approvedIntake;
    const excessCount = Math.max(0, actualRegular - approvedIntake);
    const capacityUtilization = approvedIntake > 0 ? (actualRegular / approvedIntake) * 100 : 0;
    const remainingCapacity = Math.max(0, approvedIntake - actualRegular);

    const isOverIntake = excessCount > 0;
    const tfwExcess = Math.max(0, tfwStudents.length - config.tfwQuota);
    const nriExcess = Math.max(0, nriStudents.length - config.nriQuota);

    let status: 'COMPLIANT' | 'OVER_INTAKE' | 'QUOTA_BREACH' | 'WARNING' = 'COMPLIANT';
    let actionRequired: string | null = null;

    if (isOverIntake) {
      status = 'OVER_INTAKE';
      actionRequired = `Immediate AICTE Hearing Required: Admitted ${actualRegular} students exceeding approved sanction limit of ${approvedIntake} by +${excessCount} seats.`;
      
      // Upsert compliance discrepancy record
      await prisma.complianceDiscrepancy.upsert({
        where: {
          id: `DISC-${institutionId}-${courseId}-${academicSession}`
        },
        update: {
          approvedLimit: approvedIntake,
          actualCount: actualRegular,
          excessCount: excessCount,
          explanation: `Automated detection: ${actualRegular} regular admissions detected against approved intake ${approvedIntake}. Excess of ${excessCount} unapproved admissions.`,
          status: 'OPEN'
        },
        create: {
          id: `DISC-${institutionId}-${courseId}-${academicSession}`,
          institutionId,
          courseId,
          academicSession,
          discrepancyType: 'OVER_INTAKE',
          approvedLimit: approvedIntake,
          actualCount: actualRegular,
          excessCount: excessCount,
          explanation: `Automated detection: ${actualRegular} regular admissions detected against approved intake ${approvedIntake}. Excess of ${excessCount} unapproved admissions.`,
          status: 'OPEN'
        }
      });
    } else if (tfwExcess > 0 || nriExcess > 0) {
      status = 'QUOTA_BREACH';
      actionRequired = `Supernumerary Quota Breach: Exceeded ceiling in TFW or NRI quota. Review category allocations.`;
    } else if (capacityUtilization >= 95) {
      status = 'WARNING';
      actionRequired = `Sanction capacity near 100% threshold (${capacityUtilization.toFixed(1)}%). Monitor further admissions.`;
    }

    return {
      institutionId,
      courseId,
      courseName: course.courseName,
      courseCode: course.courseCode,
      academicSession,
      approvedIntake,
      actualEnrolment: actualRegular,
      capacityUtilization: parseFloat(capacityUtilization.toFixed(1)),
      remainingCapacity,
      excessCount,
      isOverIntake,
      categoryBreakdown: {
        general: { approved: config.generalSeats, actual: generalCount, diff: generalCount - config.generalSeats },
        obc: { approved: config.obcSeats, actual: obcCount, diff: obcCount - config.obcSeats },
        sc: { approved: config.scSeats, actual: scCount, diff: scCount - config.scSeats },
        st: { approved: config.stSeats, actual: stCount, diff: stCount - config.stSeats },
        ews: { approved: config.ewsSeats, actual: ewsCount, diff: ewsCount - config.ewsSeats }
      },
      supernumeraryBreakdown: {
        tfw: { allowed: config.tfwQuota, actual: tfwStudents.length, excess: tfwExcess },
        pmsss: { allowed: config.pmsssQuota, actual: pmsssStudents.length, excess: 0 },
        nri: { allowed: config.nriQuota, actual: nriStudents.length, excess: nriExcess }
      },
      policyVersion: this.POLICY_VERSION,
      status,
      actionRequired
    };
  }

  /**
   * Scans all courses for an institution or all institutions
   */
  static async evaluateAll(institutionId?: string, academicSession: string = '2024-2025') {
    const where: any = {};
    if (institutionId) where.institutionId = institutionId;

    const courses = await prisma.course.findMany({
      where,
      select: { id: true, institutionId: true, academicSession: true }
    });

    const reports: IntakeComplianceReport[] = [];
    for (const c of courses) {
      const rep = await this.evaluateCourseCompliance(c.institutionId, c.id, academicSession || c.academicSession);
      reports.push(rep);
    }
    return reports;
  }
}
