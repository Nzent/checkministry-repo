import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';
import { orderProductMap } from './orderProductsMap.schema';

// order table
export const orders = pgTable('ORDERS', {
  Id: serial('Id').primaryKey(),
  orderDescription: varchar('orderDescription', { length: 100 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const ordersRelations = relations(orders, ({ many }) => ({
  orderProducts: many(orderProductMap),
}));
