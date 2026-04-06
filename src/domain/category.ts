export interface CategoryProps {
  id: string;
  organizationId: string;
  name: string;
  orderIndex: number;
  active: boolean;
  createdAt: number;
  updatedAt?: number;
}

export class Category {
  readonly id: string;
  readonly organizationId: string;
  readonly name: string;
  readonly orderIndex: number;
  readonly active: boolean;
  readonly createdAt: number;
  readonly updatedAt?: number;

  constructor(props: CategoryProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.name = props.name;
    this.orderIndex = props.orderIndex;
    this.active = props.active;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
