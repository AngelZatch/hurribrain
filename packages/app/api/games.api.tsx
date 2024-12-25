import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetGames = (token: string) => {
  return useQuery({
    queryKey: ["games"],
    queryFn: async (): Promise<
      { uuid: string; name: string; createdAt: string; updatedAt: string }[]
    > => {
      const response = await axios.get("http://localhost:8080/games", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
};
