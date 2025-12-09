export interface IOrder {
  Id: number;
  orderDescription: string;
  countOfProducts: number;
  createdDate: string;
  products?: Product[];
}

export interface Product {
  Id: number;
  productName: string;
  productDescription: string;
}

export interface IcreateOrder {
  orderDescription: string;
  productIds: number[];
}

export interface IUpdateOrder {
  orderDescription: string;
  productIds: number[];
}
