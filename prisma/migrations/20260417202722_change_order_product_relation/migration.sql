-- DropForeignKey
ALTER TABLE "order_products" DROP CONSTRAINT "order_products_item_id_fkey";

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
