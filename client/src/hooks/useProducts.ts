import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Product, InsertProduct } from "@shared/schema";

export function useProducts() {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const createProduct = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertProduct }) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/products/${id}`, { 
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  return {
    products,
    isLoading,
    createProduct: createProduct.mutate,
    updateProduct: updateProduct.mutate,
    deleteProduct: deleteProduct.mutate,
  };
}
