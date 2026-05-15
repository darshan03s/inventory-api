CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplierId" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"sku" text NOT NULL,
	"price" integer NOT NULL,
	"stockQuantity" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_supplierId_users_id_fk" FOREIGN KEY ("supplierId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "products_sku_index" ON "products" USING btree ("sku");--> statement-breakpoint
CREATE INDEX "products_supplier_id_index" ON "products" USING btree ("supplierId");