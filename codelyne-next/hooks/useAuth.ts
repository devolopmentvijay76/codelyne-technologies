import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  username: string;
}

interface AuthResponse {
  authenticated: boolean;
  user?: User;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: authData, isLoading } = useQuery<AuthResponse>({
    queryKey: ["auth"],
    queryFn: async () => {
      const response = await fetch("/api/auth/check");
      if (!response.ok) throw new Error("Failed to check authentication");
      return response.json();
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  return {
    user: authData?.user,
    isAuthenticated: authData?.authenticated || false,
    isLoading,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error as Error | null,
  };
}
