-- CreateTable
CREATE TABLE "ORDERS" (
    "id" SERIAL NOT NULL,
    "order_desctription" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ORDERS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PRODUCTS" (
    "id" SERIAL NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PRODUCTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderProductMap" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "OrderProductMap_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderProductMap" ADD CONSTRAINT "OrderProductMap_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ORDERS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderProductMap" ADD CONSTRAINT "OrderProductMap_productId_fkey" FOREIGN KEY ("productId") REFERENCES "PRODUCTS"("id") ON DELETE CASCADE ON UPDATE CASCADE;
