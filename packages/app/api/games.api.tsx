import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetGames = (token: string) => {
  return useQuery({
    queryKey: ["games"],
    queryFn: async (): Promise<{
      data: [
        {
          uuid: string;
          code: string;
          tags: Array<{ uuid: string; name: string; description?: string }>;
          length: number;
          difficulty: string;
        },
      ];
      nextCursor: number;
    }> => {
      const response = await axios.get("http://localhost:8080/games", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
};
