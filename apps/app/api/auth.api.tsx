import { useAuth } from "@/contexts/auth.context";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";

export type MyAccountInfo = {
  uuid: string;
  email: string;
  name: string;
  role: "standard" | "lite" | "admin";
  createdAt: string;
  updatedAt: string;
};

export type MyAccountInfoWithStats = MyAccountInfo & {
  stats: {
    level: number;
    experiencePoints: number;
    gamesPlayed: number;
    gamesWon: number;
    firstGamePlayed: string;
    firstGameWon: string;
  };
};

export type BaseAuthenticationSchema = {
  email: string;
  password: string;
};

export type LiteAccountRegistrationSchema = {
  name: string;
};

export type LoginSchema = BaseAuthenticationSchema;

export type StandardAccountRegistrationSchema = BaseAuthenticationSchema &
  LiteAccountRegistrationSchema;

export type LiteAccountConversionSchema = BaseAuthenticationSchema & {
  uuid: string;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: StandardAccountRegistrationSchema) => {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
        data,
      );
      return response.data;
    },
  });
};

export const useLiteRegister = () => {
  return useMutation({
    mutationFn: async (data: LiteAccountRegistrationSchema) => {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/lite`,
        data,
      );
      return response.data;
    },
  });
};

export const useLiteAccountConversion = () => {
  return useMutation({
    mutationFn: async (data: LiteAccountConversionSchema) => {
      const response = await axios.put(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/convert`,
        data,
      );

      return response.data;
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
        data,
      );
      return response.data;
    },
  });
};

export const useAuthCheck = () => {
  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/check`,
        data,
      );
      return response.data;
    },
  });
};

export const useAuthRecover = () => {
  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/recover`,
        data,
      );
      return response.data;
    },
  });
};

export const useGetMe = (token: string) => {
  const { logout } = useAuth();

  return useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<MyAccountInfo | void> => {
      return axios
        .get(`${process.env.EXPO_PUBLIC_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          logout();
          router.replace("/welcome");
        });
    },
  });
};

export const useGetMeWithStats = (token: string) => {
  return useQuery({
    queryKey: ["meWithStats"],
    queryFn: async (): Promise<MyAccountInfoWithStats> => {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/me`,
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

export const useDeleteAccount = (token: string) => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/delete`,
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
