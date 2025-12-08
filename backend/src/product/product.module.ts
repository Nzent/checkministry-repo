import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { DrizzleModule } from '../drizzle/drizzle.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [DrizzleModule],
})
export class ProductModule {}
