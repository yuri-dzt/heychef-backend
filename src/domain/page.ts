export interface PageEntityProps {
  id: string;
  organizationId: string;
  name: string;
  createdAt: number;
}

export class PageEntity {
  readonly id: string;
  readonly organizationId: string;
  readonly name: string;
  readonly createdAt: number;

  constructor(props: PageEntityProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.name = props.name;
    this.createdAt = props.createdAt;
  }
}
