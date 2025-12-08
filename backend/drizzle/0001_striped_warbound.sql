ALTER TABLE "OrderProductMap" RENAME COLUMN "id" TO "Id";--> statement-breakpoint
ALTER TABLE "OrderProductMap" DROP CONSTRAINT "OrderProductMap_orderId_ORDERS_Id_fk";
--> statement-breakpoint
ALTER TABLE "OrderProductMap" DROP CONSTRAINT "OrderProductMap_productId_PRODUCTS_Id_fk";
--> statement-breakpoint
DROP INDEX "orderIdIndex";--> statement-breakpoint
ALTER TABLE "OrderProductMap" DROP CONSTRAINT "OrderProductMap_orderId_productId_pk";--> statement-breakpoint
ALTER TABLE "OrderProductMap" ALTER COLUMN "orderId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "OrderProductMap" ALTER COLUMN "productId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "OrderProductMap" ADD CONSTRAINT "OrderProductMap_orderId_ORDERS_Id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."ORDERS"("Id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "OrderProductMap" ADD CONSTRAINT "OrderProductMap_productId_PRODUCTS_Id_fk" FOREIGN KEY ("productId") REFERENCES "public"."PRODUCTS"("Id") ON DELETE no action ON UPDATE no action;