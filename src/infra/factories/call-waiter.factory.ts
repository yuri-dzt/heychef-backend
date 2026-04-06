import { PrismaCallWaiterRepository } from '../repositories/call-waiter.repository';
import { CreateCallUseCase } from '../../app/call-waiter/create-call.use-case';
import { ListCallsUseCase } from '../../app/call-waiter/list-calls.use-case';
import { ResolveCallUseCase } from '../../app/call-waiter/resolve-call.use-case';
import { CallWaiterController } from '../controllers/call-waiter.controller';

export function makeCallWaiterController(): CallWaiterController {
  const callWaiterRepository = new PrismaCallWaiterRepository();

  const createCallUseCase = new CreateCallUseCase(callWaiterRepository);
  const listCallsUseCase = new ListCallsUseCase(callWaiterRepository);
  const resolveCallUseCase = new ResolveCallUseCase(callWaiterRepository);

  return new CallWaiterController(createCallUseCase, listCallsUseCase, resolveCallUseCase);
}
