import { relations } from 'drizzle-orm';
import { pgTable, serial, integer } from 'drizzle-orm/pg-core';
import { orders } from './orders.schema';
import { products } from './products.schema';

export const orderProductMap = pgTable('OrderProductMap', {
  Id: serial('Id').primaryKey(),
  orderId: integer('orderId')
    .notNull()
    .references(() => orders.Id, { onDelete: 'cascade' }),
  productId: integer('productId')
    .notNull()
    .references(() => products.Id),
});

export const orderProductMapRelations = relations(
  orderProductMap,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderProductMap.orderId],
      references: [orders.Id],
    }),
    product: one(products, {
      fields: [orderProductMap.productId],
      references: [products.Id],
    }),
  }),
);
