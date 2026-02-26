import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      name: string;
      password: string;
    }) => {
      const response = await axios.post(
        "http://localhost:8080/auth/register",
        data,
      );
      return response.data;
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        data,
      );
      return response.data;
    },
  });
};

export const useAuthCheck = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await axios.post(
        "http://localhost:8080/auth/check",
        data,
      );
      return response.data;
    },
  });
};

export const useAuthRecover = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await axios.post(
        "http://localhost:8080/auth/recover",
        data,
      );
      return response.data;
    },
  });
};

export const useGetMe = (token: string) => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<{
      uuid: string;
      email: string;
      name: string;
      createdAt: string;
      updatedAt: string;
    }> => {
      const response = await axios.get("http://localhost:8080/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
};

export const useGetMeWithStats = (token: string) => {
  return useQuery({
    queryKey: ["meWithStats"],
    queryFn: async (): Promise<{
      uuid: string;
      email: string;
      name: string;
      createdAt: string;
      updatedAt: string;
      stats: {
        level: number;
        experiencePoints: number;
        gamesPlayed: number;
        gamesWon: number;
        firstGamePlayed: string;
        firstGameWon: string;
      };
    }> => {
      const response = await axios.get("http://localhost:8080/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
};

export const useDeleteAccount = (token: string) => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await axios.post(
        "http://localhost:8080/auth/delete",
        data,
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
