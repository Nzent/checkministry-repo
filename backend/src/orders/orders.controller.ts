import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // get all orders
  @Get()
  async getOrders() {
    return this.ordersService.getAllOrders();
  }

  // get order by id
  @Get(':id')
  async getOrderByID(@Param('id') orderID: string) {
    return this.ordersService.getOrderById(parseInt(orderID));
  }

  // update order by id
  @Patch(':id')
  async updateOrder(
    @Param('id') orderID: string,
    @Body() request: { content: string },
  ) {
    return this.ordersService.updateOrder(parseInt(orderID), request);
  }

  // create a new order
  @Post()
  async createOrder(@Body() request: CreateOrderDto) {
    return this.ordersService.createOrder(request);
  }
}
