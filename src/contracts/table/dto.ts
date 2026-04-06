export interface TableDTO {
  id: string;
  organizationId: string;
  name: string;
  qrCodeToken: string;
  active: boolean;
  createdAt: number;
  updatedAt?: number;
}
