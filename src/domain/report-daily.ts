export interface ReportDailyProps {
  id: string;
  organizationId: string;
  date: string;
  totalOrders: number;
  totalRevenueCents: number;
  createdAt: number;
}

export class ReportDaily {
  readonly id: string;
  readonly organizationId: string;
  readonly date: string;
  readonly totalOrders: number;
  readonly totalRevenueCents: number;
  readonly createdAt: number;

  constructor(props: ReportDailyProps) {
    this.id = props.id;
    this.organizationId = props.organizationId;
    this.date = props.date;
    this.totalOrders = props.totalOrders;
    this.totalRevenueCents = props.totalRevenueCents;
    this.createdAt = props.createdAt;
  }
}
