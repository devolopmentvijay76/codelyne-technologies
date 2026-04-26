import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Client, InsertClient } from "@shared/schema";

export function useClients() {
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
    queryFn: async () => {
      const res = await fetch("/api/clients");
      if (!res.ok) throw new Error("Failed to fetch clients");
      return res.json();
    },
  });

  const createClient = useMutation({
    mutationFn: async (data: InsertClient) => {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create client");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/clients"] }),
  });

  const updateClient = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertClient> }) => {
      const res = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update client");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/clients"] }),
  });

  const deleteClient = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete client");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/clients"] }),
  });

  return {
    clients,
    isLoading,
    createClient: createClient.mutate,
    updateClient: updateClient.mutate,
    deleteClient: deleteClient.mutate,
  };
}
