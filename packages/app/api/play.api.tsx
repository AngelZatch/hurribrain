import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Game } from "./games.api";

export type Participation = {
  uuid: string;
  score: number;
  previousScore: number;
  rank: number;
  previousRank: number;
  user: {
    uuid: string;
    name: string;
  };
};

export type Leaderboard = Array<Participation>;

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

export type PlayableTurn = {
  uuid: Turn["uuid"];
  position: Turn["position"];
  question: {
    title: Question["title"];
    difficulty: Question["difficulty"];
    choices: [
      {
        uuid: Choice["uuid"];
        value: Choice["value"];
      },
    ];
  };
  game: Turn["game"];
  startedAt: Date;
  finishedAt: null;
};

export type PlayedTurn = {
  uuid: Turn["uuid"];
  position: Turn["position"];
  question: {
    title: Question["title"];
    difficulty: Question["difficulty"];
    choices: [
      {
        uuid: Choice["uuid"];
        value: Choice["value"];
        isCorrect: boolean;
      },
    ];
  };
  game: Turn["game"];
  startedAt: Date;
  finishedAt: Date;
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
  isCorrect?: boolean;
};

export const useGetLeaderboard = (token: string, gameId: string) => {
  return useQuery({
    queryKey: ["leaderboard", gameId],
    queryFn: async (): Promise<Leaderboard> => {
      const response = await axios.get(
        `http://localhost:8080/games/${gameId}/leaderboard`,
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
    queryKey: ["my-participation", gameId],
    queryFn: async (): Promise<Participation> => {
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

export const useAnswerQuestion = (token: string, gameId: string) => {
  return useMutation({
    mutationFn: async ({
      turnId,
      choiceId,
    }: {
      turnId: string;
      choiceId: string | null;
    }) => {
      try {
        const response = await axios.post(
          `http://localhost:8080/games/${gameId}/turns/${turnId}/answers`,
          { choiceId },
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

export const useGetMyAnswer = (
  token: string,
  gameId: string,
  turnId: string
) => {
  return useQuery({
    queryKey: ["my-answer", gameId, turnId],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:8080/games/${gameId}/turns/${turnId}/myanswer`,
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
