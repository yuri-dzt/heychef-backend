import { ProductAddonGroup } from "../../domain/product-addon-group";
import { ProductAddonGroupDTO } from "./dto";

export class ProductAddonGroupMapper {
  static toDomain(prisma: {
    id: string;
    organization_id: string;
    product_id: string;
    name: string;
    min_select: number;
    max_select: number;
    created_at: bigint;
    updated_at: bigint | null;
  }): ProductAddonGroup {
    return new ProductAddonGroup({
      id: prisma.id,
      organizationId: prisma.organization_id,
      productId: prisma.product_id,
      name: prisma.name,
      minSelect: prisma.min_select,
      maxSelect: prisma.max_select,
      createdAt: Number(prisma.created_at),
      updatedAt: prisma.updated_at !== null ? Number(prisma.updated_at) : undefined,
    });
  }

  static toDTO(domain: ProductAddonGroup): ProductAddonGroupDTO {
    return {
      id: domain.id,
      organizationId: domain.organizationId,
      productId: domain.productId,
      name: domain.name,
      minSelect: domain.minSelect,
      maxSelect: domain.maxSelect,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  static toPrisma(domain: ProductAddonGroup): {
    id: string;
    organization_id: string;
    product_id: string;
    name: string;
    min_select: number;
    max_select: number;
    created_at: bigint;
    updated_at: bigint | null;
  } {
    return {
      id: domain.id,
      organization_id: domain.organizationId,
      product_id: domain.productId,
      name: domain.name,
      min_select: domain.minSelect,
      max_select: domain.maxSelect,
      created_at: BigInt(domain.createdAt),
      updated_at: domain.updatedAt !== undefined ? BigInt(domain.updatedAt) : null,
    };
  }
}
