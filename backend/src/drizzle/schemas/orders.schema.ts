import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

// order table
export const orders = pgTable('ORDERS', {
  Id: serial('Id').primaryKey(),
  orderDescription: varchar('orderDescription', { length: 100 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});
