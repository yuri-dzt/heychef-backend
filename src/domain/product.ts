export interface ProductProps {
  id: string;
  organizationId: string;
  categoryId: string;
  name: string;
  description?: string;
  priceCents: number;
  imageUrl?: string;
  active: boolean;
  createdAt: number;
  updatedAt?: number;
}

export class Product {
  readonly id: string;
  readonly organizationId: string;
  readonly categoryId: string;
  readonly name: string;
  readonly description?: string;
  readonly priceCents: number;
  readonly imageUrl?: string;
  readonly active: boolean;
  readonly createdAt: number;
  readonly updatedAt?: number;

  constructor(props: ProductProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.categoryId = props.categoryId;
    this.name = props.name;
    this.description = props.description;
    this.priceCents = props.priceCents;
    this.imageUrl = props.imageUrl;
    this.active = props.active;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
