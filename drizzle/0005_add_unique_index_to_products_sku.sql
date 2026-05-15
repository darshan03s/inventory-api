DROP INDEX "products_sku_index";--> statement-breakpoint
CREATE UNIQUE INDEX "products_sku_index" ON "products" USING btree ("sku");