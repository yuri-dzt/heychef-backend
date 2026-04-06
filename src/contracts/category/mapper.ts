import { Category } from "../../domain/category";
import { CategoryDTO } from "./dto";

export class CategoryMapper {
  static toDomain(prisma: {
    id: string;
    organization_id: string;
    name: string;
    order_index: number;
    active: boolean;
    created_at: bigint;
    updated_at: bigint | null;
  }): Category {
    return new Category({
      id: prisma.id,
      organizationId: prisma.organization_id,
      name: prisma.name,
      orderIndex: prisma.order_index,
      active: prisma.active,
      createdAt: Number(prisma.created_at),
      updatedAt: prisma.updated_at !== null ? Number(prisma.updated_at) : undefined,
    });
  }

  static toDTO(domain: Category): CategoryDTO {
    return {
      id: domain.id,
      organizationId: domain.organizationId,
      name: domain.name,
      orderIndex: domain.orderIndex,
      active: domain.active,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  static toPrisma(domain: Category): {
    id: string;
    organization_id: string;
    name: string;
    order_index: number;
    active: boolean;
    created_at: bigint;
    updated_at: bigint | null;
  } {
    return {
      id: domain.id,
      organization_id: domain.organizationId,
      name: domain.name,
      order_index: domain.orderIndex,
      active: domain.active,
      created_at: BigInt(domain.createdAt),
      updated_at: domain.updatedAt !== undefined ? BigInt(domain.updatedAt) : null,
    };
  }
}
