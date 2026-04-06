import { ICallWaiterRepository } from '../../contracts/call-waiter';
import { CallWaiterEventMapper } from '../../contracts/call-waiter';
import { CallWaiterEventDTO } from '../../contracts/call-waiter/dto';
import { CallWaiterStatus } from '../../domain/call-waiter-event';

interface ListCallsInput {
  organizationId: string;
  status?: CallWaiterStatus;
}

export class ListCallsUseCase {
  constructor(private callWaiterRepository: ICallWaiterRepository) {}

  async execute(input: ListCallsInput): Promise<CallWaiterEventDTO[]> {
    const filters = input.status ? { status: input.status } : undefined;
    const events = await this.callWaiterRepository.findAllByOrg(input.organizationId, filters);
    return events.map(CallWaiterEventMapper.toDTO);
  }
}
