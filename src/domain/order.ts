export enum OrderStatus {
  RECEIVED = "RECEIVED",
  PREPARING = "PREPARING",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELED = "CANCELED",
}

export interface OrderProps {
  id: string;
  organizationId: string;
  tableId: string;
  status: OrderStatus;
  customerName?: string;
  notes?: string;
  totalCents: number;
  cancelReason?: string;
  createdAt: number;
  updatedAt?: number;
}

export class Order {
  readonly id: string;
  readonly organizationId: string;
  readonly tableId: string;
  readonly status: OrderStatus;
  readonly customerName?: string;
  readonly notes?: string;
  readonly totalCents: number;
  readonly cancelReason?: string;
  readonly createdAt: number;
  readonly updatedAt?: number;

  constructor(props: OrderProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.tableId = props.tableId;
    this.status = props.status;
    this.customerName = props.customerName;
    this.notes = props.notes;
    this.totalCents = props.totalCents;
    this.cancelReason = props.cancelReason;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
