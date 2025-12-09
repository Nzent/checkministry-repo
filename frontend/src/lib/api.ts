import { IcreateOrder,  IOrder,  Product } from "@/types/order";
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Order API
export const orderApi = {
  // get all orders
  getAll: () => api.get<IOrder[]>("/order").then((res) => res.data),
  // get one order
  getOne: (id: number) =>
    api.get<IOrder>(`/order/${id}`).then((res) => res.data),
  // create order
  create: (data: IcreateOrder) =>
    api.post<IOrder>("/order", data).then((res) => res.data),
  // update order
  update: (id: number, data: Partial<IcreateOrder>) =>
    api.put<IOrder>(`/order/${id}`, data).then((res) => res.data),
  // delete order
  delete: (id: number) => api.delete(`/order/${id}`).then((res) => res.data),

  // search order
  search: (term: string) =>
    api
      .get<IOrder[]>("/order", { params: { search: term } })
      .then((res) => res.data),
};

// Product API
export const productApi = {
  // get all products
  getAll: () => api.get<Product[]>("/product").then((res) => res.data),
  // get one product by id
  getOne: (id: number) =>
    api.get<Product>(`/product/${id}`).then((res) => res.data),
};

export default api;
