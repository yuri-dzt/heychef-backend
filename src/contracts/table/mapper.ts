import { TableEntity } from "../../domain/table";
import { TableDTO } from "./dto";

export class TableMapper {
  static toDomain(prisma: {
    id: string;
    organization_id: string;
    name: string;
    qr_code_token: string;
    active: boolean;
    created_at: bigint;
    updated_at: bigint | null;
  }): TableEntity {
    return new TableEntity({
      id: prisma.id,
      organizationId: prisma.organization_id,
      name: prisma.name,
      qrCodeToken: prisma.qr_code_token,
      active: prisma.active,
      createdAt: Number(prisma.created_at),
      updatedAt: prisma.updated_at !== null ? Number(prisma.updated_at) : undefined,
    });
  }

  static toDTO(domain: TableEntity): TableDTO {
    return {
      id: domain.id,
      organizationId: domain.organizationId,
      name: domain.name,
      qrCodeToken: domain.qrCodeToken,
      active: domain.active,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  static toPrisma(domain: TableEntity): {
    id: string;
    organization_id: string;
    name: string;
    qr_code_token: string;
    active: boolean;
    created_at: bigint;
    updated_at: bigint | null;
  } {
    return {
      id: domain.id,
      organization_id: domain.organizationId,
      name: domain.name,
      qr_code_token: domain.qrCodeToken,
      active: domain.active,
      created_at: BigInt(domain.createdAt),
      updated_at: domain.updatedAt !== undefined ? BigInt(domain.updatedAt) : null,
    };
  }
}
