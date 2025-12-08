import { relations } from 'drizzle-orm';
import { orders } from './orders.schema';
import { products } from './products.schema';
import { orderProductMap } from './orderProductsMap.schema';

// relations
export const ordersRelations = relations(orders, ({ many }) => ({
  orderProducts: many(orderProductMap),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderProducts: many(orderProductMap),
}));

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
