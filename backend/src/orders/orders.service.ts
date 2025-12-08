import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schemas/schema';
import { DATABASE_CONNECTION } from '../database/database-connection';
import { eq } from 'drizzle-orm';
@Injectable()
export class OrdersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async getAllOrders() {
    return await this.database.query.orders.findMany();
  }

  async updateOrder(orderId: number, order: typeof schema.orders.$inferInsert) {
    return this.database
      .update(schema.orders)
      .set(order)
      .where(eq(schema.orders.Id, orderId))
      .returning();
  }

  async createOrder(order: typeof schema.orders.$inferInsert) {
    await this.database.insert(schema.orders).values(order);
  }

  async getOrderById(orderID: number) {
    return await this.database.query.orders.findFirst({
      where: eq(schema.orders.Id, orderID),
    });
  }
}
