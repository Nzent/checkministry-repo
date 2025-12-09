ALTER TABLE "OrderProductMap" DROP CONSTRAINT "OrderProductMap_orderId_ORDERS_Id_fk";
--> statement-breakpoint
ALTER TABLE "OrderProductMap" ADD CONSTRAINT "OrderProductMap_orderId_ORDERS_Id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."ORDERS"("Id") ON DELETE cascade ON UPDATE no action;