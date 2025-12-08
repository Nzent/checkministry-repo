CREATE TABLE "OrderProductMap" (
	"id" serial NOT NULL,
	"orderId" integer,
	"productId" integer,
	CONSTRAINT "OrderProductMap_orderId_productId_pk" PRIMARY KEY("orderId","productId")
);
--> statement-breakpoint
CREATE TABLE "ORDERS" (
	"Id" serial PRIMARY KEY NOT NULL,
	"orderDescription" varchar(100) NOT NULL,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "PRODUCTS" (
	"Id" integer PRIMARY KEY NOT NULL,
	"productName" varchar(100) NOT NULL,
	"productDescription" text
);
--> statement-breakpoint
ALTER TABLE "OrderProductMap" ADD CONSTRAINT "OrderProductMap_orderId_ORDERS_Id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."ORDERS"("Id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "OrderProductMap" ADD CONSTRAINT "OrderProductMap_productId_PRODUCTS_Id_fk" FOREIGN KEY ("productId") REFERENCES "public"."PRODUCTS"("Id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "orderIdIndex" ON "OrderProductMap" USING btree ("orderId");