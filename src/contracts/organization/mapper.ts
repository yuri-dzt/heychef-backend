import { Organization } from "../../domain/organization";
import { OrganizationDTO } from "./dto";

export class OrganizationMapper {
  static toDomain(prisma: {
    id: string;
    name: string;
    plan_expires_at: bigint;
    created_at: bigint;
    updated_at: bigint | null;
    plan_id?: string | null;
    plan?: { name: string } | null;
  }): Organization {
    return new Organization({
      id: prisma.id,
      name: prisma.name,
      planExpiresAt: Number(prisma.plan_expires_at),
      createdAt: Number(prisma.created_at),
      updatedAt: prisma.updated_at !== null ? Number(prisma.updated_at) : undefined,
      planId: prisma.plan_id ?? null,
      planName: prisma.plan?.name ?? null,
    });
  }

  static toDTO(domain: Organization): OrganizationDTO {
    return {
      id: domain.id,
      name: domain.name,
      planExpiresAt: domain.planExpiresAt,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      planId: domain.planId,
      planName: domain.planName,
    };
  }

  static toPrisma(domain: Organization): {
    id: string;
    name: string;
    plan_expires_at: bigint;
    created_at: bigint;
    updated_at: bigint | null;
  } {
    return {
      id: domain.id,
      name: domain.name,
      plan_expires_at: BigInt(domain.planExpiresAt),
      created_at: BigInt(domain.createdAt),
      updated_at: domain.updatedAt !== undefined ? BigInt(domain.updatedAt) : null,
    };
  }
}
