import { useQuery } from "@tanstack/react-query";
import type { Employee } from "@shared/schema";

export function usePublicTeam() {
  const { data: team = [], isLoading } = useQuery<Employee[]>({
    queryKey: ["publicTeam"],
    queryFn: async () => {
      const response = await fetch("/api/employees");
      if (!response.ok) throw new Error("Failed to fetch team");
      return response.json();
    },
  });

  const founders = team.filter(m => m.memberType === "founder");
  const management = team.filter(m => m.memberType === "management");
  const engineers = team.filter(m => m.memberType === "engineer");
  const admins = team.filter(m => m.memberType === "admin");

  return {
    team,
    founders,
    management,
    engineers,
    admins,
    isLoading,
  };
}
