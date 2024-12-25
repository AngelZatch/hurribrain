import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
        data
      );
      return response.data;
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: String }) => {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        data
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
