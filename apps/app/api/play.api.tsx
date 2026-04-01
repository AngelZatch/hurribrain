import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Game } from "./games.api";
import { SECOND } from "./../utils/helperVariables";

export type Participation = {
  uuid: string;

  // SCORE
  score: number;
  previousScore: number;

  // RANK
  rank: number;
  previousRank: number;

  // RANK
  streak: number;
  maxStreak: number;

  // ITEM AND STATUSES
  itemCharge: number;
  activeItem: ItemName | null; // Loaded by the client
  statuses: Array<{
    name: StatusName; // Loaded by the client
    duration: number;
  }>;

  // GENERAL
  user: string; // Loaded by the client
  game?: {
    uuid: string;
  };
};

export type Leaderboard = Array<Participation>;

export type Turn = {
  uuid: string;
  position: number;
  isGold: boolean;
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
    asset: ActiveAsset | null;
  };
  isGold: Turn["isGold"];
  game: Turn["game"];
  startedAt: Date;
  finishedAt: null;
};

export type PlayedTurn = {
  uuid: Turn["uuid"];
  position: Turn["position"];
  isGold: Turn["isGold"];
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
    asset: ActiveAsset | null;
  };
  speedRanking: Array<Game["uuid"]>;
  game: Turn["game"];
  startedAt: Date;
  finishedAt: Date;
};

export type QuestionDifficulty =
  | "easy"
  | "medium"
  | "hard"
  | "expert"
  | "unknown";

export type Question = {
  uuid: string;
  title: string;
  choices: Array<Choice>;
  successRate: number | null;
  difficulty?: QuestionDifficulty;
};

export type Choice = {
  uuid: string;
  value: string;
  isCorrect?: boolean;
};

export type ActiveAsset = {
  uri: string;
  type: "image" | "sound" | "video";
};

export type Item = {
  uuid: string;
  name: string;
  description: string;
  type: "attack" | "defense" | "support";
};

export type StatusName =
  | "Coin"
  | "Half"
  | "Boost"
  | "Hidden"
  | "Shield"
  | "Turnaround"
  | "Scramble"
  | "Hurry"
  | "Judge"
  | "Lock"
  | "Darkness";

export type ItemName =
  | StatusName
  | "Super Quake"
  | "Super Scramble"
  | "Super Darkness";

export type MedalName =
  | "correct"
  | "difficulty:medium"
  | "difficulty:hard"
  | "difficulty:expert"
  | "streak:5"
  | "streak:10"
  | "streak:15"
  | "streak:20"
  | "streak:25"
  | "streak:30"
  | "streak:35"
  | "streak:40"
  | "streak:45"
  | "streak:50"
  | "speed:fast"
  | "speed:faster"
  | "speed:fastest"
  | "boost"
  | "gold:boost"
  | "gold:shield"
  | "incorrect"
  | "judge";

export type Answer = {
  uuid: string;
  participation: Participation;
  turn: Turn;
  choice: Choice;
  speed: number;
  medals: Array<MedalName>;
};

// Utility function to check if the user has a current participation so they can quickly resume
export const hasACurrentParticipation = (token: string) => {
  return useQuery({
    queryKey: ["my-participation"],
    queryFn: async (): Promise<Participation | null> => {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/my-participation`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
    staleTime: 15 * SECOND,
  });
};

export const useGetLeaderboard = (token: string, gameId: string) => {
  return useQuery({
    queryKey: ["leaderboard", gameId],
    queryFn: async (): Promise<Leaderboard> => {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/games/${gameId}/leaderboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
          `${process.env.EXPO_PUBLIC_API_URL}/games/${gameId}/start`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
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

// Prematurely end a game, as a player cannot play in more than one game at a time
export const useEndGame = (token: string) => {
  return useMutation({
    mutationFn: async (gameId: string) => {
      try {
        const response = await axios.put(
          `${process.env.EXPO_PUBLIC_API_URL}/games/${gameId}/end`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
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

// export const useGetMyParticipation = (token: string, gameId: string) => {
//   return useQuery({
//     queryKey: ["my-participation"],
//     queryFn: async (): Promise<Participation> => {
//       const response = await axios.get(
//         `${process.env.EXPO_PUBLIC_API_URL}/games/${gameId}/leaderboard/me`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );
//       return response.data;
//     },
//   });
// };

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
          `${process.env.EXPO_PUBLIC_API_URL}/games/${gameId}/turns/${turnId}/answers`,
          { choiceId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
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
  turnId: string,
) => {
  return useQuery<Answer>({
    queryKey: ["my-answer", gameId, turnId],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/games/${gameId}/turns/${turnId}/myanswer`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
  });
};
