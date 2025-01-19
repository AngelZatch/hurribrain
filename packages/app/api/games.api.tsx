import { User } from "@/contexts/auth.context";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Game = {
  uuid: string;
  code: string;
  tags: Array<{ uuid: string; name: string; description?: string }>;
  length: number;
  difficulty: "easy" | "medium" | "hard" | "expert" | "unknown";
  isPrivate: boolean;
  playerCount?: number;
  creator?: Omit<User, "role">;
  startedAt: Date | null;
  finishedAt: Date | null;
};

export type GameCreationDTO = {
  tags: Array<{ uuid: string; name: string; description?: string }>;
  length: number;
  difficulty: "easy" | "medium" | "hard" | "expert";
  isPrivate: boolean;
};

export type Turn = {
  uuid: string;
  position: number;
  question: Question;
  game: Game["uuid"];
  startedAt: Date | null;
  finishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Question = {
  uuid: string;
  title: string;
  choices: Array<Choice>;
  successRate: number | null;
  difficulty?: "easy" | "medium" | "hard" | "expert" | "unknown";
};

export type Choice = {
  uuid: string;
  value: string;
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
    mutationFn: async (gameCode: string) => {
      try {
        const response = await axios.post(
          `http://localhost:8080/games/${gameCode}/join`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw error.response?.data;
        }
        throw error;
      }
    },
  });
};

export const useCreateGame = (token: string) => {
  return useMutation({
    mutationFn: async (data: GameCreationDTO) => {
      try {
        const response = await axios.post("http://localhost:8080/games", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw error.response?.data;
        }
        throw error;
      }
    },
  });
};

export const useStartGame = (token: string) => {
  return useMutation({
    mutationFn: async (gameId: string) => {
      try {
        const response = await axios.put(
          `http://localhost:8080/games/${gameId}/start`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw error.response?.data;
        }
        throw error;
      }
    },
  });
};

export const useGetMyParticipation = (token: string, gameId: string) => {
  return useQuery({
    queryKey: ["my-participation"],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/games/${gameId}/leaderboard/me`,
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
