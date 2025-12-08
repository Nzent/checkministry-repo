import { serial, pgTable, integer } from 'drizzle-orm/pg-core';
import { orders } from './orders.schema';
import { products } from './products.schema';
import { primaryKey } from 'drizzle-orm/pg-core';
import { index } from 'drizzle-orm/pg-core';

// order_product_map table
export const orderProductMap = pgTable(
  'OrderProductMap',
  {
    id: serial('id'),
    orderId: integer('orderId').references(() => orders.Id, {
      onDelete: 'cascade',
    }),
    productId: integer('productId').references(() => products.Id, {
      onDelete: 'cascade',
    }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.orderId, table.productId] }),
    orderIdIndex: index('orderIdIndex').on(table.orderId),
  }),
);
