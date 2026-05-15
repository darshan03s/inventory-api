DROP INDEX "products_sku_index";--> statement-breakpoint
CREATE UNIQUE INDEX "products_supplier_sku_index" ON "products" USING btree ("supplierId","sku");