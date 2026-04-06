import { prisma } from '../../shared/prisma';
import { ICallWaiterRepository } from '../../contracts/call-waiter';
import { CallWaiterEventMapper } from '../../contracts/call-waiter';
import { CallWaiterEvent, CallWaiterStatus } from '../../domain/call-waiter-event';

export class PrismaCallWaiterRepository implements ICallWaiterRepository {
  async findById(organizationId: string, id: string): Promise<CallWaiterEvent | null> {
    const record = await prisma.callWaiterEvent.findFirst({
      where: { id, organization_id: organizationId },
    });

    if (!record) return null;

    return CallWaiterEventMapper.toDomain(record);
  }

  async findAllByOrg(organizationId: string, filters?: { status?: CallWaiterStatus }): Promise<CallWaiterEvent[]> {
    const where: Record<string, unknown> = { organization_id: organizationId };

    if (filters?.status) {
      where.status = filters.status;
    }

    const records = await prisma.callWaiterEvent.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    return records.map(CallWaiterEventMapper.toDomain);
  }

  async create(organizationId: string, event: CallWaiterEvent): Promise<CallWaiterEvent> {
    const data = CallWaiterEventMapper.toPrisma(event);

    const record = await prisma.callWaiterEvent.create({ data });

    return CallWaiterEventMapper.toDomain(record);
  }

  async resolve(organizationId: string, id: string, resolvedAt: number): Promise<CallWaiterEvent> {
    const record = await prisma.callWaiterEvent.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolved_at: BigInt(resolvedAt),
      },
    });

    return CallWaiterEventMapper.toDomain(record);
  }
}
