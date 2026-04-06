import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../shared/prisma';
import { ICallWaiterRepository } from '../../contracts/call-waiter';
import { CallWaiterEventMapper } from '../../contracts/call-waiter';
import { CallWaiterEventDTO } from '../../contracts/call-waiter/dto';
import { CallWaiterEvent, CallWaiterStatus } from '../../domain/call-waiter-event';
import { NotFoundError, ValidationError } from '../../shared/errors';
import { orderEvents } from '../../infra/events/order-events';

interface CreateCallInput {
  tableToken: string;
}

export class CreateCallUseCase {
  constructor(private callWaiterRepository: ICallWaiterRepository) {}

  async execute(input: CreateCallInput): Promise<CallWaiterEventDTO> {
    const table = await prisma.table.findFirst({
      where: { qr_code_token: input.tableToken },
    });

    if (!table) {
      throw new NotFoundError('Table');
    }

    if (!table.active) {
      throw new ValidationError('Table is not active');
    }

    const now = Date.now();

    const event = new CallWaiterEvent({
      id: uuidv4(),
      organizationId: table.organization_id,
      tableId: table.id,
      status: CallWaiterStatus.OPEN,
      createdAt: now,
    });

    const created = await this.callWaiterRepository.create(table.organization_id, event);
    const dto = CallWaiterEventMapper.toDTO(created);

    orderEvents.emitCallWaiter(table.organization_id, { ...dto, tableName: table.name });

    return dto;
  }
}
