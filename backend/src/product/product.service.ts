import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE } from '../drizzle/drizzle.module';
import type { DrizzleDB } from '../drizzle/types/drizzle';
import { products } from '../drizzle/schemas/products.schema';

@Injectable()
export class ProductService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  //   read all products
  async findAll() {
    return this.db.select().from(products).orderBy(products.Id);
  }
}
