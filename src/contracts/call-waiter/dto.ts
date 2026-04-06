import { CallWaiterStatus } from "../../domain/call-waiter-event";

export interface CallWaiterEventDTO {
  id: string;
  organizationId: string;
  tableId: string;
  status: CallWaiterStatus;
  createdAt: number;
  resolvedAt?: number;
}
