import { ICallWaiterRepository } from '../../contracts/call-waiter';
import { CallWaiterEventMapper } from '../../contracts/call-waiter';
import { CallWaiterEventDTO } from '../../contracts/call-waiter/dto';
import { CallWaiterStatus } from '../../domain/call-waiter-event';
import { NotFoundError, ValidationError } from '../../shared/errors';
import { orderEvents } from '../../infra/events/order-events';

interface ResolveCallInput {
  organizationId: string;
  callId: string;
}

export class ResolveCallUseCase {
  constructor(private callWaiterRepository: ICallWaiterRepository) {}

  async execute(input: ResolveCallInput): Promise<CallWaiterEventDTO> {
    const event = await this.callWaiterRepository.findById(input.organizationId, input.callId);

    if (!event) {
      throw new NotFoundError('Call waiter event');
    }

    if (event.status === CallWaiterStatus.RESOLVED) {
      throw new ValidationError('Call is already resolved');
    }

    const now = Date.now();
    const resolved = await this.callWaiterRepository.resolve(input.organizationId, input.callId, now);
    const dto = CallWaiterEventMapper.toDTO(resolved);

    orderEvents.emitCallWaiterResolved(input.organizationId, dto);

    return dto;
  }
}
