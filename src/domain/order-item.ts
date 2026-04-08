export interface OrderItemProps {
  id: string;
  organizationId: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPriceCents: number;
  totalPriceCents: number;
  notes?: string;
  createdAt: number;
}

export class OrderItem {
  readonly id: string;
  readonly organizationId: string;
  readonly orderId: string;
  readonly productId: string;
  readonly quantity: number;
  readonly unitPriceCents: number;
  readonly totalPriceCents: number;
  readonly notes?: string;
  readonly createdAt: number;

  constructor(props: OrderItemProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.orderId = props.orderId;
    this.productId = props.productId;
    this.quantity = props.quantity;
    this.unitPriceCents = props.unitPriceCents;
    this.totalPriceCents = props.totalPriceCents;
    this.notes = props.notes;
    this.createdAt = props.createdAt;
  }
}
