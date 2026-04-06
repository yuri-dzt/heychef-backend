-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'SUPPORT', 'ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('RECEIVED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELED');

-- CreateEnum
CREATE TYPE "CallWaiterStatus" AS ENUM ('OPEN', 'RESOLVED');

-- CreateEnum
CREATE TYPE "Action" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "plan_expires_at" BIGINT NOT NULL,
    "created_at" BIGINT NOT NULL,
    "updated_at" BIGINT,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "created_at" BIGINT NOT NULL,
    "updated_at" BIGINT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tables" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "qr_code_token" VARCHAR(255) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" BIGINT NOT NULL,
    "updated_at" BIGINT,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "order_index" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" BIGINT NOT NULL,
    "updated_at" BIGINT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(1000),
    "price_cents" INTEGER NOT NULL,
    "image_url" VARCHAR(500),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" BIGINT NOT NULL,
    "updated_at" BIGINT,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_addon_groups" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "min_select" INTEGER NOT NULL DEFAULT 0,
    "max_select" INTEGER NOT NULL DEFAULT 1,
    "created_at" BIGINT NOT NULL,
    "updated_at" BIGINT,

    CONSTRAINT "product_addon_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_addon_items" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "addon_group_id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "created_at" BIGINT NOT NULL,
    "updated_at" BIGINT,

    CONSTRAINT "product_addon_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'RECEIVED',
    "customer_name" VARCHAR(255),
    "notes" VARCHAR(1000),
    "total_cents" INTEGER NOT NULL,
    "cancel_reason" VARCHAR(500),
    "created_at" BIGINT NOT NULL,
    "updated_at" BIGINT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price_cents" INTEGER NOT NULL,
    "total_price_cents" INTEGER NOT NULL,
    "created_at" BIGINT NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item_addons" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "order_item_id" TEXT NOT NULL,
    "addon_item_id" TEXT NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "created_at" BIGINT NOT NULL,

    CONSTRAINT "order_item_addons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "call_waiter_events" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,
    "status" "CallWaiterStatus" NOT NULL DEFAULT 'OPEN',
    "created_at" BIGINT NOT NULL,
    "resolved_at" BIGINT,

    CONSTRAINT "call_waiter_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_dailies" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "date" VARCHAR(10) NOT NULL,
    "total_orders" INTEGER NOT NULL,
    "total_revenue_cents" INTEGER NOT NULL,
    "created_at" BIGINT NOT NULL,

    CONSTRAINT "report_dailies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" BIGINT NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "page_id" TEXT NOT NULL,
    "action" "Action" NOT NULL,
    "created_at" BIGINT NOT NULL,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_organization_id_idx" ON "users"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_organization_id_email_key" ON "users"("organization_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "tables_qr_code_token_key" ON "tables"("qr_code_token");

-- CreateIndex
CREATE INDEX "tables_organization_id_idx" ON "tables"("organization_id");

-- CreateIndex
CREATE INDEX "categories_organization_id_idx" ON "categories"("organization_id");

-- CreateIndex
CREATE INDEX "products_organization_id_idx" ON "products"("organization_id");

-- CreateIndex
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- CreateIndex
CREATE INDEX "product_addon_groups_organization_id_idx" ON "product_addon_groups"("organization_id");

-- CreateIndex
CREATE INDEX "product_addon_groups_product_id_idx" ON "product_addon_groups"("product_id");

-- CreateIndex
CREATE INDEX "product_addon_items_organization_id_idx" ON "product_addon_items"("organization_id");

-- CreateIndex
CREATE INDEX "product_addon_items_addon_group_id_idx" ON "product_addon_items"("addon_group_id");

-- CreateIndex
CREATE INDEX "orders_organization_id_idx" ON "orders"("organization_id");

-- CreateIndex
CREATE INDEX "orders_table_id_idx" ON "orders"("table_id");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "order_items_organization_id_idx" ON "order_items"("organization_id");

-- CreateIndex
CREATE INDEX "order_items_order_id_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "order_item_addons_organization_id_idx" ON "order_item_addons"("organization_id");

-- CreateIndex
CREATE INDEX "order_item_addons_order_item_id_idx" ON "order_item_addons"("order_item_id");

-- CreateIndex
CREATE INDEX "call_waiter_events_organization_id_idx" ON "call_waiter_events"("organization_id");

-- CreateIndex
CREATE INDEX "call_waiter_events_table_id_idx" ON "call_waiter_events"("table_id");

-- CreateIndex
CREATE INDEX "report_dailies_organization_id_idx" ON "report_dailies"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_dailies_organization_id_date_key" ON "report_dailies"("organization_id", "date");

-- CreateIndex
CREATE INDEX "pages_organization_id_idx" ON "pages"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "pages_organization_id_name_key" ON "pages"("organization_id", "name");

-- CreateIndex
CREATE INDEX "user_permissions_organization_id_idx" ON "user_permissions"("organization_id");

-- CreateIndex
CREATE INDEX "user_permissions_user_id_idx" ON "user_permissions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_user_id_page_id_action_key" ON "user_permissions"("user_id", "page_id", "action");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_addon_groups" ADD CONSTRAINT "product_addon_groups_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_addon_groups" ADD CONSTRAINT "product_addon_groups_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_addon_items" ADD CONSTRAINT "product_addon_items_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_addon_items" ADD CONSTRAINT "product_addon_items_addon_group_id_fkey" FOREIGN KEY ("addon_group_id") REFERENCES "product_addon_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_addons" ADD CONSTRAINT "order_item_addons_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_addons" ADD CONSTRAINT "order_item_addons_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item_addons" ADD CONSTRAINT "order_item_addons_addon_item_id_fkey" FOREIGN KEY ("addon_item_id") REFERENCES "product_addon_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_waiter_events" ADD CONSTRAINT "call_waiter_events_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_waiter_events" ADD CONSTRAINT "call_waiter_events_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "tables"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_dailies" ADD CONSTRAINT "report_dailies_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_page_id_fkey" FOREIGN KEY ("page_id") REFERENCES "pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
