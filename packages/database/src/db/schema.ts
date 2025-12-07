import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Products Table
export const products = pgTable("products", {
  id: integer("id").primaryKey(),
  productName: varchar("product_name", { length: 100 }).notNull(),
  productDescription: text("product_description"),
});

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderDescription: varchar("order_description", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// OrderProductMap Table
export const orderProductMap = pgTable("order_product_map", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
});

// Relations
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
      references: [orders.id],
    }),
    product: one(products, {
      fields: [orderProductMap.productId],
      references: [products.id],
    }),
  })
);
