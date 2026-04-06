export enum CallWaiterStatus {
  OPEN = "OPEN",
  RESOLVED = "RESOLVED",
}

export interface CallWaiterEventProps {
  id: string;
  organizationId: string;
  tableId: string;
  status: CallWaiterStatus;
  createdAt: number;
  resolvedAt?: number;
}

export class CallWaiterEvent {
  readonly id: string;
  readonly organizationId: string;
  readonly tableId: string;
  readonly status: CallWaiterStatus;
  readonly createdAt: number;
  readonly resolvedAt?: number;

  constructor(props: CallWaiterEventProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.tableId = props.tableId;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.resolvedAt = props.resolvedAt;
  }
}
