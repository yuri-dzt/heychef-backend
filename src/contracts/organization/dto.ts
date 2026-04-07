export interface OrganizationDTO {
  id: string;
  name: string;
  planExpiresAt: number;
  createdAt: number;
  updatedAt?: number;
  planId?: string | null;
  planName?: string | null;
}
