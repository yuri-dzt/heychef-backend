export interface OrderItemAddonProps {
  id: string;
  organizationId: string;
  orderItemId: string;
  addonItemId: string;
  priceCents: number;
  createdAt: number;
}

export class OrderItemAddon {
  readonly id: string;
  readonly organizationId: string;
  readonly orderItemId: string;
  readonly addonItemId: string;
  readonly priceCents: number;
  readonly createdAt: number;

  constructor(props: OrderItemAddonProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.orderItemId = props.orderItemId;
    this.addonItemId = props.addonItemId;
    this.priceCents = props.priceCents;
    this.createdAt = props.createdAt;
  }
}
