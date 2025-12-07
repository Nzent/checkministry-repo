import { Inject, Injectable } from '@nestjs/common';
import * as schema from '@repo/drizzle-database/';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
@Injectable()
export class OrdersService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private readonly database: NodePgDatabase<typeof schema>,
  ) {}

  async getAllOrders() {
    return await this.database.query.orders.findMany();
  }
}
