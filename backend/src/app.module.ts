import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    DrizzleModule,
    OrderModule,
    ProductModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class AppModule {}
