ALTER TABLE "products" DROP CONSTRAINT "products_supplierId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_supplierId_suppliers_id_fk" FOREIGN KEY ("supplierId") REFERENCES "public"."suppliers"("id") ON DELETE cascade ON UPDATE no action;