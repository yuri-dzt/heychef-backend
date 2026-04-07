export interface OrganizationProps {
  id: string;
  name: string;
  planExpiresAt: number;
  createdAt: number;
  updatedAt?: number;
  planId?: string | null;
  planName?: string | null;
}

export class Organization {
  readonly id: string;
  readonly name: string;
  readonly planExpiresAt: number;
  readonly createdAt: number;
  readonly updatedAt?: number;
  readonly planId?: string | null;
  readonly planName?: string | null;

  constructor(props: OrganizationProps) {
    this.id = props.id;
    this.name = props.name;
    this.planExpiresAt = props.planExpiresAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.planId = props.planId;
    this.planName = props.planName;
  }
}
