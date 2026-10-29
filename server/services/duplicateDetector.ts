import prisma from '../prisma.js';

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const lenA = a.length;
  const lenB = b.length;

  for (let i = 0; i <= lenA; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= lenB; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= lenA; i++) {
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1].toLowerCase() === b[j - 1].toLowerCase() ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[lenA][lenB];
}

export class DuplicateDetector {
  /**
   * Scans a newly inserted or updated student record against database for all duplicate categories
   */
  static async scanStudent(studentId: string): Promise<string[]> {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { institution: true, course: true }
    });

    if (!student) return [];

    const caseIds: string[] = [];

    // 1. Exact APAAR duplicates
    const exactApaarMatches = await prisma.student.findMany({
      where: {
        apaarId: student.apaarId,
        id: { not: student.id }
      },
      include: { institution: true, course: true }
    });

    for (const match of exactApaarMatches) {
      const isConcurrent = match.academicSession === student.academicSession && match.institutionId !== student.institutionId;
      const matchType = isConcurrent ? 'CONCURRENT_ENROLMENT' : (match.institutionId === student.institutionId ? 'EXACT_APAAR' : 'CROSS_INSTITUTION_APAAR');
      const caseRef = `DUP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Check if duplicate case already exists for this pair
      const existing = await prisma.duplicateCase.findFirst({
        where: {
          OR: [
            { studentIdA: student.id, studentIdB: match.id },
            { studentIdA: match.id, studentIdB: student.id }
          ]
        }
      });

      if (!existing) {
        const newCase = await prisma.duplicateCase.create({
          data: {
            caseReference: caseRef,
            studentIdA: student.id,
            studentIdB: match.id,
            matchType,
            confidenceScore: 1.0,
            matchingFieldsJson: JSON.stringify(['apaarId', isConcurrent ? 'academicSession' : '']),
            status: 'OPEN',
            evidenceNotes: isConcurrent
              ? `Flagged Concurrent Enrolment: APAAR ${student.apaarId} is concurrently admitted at ${student.institution.name} and ${match.institution.name} for session ${student.academicSession}.`
              : `Exact APAAR match detected between roll number ${student.studentRollNumber} and roll number ${match.studentRollNumber}.`
          }
        });
        caseIds.push(newCase.id);
      }
    }

    // 2. Fuzzy identity match (Name similarity + identical DOB + identical Gender)
    const candidates = await prisma.student.findMany({
      where: {
        id: { not: student.id },
        dateOfBirth: student.dateOfBirth,
        gender: student.gender,
        apaarId: { not: student.apaarId } // different APAAR but same person details
      },
      include: { institution: true, course: true }
    });

    const fullNameA = `${student.firstName} ${student.lastName}`.trim().toLowerCase();

    for (const cand of candidates) {
      const fullNameB = `${cand.firstName} ${cand.lastName}`.trim().toLowerCase();
      const distance = levenshteinDistance(fullNameA, fullNameB);
      const maxLen = Math.max(fullNameA.length, fullNameB.length);
      const similarity = 1 - (distance / maxLen);

      // High similarity threshold
      if (similarity >= 0.85 || distance <= 2) {
        const existing = await prisma.duplicateCase.findFirst({
          where: {
            OR: [
              { studentIdA: student.id, studentIdB: cand.id },
              { studentIdA: cand.id, studentIdB: student.id }
            ]
          }
        });

        if (!existing) {
          const caseRef = `DUP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          const newCase = await prisma.duplicateCase.create({
            data: {
              caseReference: caseRef,
              studentIdA: student.id,
              studentIdB: cand.id,
              matchType: 'FUZZY_IDENTITY',
              confidenceScore: parseFloat(similarity.toFixed(2)),
              matchingFieldsJson: JSON.stringify(['dateOfBirth', 'gender', 'name_similarity']),
              status: 'OPEN',
              evidenceNotes: `Fuzzy Identity Match (${(similarity * 100).toFixed(0)}% confidence): '${fullNameA}' vs '${fullNameB}' with matching Date of Birth (${student.dateOfBirth}) and Gender (${student.gender}). Potential dual identity.`
            }
          });
          caseIds.push(newCase.id);
        }
      }
    }

    return caseIds;
  }
}
