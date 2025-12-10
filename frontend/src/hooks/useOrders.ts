import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi, productApi } from "@/lib/api";
import { IUpdateOrder } from "@/types/order";

// Orders
export const useOrders = (searchTerm?: string) => {
  return useQuery({
    queryKey: ["orders", searchTerm],
    queryFn: () =>
      searchTerm ? orderApi.search(searchTerm) : orderApi.getAll(),
  });
};

export const useOrder = (id: number) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.getOne(id),
    enabled: !!id,
  });
};



export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateOrder }) =>
      orderApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => orderApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};


// Products
export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });
};
