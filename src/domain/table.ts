export interface TableEntityProps {
  id: string;
  organizationId: string;
  name: string;
  qrCodeToken: string;
  active: boolean;
  createdAt: number;
  updatedAt?: number;
}

export class TableEntity {
  readonly id: string;
  readonly organizationId: string;
  readonly name: string;
  readonly qrCodeToken: string;
  readonly active: boolean;
  readonly createdAt: number;
  readonly updatedAt?: number;

  constructor(props: TableEntityProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.name = props.name;
    this.qrCodeToken = props.qrCodeToken;
    this.active = props.active;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
