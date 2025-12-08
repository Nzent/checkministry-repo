import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import type { DrizzleDB } from '../drizzle/types/drizzle';
import { orders } from '../drizzle/schemas/orders.schema';
import { orderProductMap } from '../drizzle/schemas/orderProductsMap.schema';
import { count, eq } from 'drizzle-orm';

@Injectable()
export class OrderService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  // create order
  async create(orderDescription: string, productIds: number[] = []) {
    // Create order first
    const [newOrder] = await this.db
      .insert(orders)
      .values({ orderDescription })
      .returning();

    // Then create product mappings if productIds provided
    if (productIds && productIds.length > 0) {
      const orderProductEntries = productIds.map((productId) => ({
        orderId: newOrder.Id,
        productId,
      }));

      await this.db.insert(orderProductMap).values(orderProductEntries);
    }

    return this.findOne(newOrder.Id); // Return with product count
  }

  // read all orders
  async findAllOrder() {
    const result = await this.db
      .select({
        Id: orders.Id,
        orderDescription: orders.orderDescription,
        createdAt: orders.createdAt,
        countOfProducts: count(orderProductMap.productId).as('countOfProducts'),
      })
      .from(orders)
      .leftJoin(orderProductMap, eq(orders.Id, orderProductMap.orderId))
      .groupBy(orders.Id, orders.orderDescription, orders.createdAt)
      .orderBy(orders.Id);

    return result;
  }

  // read one order
  async findOne(id: number) {
    const [order] = await this.db
      .select({
        Id: orders.Id,
        orderDescription: orders.orderDescription,
        createdAt: orders.createdAt,
        countOfProducts: count(orderProductMap.productId).as('countOfProducts'),
      })
      .from(orders)
      .leftJoin(orderProductMap, eq(orders.Id, orderProductMap.orderId))
      .where(eq(orders.Id, id))
      .groupBy(orders.Id, orders.orderDescription, orders.createdAt);
    return order;
  }

  // update one order
  // UPDATE order AND its mapped products
  async update(
    id: number,
    orderDescription: string,
    productIds: number[] = [],
  ) {
    // 1. Update order description
    const [updatedOrder] = await this.db
      .update(orders)
      .set({ orderDescription })
      .where(eq(orders.Id, id))
      .returning();

    if (!updatedOrder) {
      throw new Error(`Order with ID ${id} not found`);
    }

    // 2. Delete existing product mappings
    await this.db
      .delete(orderProductMap)
      .where(eq(orderProductMap.orderId, id));

    // 3. Add new product mappings if provided
    if (productIds && productIds.length > 0) {
      const orderProductEntries = productIds.map((productId) => ({
        orderId: id,
        productId,
      }));

      await this.db.insert(orderProductMap).values(orderProductEntries);
    }

    return this.findOne(id); // Return the updated order with products
  }

  // delete order
  async remove(id: number) {
    // First delete ALL product mappings for this order
    await this.db
      .delete(orderProductMap)
      .where(eq(orderProductMap.orderId, id));

    // Then delete the order itself
    const [deletedOrder] = await this.db
      .delete(orders)
      .where(eq(orders.Id, id))
      .returning();
    return deletedOrder;
  }
}
