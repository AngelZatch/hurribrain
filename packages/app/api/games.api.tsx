import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Game = {
  uuid: string;
  code: string;
  tags: Array<{ uuid: string; name: string; description?: string }>;
  length: number;
  difficulty: "easy" | "medium" | "hard" | "expert" | "unknown";
};

export const useGetGames = (token: string) => {
  return useQuery({
    queryKey: ["games"],
    queryFn: async (): Promise<{
      data: Array<Game>;
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

export const useGetGame = (token: string, gameId: string) => {
  return useQuery({
    queryKey: ["games", gameId],
    queryFn: async (): Promise<Game> => {
      const response = await axios.get(
        `http://localhost:8080/games/${gameId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
  });
};

export const useJoinGame = (token: string) => {
  return useMutation({
    mutationFn: async (gameId: string) => {
      const response = await axios.post(
        `http://localhost:8080/games/${gameId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
  });
};
