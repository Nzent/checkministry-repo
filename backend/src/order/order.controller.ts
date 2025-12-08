import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // get all orders
  @Get()
  findAll() {
    return this.orderService.findAllOrder();
  }

  // get order by id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  // create order
  @Post()
  create(@Body() body: { orderDescription: string; productIds?: number[] }) {
    return this.orderService.create(
      body.orderDescription,
      body.productIds || [],
    );
  }

  // update order by id
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      orderDescription: string;
      productIds?: number[];
    },
  ) {
    return this.orderService.update(
      +id,
      body.orderDescription,
      body.productIds || [],
    );
  }

  // delete order
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
