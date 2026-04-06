import { PageEntity } from "../../domain/page";
import { PageDTO } from "./dto";

export class PageMapper {
  static toDomain(prisma: {
    id: string;
    organization_id: string;
    name: string;
    created_at: bigint;
  }): PageEntity {
    return new PageEntity({
      id: prisma.id,
      organizationId: prisma.organization_id,
      name: prisma.name,
      createdAt: Number(prisma.created_at),
    });
  }

  static toDTO(domain: PageEntity): PageDTO {
    return {
      id: domain.id,
      organizationId: domain.organizationId,
      name: domain.name,
      createdAt: domain.createdAt,
    };
  }

  static toPrisma(domain: PageEntity): {
    id: string;
    organization_id: string;
    name: string;
    created_at: bigint;
  } {
    return {
      id: domain.id,
      organization_id: domain.organizationId,
      name: domain.name,
      created_at: BigInt(domain.createdAt),
    };
  }
}
