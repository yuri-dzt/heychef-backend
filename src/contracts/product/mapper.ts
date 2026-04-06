import { Product } from "../../domain/product";
import { ProductDTO } from "./dto";

export class ProductMapper {
  static toDomain(prisma: {
    id: string;
    organization_id: string;
    category_id: string;
    name: string;
    description: string | null;
    price_cents: number;
    image_url: string | null;
    active: boolean;
    created_at: bigint;
    updated_at: bigint | null;
  }): Product {
    return new Product({
      id: prisma.id,
      organizationId: prisma.organization_id,
      categoryId: prisma.category_id,
      name: prisma.name,
      description: prisma.description ?? undefined,
      priceCents: prisma.price_cents,
      imageUrl: prisma.image_url ?? undefined,
      active: prisma.active,
      createdAt: Number(prisma.created_at),
      updatedAt: prisma.updated_at !== null ? Number(prisma.updated_at) : undefined,
    });
  }

  static toDTO(domain: Product): ProductDTO {
    return {
      id: domain.id,
      organizationId: domain.organizationId,
      categoryId: domain.categoryId,
      name: domain.name,
      description: domain.description,
      priceCents: domain.priceCents,
      imageUrl: domain.imageUrl,
      active: domain.active,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  static toPrisma(domain: Product): {
    id: string;
    organization_id: string;
    category_id: string;
    name: string;
    description: string | null;
    price_cents: number;
    image_url: string | null;
    active: boolean;
    created_at: bigint;
    updated_at: bigint | null;
  } {
    return {
      id: domain.id,
      organization_id: domain.organizationId,
      category_id: domain.categoryId,
      name: domain.name,
      description: domain.description ?? null,
      price_cents: domain.priceCents,
      image_url: domain.imageUrl ?? null,
      active: domain.active,
      created_at: BigInt(domain.createdAt),
      updated_at: domain.updatedAt !== undefined ? BigInt(domain.updatedAt) : null,
    };
  }
}
