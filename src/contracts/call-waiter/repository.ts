import { CallWaiterEvent, CallWaiterStatus } from "../../domain/call-waiter-event";

export interface ICallWaiterRepository {
  findById(organizationId: string, id: string): Promise<CallWaiterEvent | null>;
  findAllByOrg(organizationId: string, filters?: { status?: CallWaiterStatus }): Promise<CallWaiterEvent[]>;
  create(organizationId: string, event: CallWaiterEvent): Promise<CallWaiterEvent>;
  resolve(organizationId: string, id: string, resolvedAt: number): Promise<CallWaiterEvent>;
}
