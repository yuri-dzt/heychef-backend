export interface OrganizationProps {
  id: string;
  name: string;
  planExpiresAt: number;
  createdAt: number;
  updatedAt?: number;
}

export class Organization {
  readonly id: string;
  readonly name: string;
  readonly planExpiresAt: number;
  readonly createdAt: number;
  readonly updatedAt?: number;

  constructor(props: OrganizationProps) {
    this.id = props.id;
    this.name = props.name;
    this.planExpiresAt = props.planExpiresAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
