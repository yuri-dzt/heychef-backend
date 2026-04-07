import { prisma } from './prisma';
import { v4 as uuidv4 } from 'uuid';

interface AuditParams {
  organizationId: string;
  userId: string;
  userName: string;
  action: string; // 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'STATUS_CHANGE'
  entity: string; // 'order' | 'product' | 'category' | 'table' | 'user' | 'waiter_call'
  entityId?: string;
  details?: string;
  ipAddress?: string;
}

export async function logAudit(params: AuditParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        id: uuidv4(),
        organization_id: params.organizationId,
        user_id: params.userId,
        user_name: params.userName,
        action: params.action,
        entity: params.entity,
        entity_id: params.entityId || null,
        details: params.details || null,
        ip_address: params.ipAddress || null,
        created_at: BigInt(Date.now()),
      },
    });
  } catch {
    // Audit logging should never break the main flow
  }
}
