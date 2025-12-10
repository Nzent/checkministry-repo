import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

interface MockOrderService {
  findAllOrder: jest.Mock;
  findOne: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  remove: jest.Mock;
}

describe('OrderController', () => {
  let controller: OrderController;
  let service: MockOrderService;

  const mockOrderService: MockOrderService = {
    findAllOrder: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = mockOrderService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of orders', async () => {
      const mockOrders = [
        {
          Id: 1,
          orderDescription: 'Order 1',
          createdAt: new Date('2024-01-01'),
          countOfProducts: 2,
        },
        {
          Id: 2,
          orderDescription: 'Order 2',
          createdAt: new Date('2024-01-02'),
          countOfProducts: 0,
        },
      ];

      mockOrderService.findAllOrder.mockResolvedValue(mockOrders);

      const result = await controller.findAll();

      expect(service.findAllOrder).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockOrders);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no orders exist', async () => {
      mockOrderService.findAllOrder.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(service.findAllOrder).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      mockOrderService.findAllOrder.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(
        'Database connection failed',
      );
      expect(service.findAllOrder).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single order with products', async () => {
      const mockOrder = {
        Id: 1,
        orderDescription: 'Test Order',
        createdAt: new Date('2024-01-01'),
        countOfProducts: 3,
        products: [1, 2, 3],
      };

      mockOrderService.findOne.mockResolvedValue(mockOrder);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockOrder);
    });

    it('should return order with no products', async () => {
      const mockOrder = {
        Id: 2,
        orderDescription: 'Empty Order',
        createdAt: new Date('2024-01-02'),
        countOfProducts: 0,
        products: [],
      };

      mockOrderService.findOne.mockResolvedValue(mockOrder);

      const result = await controller.findOne('2');

      expect(service.findOne).toHaveBeenCalledWith(2);
      expect(result).toEqual(mockOrder);
    });

    it('should return null when order does not exist', async () => {
      mockOrderService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(service.findOne).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });

    it('should convert string id to number', async () => {
      mockOrderService.findOne.mockResolvedValue(null);

      await controller.findOne('123');

      expect(service.findOne).toHaveBeenCalledWith(123);
      expect(service.findOne).not.toHaveBeenCalledWith('123');
    });

    it('should handle service errors', async () => {
      const error = new Error('Order not found');
      mockOrderService.findOne.mockRejectedValue(error);

      await expect(controller.findOne('1')).rejects.toThrow('Order not found');
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create an order without products', async () => {
      const createDto = {
        orderDescription: 'New Order',
      };

      const mockCreatedOrder = {
        Id: 1,
        orderDescription: 'New Order',
        createdAt: new Date('2024-01-01'),
        countOfProducts: 0,
        products: [],
      };

      mockOrderService.create.mockResolvedValue(mockCreatedOrder);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith('New Order', []);
      expect(service.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCreatedOrder);
    });

    it('should create an order with products', async () => {
      const createDto = {
        orderDescription: 'Order with Products',
        productIds: [1, 2, 3],
      };

      const mockCreatedOrder = {
        Id: 1,
        orderDescription: 'Order with Products',
        createdAt: new Date('2024-01-01'),
        countOfProducts: 3,
        products: [1, 2, 3],
      };

      mockOrderService.create.mockResolvedValue(mockCreatedOrder);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(
        'Order with Products',
        [1, 2, 3],
      );
      expect(result).toEqual(mockCreatedOrder);
    });

    it('should handle empty productIds array', async () => {
      const createDto = {
        orderDescription: 'Order with empty products',
        productIds: [],
      };

      const mockCreatedOrder = {
        Id: 1,
        orderDescription: 'Order with empty products',
        createdAt: new Date('2024-01-01'),
        countOfProducts: 0,
        products: [],
      };

      mockOrderService.create.mockResolvedValue(mockCreatedOrder);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(
        'Order with empty products',
        [],
      );
      expect(result).toEqual(mockCreatedOrder);
    });

    it('should default to empty array when productIds is undefined', async () => {
      const createDto = {
        orderDescription: 'Order without productIds',
      };

      mockOrderService.create.mockResolvedValue({
        Id: 1,
        orderDescription: 'Order without productIds',
        createdAt: new Date(),
        countOfProducts: 0,
        products: [],
      });

      await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(
        'Order without productIds',
        [],
      );
    });

    it('should handle service errors during creation', async () => {
      const createDto = {
        orderDescription: 'Failed Order',
        productIds: [1, 2],
      };

      const error = new Error('Failed to create order');
      mockOrderService.create.mockRejectedValue(error);

      await expect(controller.create(createDto)).rejects.toThrow(
        'Failed to create order',
      );
      expect(service.create).toHaveBeenCalledWith('Failed Order', [1, 2]);
    });
  });

  describe('update', () => {
    it('should update an order with new description and products', async () => {
      const updateDto = {
        orderDescription: 'Updated Order',
        productIds: [4, 5, 6],
      };

      const mockUpdatedOrder = {
        Id: 1,
        orderDescription: 'Updated Order',
        createdAt: new Date('2024-01-01'),
        countOfProducts: 3,
        products: [4, 5, 6],
      };

      mockOrderService.update.mockResolvedValue(mockUpdatedOrder);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith(
        1,
        'Updated Order',
        [4, 5, 6],
      );
      expect(service.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('should update order and remove all products', async () => {
      const updateDto = {
        orderDescription: 'Updated Order No Products',
        productIds: [],
      };

      const mockUpdatedOrder = {
        Id: 1,
        orderDescription: 'Updated Order No Products',
        createdAt: new Date('2024-01-01'),
        countOfProducts: 0,
        products: [],
      };

      mockOrderService.update.mockResolvedValue(mockUpdatedOrder);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith(
        1,
        'Updated Order No Products',
        [],
      );
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('should update order description only when productIds is undefined', async () => {
      const updateDto = {
        orderDescription: 'Updated Description',
      };

      const mockUpdatedOrder = {
        Id: 1,
        orderDescription: 'Updated Description',
        createdAt: new Date('2024-01-01'),
        countOfProducts: 2,
        products: [1, 2],
      };

      mockOrderService.update.mockResolvedValue(mockUpdatedOrder);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith(1, 'Updated Description', []);
      expect(result).toEqual(mockUpdatedOrder);
    });

    it('should convert string id to number', async () => {
      const updateDto = {
        orderDescription: 'Test Update',
        productIds: [1],
      };

      mockOrderService.update.mockResolvedValue({
        Id: 42,
        orderDescription: 'Test Update',
        createdAt: new Date(),
        countOfProducts: 1,
        products: [1],
      });

      await controller.update('42', updateDto);

      expect(service.update).toHaveBeenCalledWith(42, 'Test Update', [1]);
      expect(service.update).not.toHaveBeenCalledWith('42', 'Test Update', [1]);
    });

    it('should handle errors when order not found', async () => {
      const updateDto = {
        orderDescription: 'Non-existent Order',
        productIds: [1],
      };

      const error = new Error('Order with ID 999 not found');
      mockOrderService.update.mockRejectedValue(error);

      await expect(controller.update('999', updateDto)).rejects.toThrow(
        'Order with ID 999 not found',
      );
      expect(service.update).toHaveBeenCalledWith(
        999,
        'Non-existent Order',
        [1],
      );
    });

    it('should handle service errors during update', async () => {
      const updateDto = {
        orderDescription: 'Failed Update',
        productIds: [1, 2],
      };

      const error = new Error('Database error');
      mockOrderService.update.mockRejectedValue(error);

      await expect(controller.update('1', updateDto)).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('delete', () => {
    it('should delete an order successfully', async () => {
      const mockDeletedOrder = {
        Id: 1,
        orderDescription: 'Deleted Order',
        createdAt: new Date('2024-01-01'),
      };

      mockOrderService.remove.mockResolvedValue(mockDeletedOrder);

      const result = await controller.delete('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockDeletedOrder);
    });

    it('should convert string id to number', async () => {
      mockOrderService.remove.mockResolvedValue({
        Id: 99,
        orderDescription: 'Test',
        createdAt: new Date(),
      });

      await controller.delete('99');

      expect(service.remove).toHaveBeenCalledWith(99);
      expect(service.remove).not.toHaveBeenCalledWith('99');
    });

    it('should return undefined when deleting non-existent order', async () => {
      mockOrderService.remove.mockResolvedValue(undefined);

      const result = await controller.delete('999');

      expect(service.remove).toHaveBeenCalledWith(999);
      expect(result).toBeUndefined();
    });

    it('should handle service errors during deletion', async () => {
      const error = new Error('Failed to delete order');
      mockOrderService.remove.mockRejectedValue(error);

      await expect(controller.delete('1')).rejects.toThrow(
        'Failed to delete order',
      );
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should handle database constraint errors', async () => {
      const error = new Error('Foreign key constraint violation');
      mockOrderService.remove.mockRejectedValue(error);

      await expect(controller.delete('1')).rejects.toThrow(
        'Foreign key constraint violation',
      );
    });
  });
});
