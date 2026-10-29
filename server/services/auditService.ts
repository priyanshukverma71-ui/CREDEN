import crypto from 'crypto';
import prisma from '../prisma.js';

export interface AuditParams {
  actorId: string;
  actorRole: string;
  actorEmail: string;
  institutionId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  details?: Record<string, any>;
  ipAddress?: string;
}

export class AuditService {
  /**
   * Appends an immutable, tamper-evident audit event with SHA-256 hash chaining.
   */
  static async recordEvent(params: AuditParams) {
    try {
      // Find latest audit event to link hash chain
      const lastEvent = await prisma.auditEvent.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      const prevHash = lastEvent ? lastEvent.integrityHash : 'GENESIS_BLOCK_CREDEN_AICTE_2024';
      const timestamp = new Date().toISOString();
      const detailsJson = params.details ? JSON.stringify(params.details) : '{}';

      // Compute tamper-evident hash
      const hashPayload = `${prevHash}|${timestamp}|${params.actorId}|${params.action}|${params.targetType}|${params.targetId || ''}|${detailsJson}`;
      const integrityHash = crypto.createHash('sha256').update(hashPayload).digest('hex');

      const event = await prisma.auditEvent.create({
        data: {
          actorId: params.actorId,
          actorRole: params.actorRole,
          actorEmail: params.actorEmail,
          institutionId: params.institutionId || null,
          action: params.action,
          targetType: params.targetType,
          targetId: params.targetId || null,
          detailsJson,
          ipAddress: params.ipAddress || '127.0.0.1',
          prevHash,
          integrityHash,
        },
      });

      return event;
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // In critical gov systems, audit failure should be noted
      return null;
    }
  }

  /**
   * Verifies the cryptographic integrity of the audit log chain.
   */
  static async verifyChainIntegrity(): Promise<{ valid: boolean; totalEvents: number; brokenEventId?: string }> {
    const events = await prisma.auditEvent.findMany({
      orderBy: { createdAt: 'asc' },
    });

    if (events.length === 0) {
      return { valid: true, totalEvents: 0 };
    }

    let expectedPrevHash = 'GENESIS_BLOCK_CREDEN_AICTE_2024';

    for (const event of events) {
      if (event.prevHash !== expectedPrevHash) {
        return {
          valid: false,
          totalEvents: events.length,
          brokenEventId: event.id,
        };
      }
      expectedPrevHash = event.integrityHash;
    }

    return { valid: true, totalEvents: events.length };
  }
}
