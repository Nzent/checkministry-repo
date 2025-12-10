import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';

type MockDbFunction = jest.Mock & {
  mockReturnThis: () => MockDbFunction;
};

interface MockDb {
  insert: MockDbFunction;
  values: MockDbFunction;
  returning: jest.Mock;
  select: MockDbFunction;
  from: MockDbFunction;
  leftJoin: MockDbFunction;
  where: MockDbFunction;
  groupBy: MockDbFunction;
  orderBy: jest.Mock;
  update: MockDbFunction;
  set: MockDbFunction;
  delete: MockDbFunction;
}

describe('OrderService', () => {
  let service: OrderService;
  let mockDb: MockDb;

  beforeEach(async () => {
    mockDb = {
      insert: jest.fn().mockReturnThis() as MockDbFunction,
      values: jest.fn().mockReturnThis() as MockDbFunction,
      returning: jest.fn(),
      select: jest.fn().mockReturnThis() as MockDbFunction,
      from: jest.fn().mockReturnThis() as MockDbFunction,
      leftJoin: jest.fn().mockReturnThis() as MockDbFunction,
      where: jest.fn().mockReturnThis() as MockDbFunction,
      groupBy: jest.fn().mockReturnThis() as MockDbFunction,
      orderBy: jest.fn(),
      update: jest.fn().mockReturnThis() as MockDbFunction,
      set: jest.fn().mockReturnThis() as MockDbFunction,
      delete: jest.fn().mockReturnThis() as MockDbFunction,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService, { provide: 'DRIZZLE', useValue: mockDb }],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order without products', async () => {
      const orderDescription = 'Test Order';
      const mockOrder = {
        Id: 1,
        orderDescription,
        createdAt: new Date(),
      };

      mockDb.returning.mockResolvedValueOnce([mockOrder]);
      mockDb.orderBy.mockResolvedValueOnce([
        {
          ...mockOrder,
          countOfProducts: 0,
          products: [],
        },
      ]);

      const result = await service.create(orderDescription);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith({ orderDescription });
      expect(result).toBeDefined();
    });

    it('should create an order with products', async () => {
      const orderDescription = 'Test Order with Products';
      const productIds = [1, 2, 3];
      const mockOrder = {
        Id: 1,
        orderDescription,
        createdAt: new Date(),
      };

      mockDb.returning.mockResolvedValueOnce([mockOrder]);
      mockDb.orderBy.mockResolvedValueOnce([
        {
          ...mockOrder,
          countOfProducts: 3,
          products: productIds,
        },
      ]);

      const result = await service.create(orderDescription, productIds);

      expect(mockDb.insert).toHaveBeenCalledTimes(2);
      expect(mockDb.values).toHaveBeenCalledWith({ orderDescription });
      expect(mockDb.values).toHaveBeenCalledWith(
        productIds.map((productId) => ({
          orderId: mockOrder.Id,
          productId,
        })),
      );
      expect(result).toBeDefined();
    });

    it('should create an order with empty product array', async () => {
      const orderDescription = 'Test Order';
      const mockOrder = {
        Id: 1,
        orderDescription,
        createdAt: new Date(),
      };

      mockDb.returning.mockResolvedValueOnce([mockOrder]);
      mockDb.orderBy.mockResolvedValueOnce([
        {
          ...mockOrder,
          countOfProducts: 0,
          products: [],
        },
      ]);

      const result = await service.create(orderDescription, []);

      expect(mockDb.insert).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();
    });
  });

  describe('findAllOrder', () => {
    it('should return all orders with product counts', async () => {
      const mockOrders = [
        {
          Id: 1,
          orderDescription: 'Order 1',
          createdAt: new Date(),
          countOfProducts: 2,
        },
        {
          Id: 2,
          orderDescription: 'Order 2',
          createdAt: new Date(),
          countOfProducts: 0,
        },
      ];

      mockDb.orderBy.mockResolvedValueOnce(mockOrders);

      const result = await service.findAllOrder();

      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalled();
      expect(mockDb.leftJoin).toHaveBeenCalled();
      expect(mockDb.groupBy).toHaveBeenCalled();
      expect(mockDb.orderBy).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no orders exist', async () => {
      mockDb.orderBy.mockResolvedValueOnce([]);

      const result = await service.findAllOrder();

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return an order with products', async () => {
      const orderId = 1;
      const mockOrder = {
        Id: orderId,
        orderDescription: 'Test Order',
        createdAt: new Date(),
        countOfProducts: 2,
      };
      const mockProducts = [{ productId: 1 }, { productId: 2 }];

      mockDb.groupBy.mockResolvedValueOnce([mockOrder]);
      mockDb.where.mockResolvedValueOnce(mockProducts);

      const result = await service.findOne(orderId);

      expect(mockDb.select).toHaveBeenCalledTimes(2);
      expect(mockDb.where).toHaveBeenCalled();
      expect(result).toEqual({
        ...mockOrder,
        products: [1, 2],
      });
    });

    it('should return order with empty products array', async () => {
      const orderId = 1;
      const mockOrder = {
        Id: orderId,
        orderDescription: 'Test Order',
        createdAt: new Date(),
        countOfProducts: 0,
      };

      mockDb.groupBy.mockResolvedValueOnce([mockOrder]);
      mockDb.where.mockResolvedValueOnce([]);

      const result = await service.findOne(orderId);

      expect(result).toEqual({
        ...mockOrder,
        products: [],
      });
    });

    it('should return null when order does not exist', async () => {
      const orderId = 999;

      mockDb.groupBy.mockResolvedValueOnce([]);

      const result = await service.findOne(orderId);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update order description and products', async () => {
      const orderId = 1;
      const orderDescription = 'Updated Order';
      const productIds = [3, 4, 5];
      const mockUpdatedOrder = {
        Id: orderId,
        orderDescription,
        createdAt: new Date(),
      };

      mockDb.returning.mockResolvedValueOnce([mockUpdatedOrder]);
      mockDb.where.mockResolvedValueOnce(undefined);
      mockDb.groupBy.mockResolvedValueOnce([
        {
          ...mockUpdatedOrder,
          countOfProducts: 3,
        },
      ]);
      mockDb.where.mockResolvedValueOnce(
        productIds.map((id) => ({ productId: id })),
      );

      const result = await service.update(
        orderId,
        orderDescription,
        productIds,
      );

      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.set).toHaveBeenCalledWith({ orderDescription });
      expect(mockDb.delete).toHaveBeenCalled();
      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.values).toHaveBeenCalledWith(
        productIds.map((productId) => ({
          orderId,
          productId,
        })),
      );
      expect(result).toBeDefined();
    });

    it('should update order and remove all products', async () => {
      const orderId = 1;
      const orderDescription = 'Updated Order No Products';
      const mockUpdatedOrder = {
        Id: orderId,
        orderDescription,
        createdAt: new Date(),
      };

      mockDb.returning.mockResolvedValueOnce([mockUpdatedOrder]);
      mockDb.where.mockResolvedValueOnce(undefined);
      mockDb.groupBy.mockResolvedValueOnce([
        {
          ...mockUpdatedOrder,
          countOfProducts: 0,
        },
      ]);
      mockDb.where.mockResolvedValueOnce([]);

      const result = await service.update(orderId, orderDescription, []);

      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.delete).toHaveBeenCalled();
      expect(mockDb.insert).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw error when order not found', async () => {
      const orderId = 999;
      const orderDescription = 'Non-existent Order';

      mockDb.returning.mockResolvedValueOnce([]);

      await expect(
        service.update(orderId, orderDescription, []),
      ).rejects.toThrow(`Order with ID ${orderId} not found`);

      expect(mockDb.update).toHaveBeenCalled();
      expect(mockDb.delete).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete order and its product mappings', async () => {
      const orderId = 1;
      const mockDeletedOrder = {
        Id: orderId,
        orderDescription: 'Deleted Order',
        createdAt: new Date(),
      };

      mockDb.where.mockResolvedValueOnce(undefined);
      mockDb.returning.mockResolvedValueOnce([mockDeletedOrder]);

      const result = await service.remove(orderId);

      expect(mockDb.delete).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockDeletedOrder);
    });

    it('should handle deleting order with no products', async () => {
      const orderId = 2;
      const mockDeletedOrder = {
        Id: orderId,
        orderDescription: 'Order with no products',
        createdAt: new Date(),
      };

      mockDb.where.mockResolvedValueOnce(undefined);
      mockDb.returning.mockResolvedValueOnce([mockDeletedOrder]);

      const result = await service.remove(orderId);

      expect(mockDb.delete).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockDeletedOrder);
    });

    it('should return undefined when order does not exist', async () => {
      const orderId = 999;

      mockDb.where.mockResolvedValueOnce(undefined);
      mockDb.returning.mockResolvedValueOnce([]);

      const result = await service.remove(orderId);

      expect(mockDb.delete).toHaveBeenCalledTimes(2);
      expect(result).toBeUndefined();
    });
  });
});
