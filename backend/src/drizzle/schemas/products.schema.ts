import { relations } from 'drizzle-orm';
import { pgTable, integer, varchar, text } from 'drizzle-orm/pg-core';
import { orderProductMap } from './orderProductsMap.schema';

export const products = pgTable('PRODUCTS', {
  Id: integer('Id').primaryKey(),
  productName: varchar('productName', { length: 100 }).notNull(),
  productDescription: text('productDescription'),
});

export const productsRelations = relations(products, ({ many }) => ({
  orderProducts: many(orderProductMap),
}));
