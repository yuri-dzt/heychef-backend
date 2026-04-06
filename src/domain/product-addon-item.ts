export interface ProductAddonItemProps {
  id: string;
  organizationId: string;
  addonGroupId: string;
  name: string;
  priceCents: number;
  createdAt: number;
  updatedAt?: number;
}

export class ProductAddonItem {
  readonly id: string;
  readonly organizationId: string;
  readonly addonGroupId: string;
  readonly name: string;
  readonly priceCents: number;
  readonly createdAt: number;
  readonly updatedAt?: number;

  constructor(props: ProductAddonItemProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.addonGroupId = props.addonGroupId;
    this.name = props.name;
    this.priceCents = props.priceCents;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
