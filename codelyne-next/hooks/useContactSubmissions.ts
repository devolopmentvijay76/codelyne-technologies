import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ContactSubmission, InsertContactSubmission } from "@shared/schema";

export function useContactSubmissions() {
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery<ContactSubmission[]>({
    queryKey: ["contactSubmissions"],
    queryFn: async () => {
      const response = await fetch("/api/contact");
      if (!response.ok) throw new Error("Failed to fetch contact submissions");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (submission: InsertContactSubmission) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit contact form");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactSubmissions"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/contact/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete submission");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactSubmissions"] });
    },
  });

  return {
    submissions,
    isLoading,
    submitContact: createMutation.mutate,
    deleteSubmission: deleteMutation.mutate,
    isSubmitting: createMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
