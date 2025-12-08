import { text, varchar, integer, pgTable } from 'drizzle-orm/pg-core';

// product table
export const products = pgTable('PRODUCTS', {
  Id: integer('Id').primaryKey(),
  productName: varchar('productName', { length: 100 }).notNull(),
  productDescription: text('productDescription'),
});
