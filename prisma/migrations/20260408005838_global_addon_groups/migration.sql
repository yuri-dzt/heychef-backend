-- AlterTable
ALTER TABLE "product_addon_groups" ALTER COLUMN "product_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "product_addon_group_links" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "addon_group_id" TEXT NOT NULL,
    "created_at" BIGINT NOT NULL,

    CONSTRAINT "product_addon_group_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_addon_group_links_organization_id_idx" ON "product_addon_group_links"("organization_id");

-- CreateIndex
CREATE INDEX "product_addon_group_links_product_id_idx" ON "product_addon_group_links"("product_id");

-- CreateIndex
CREATE INDEX "product_addon_group_links_addon_group_id_idx" ON "product_addon_group_links"("addon_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_addon_group_links_product_id_addon_group_id_key" ON "product_addon_group_links"("product_id", "addon_group_id");

-- AddForeignKey
ALTER TABLE "product_addon_group_links" ADD CONSTRAINT "product_addon_group_links_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_addon_group_links" ADD CONSTRAINT "product_addon_group_links_addon_group_id_fkey" FOREIGN KEY ("addon_group_id") REFERENCES "product_addon_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
