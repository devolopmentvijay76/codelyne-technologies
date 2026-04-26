import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Content } from "@shared/schema";

export function useContent(key?: string) {
  const queryClient = useQueryClient();

  const { data: content, isLoading } = useQuery<Content>({
    queryKey: ["content", key],
    queryFn: async () => {
      const response = await fetch(`/api/content/${key}`);
      if (!response.ok) throw new Error("Failed to fetch content");
      return response.json();
    },
    enabled: !!key,
  });

  const { data: allContent = [] } = useQuery<Content[]>({
    queryKey: ["content"],
    queryFn: async () => {
      const response = await fetch("/api/content");
      if (!response.ok) throw new Error("Failed to fetch content");
      return response.json();
    },
    enabled: !key,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await fetch(`/api/content/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update content");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });

  const createMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save content");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });

  return {
    content,
    allContent,
    isLoading,
    updateContent: updateMutation.mutate,
    createContent: createMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
}
