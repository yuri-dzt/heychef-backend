import { prisma } from '../../shared/prisma';
import { NotFoundError, ValidationError } from '../../shared/errors';

interface GetPublicMenuInput {
  tableToken: string;
}

interface MenuAddonItem {
  id: string;
  name: string;
  priceCents: number;
}

interface MenuAddonGroup {
  id: string;
  name: string;
  minSelect: number;
  maxSelect: number;
  items: MenuAddonItem[];
}

interface MenuProduct {
  id: string;
  name: string;
  description?: string;
  priceCents: number;
  imageUrl?: string;
  ingredients?: string[];
  addonGroups: MenuAddonGroup[];
}

interface MenuCategory {
  id: string;
  name: string;
  orderIndex: number;
  products: MenuProduct[];
}

interface GetPublicMenuOutput {
  table: {
    id: string;
    name: string;
  };
  categories: MenuCategory[];
}

export class GetPublicMenuUseCase {
  async execute(input: GetPublicMenuInput): Promise<GetPublicMenuOutput> {
    const table = await prisma.table.findFirst({
      where: { qr_code_token: input.tableToken },
    });

    if (!table) {
      throw new NotFoundError('Table');
    }

    if (!table.active) {
      throw new ValidationError('Table is not active');
    }

    const categories = await prisma.category.findMany({
      where: {
        organization_id: table.organization_id,
        active: true,
      },
      orderBy: { order_index: 'asc' },
      include: {
        products: {
          where: { active: true },
          include: {
            addon_groups: {
              include: {
                items: true,
              },
            },
          },
        },
      },
    });

    return {
      table: {
        id: table.id,
        name: table.name,
      },
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        orderIndex: cat.order_index,
        products: cat.products.map((prod) => ({
          id: prod.id,
          name: prod.name,
          description: prod.description ?? undefined,
          priceCents: prod.price_cents,
          imageUrl: prod.image_url ?? undefined,
          ingredients: prod.ingredients ? JSON.parse(prod.ingredients as string) : undefined,
          addonGroups: prod.addon_groups.map((group) => ({
            id: group.id,
            name: group.name,
            minSelect: group.min_select,
            maxSelect: group.max_select,
            items: group.items.map((item) => ({
              id: item.id,
              name: item.name,
              priceCents: item.price_cents,
            })),
          })),
        })),
      })),
    };
  }
}
