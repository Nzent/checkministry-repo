import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    DrizzleModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
