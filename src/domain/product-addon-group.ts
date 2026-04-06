export interface ProductAddonGroupProps {
  id: string;
  organizationId: string;
  productId: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  createdAt: number;
  updatedAt?: number;
}

export class ProductAddonGroup {
  readonly id: string;
  readonly organizationId: string;
  readonly productId: string;
  readonly name: string;
  readonly minSelect: number;
  readonly maxSelect: number;
  readonly createdAt: number;
  readonly updatedAt?: number;

  constructor(props: ProductAddonGroupProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.productId = props.productId;
    this.name = props.name;
    this.minSelect = props.minSelect;
    this.maxSelect = props.maxSelect;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
