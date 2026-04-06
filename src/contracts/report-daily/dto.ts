export interface ReportDailyDTO {
  id: string;
  organizationId: string;
  date: string;
  totalOrders: number;
  totalRevenueCents: number;
  createdAt: number;
}
