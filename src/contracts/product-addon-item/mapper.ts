import { ProductAddonItem } from "../../domain/product-addon-item";
import { ProductAddonItemDTO } from "./dto";

export class ProductAddonItemMapper {
  static toDomain(prisma: {
    id: string;
    organization_id: string;
    addon_group_id: string;
    name: string;
    price_cents: number;
    created_at: bigint;
    updated_at: bigint | null;
  }): ProductAddonItem {
    return new ProductAddonItem({
      id: prisma.id,
      organizationId: prisma.organization_id,
      addonGroupId: prisma.addon_group_id,
      name: prisma.name,
      priceCents: prisma.price_cents,
      createdAt: Number(prisma.created_at),
      updatedAt: prisma.updated_at !== null ? Number(prisma.updated_at) : undefined,
    });
  }

  static toDTO(domain: ProductAddonItem): ProductAddonItemDTO {
    return {
      id: domain.id,
      organizationId: domain.organizationId,
      addonGroupId: domain.addonGroupId,
      name: domain.name,
      priceCents: domain.priceCents,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  static toPrisma(domain: ProductAddonItem): {
    id: string;
    organization_id: string;
    addon_group_id: string;
    name: string;
    price_cents: number;
    created_at: bigint;
    updated_at: bigint | null;
  } {
    return {
      id: domain.id,
      organization_id: domain.organizationId,
      addon_group_id: domain.addonGroupId,
      name: domain.name,
      price_cents: domain.priceCents,
      created_at: BigInt(domain.createdAt),
      updated_at: domain.updatedAt !== undefined ? BigInt(domain.updatedAt) : null,
    };
  }
}
