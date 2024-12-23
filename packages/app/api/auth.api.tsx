import { useMutation, useQueryClient } from "@tanstack/react-query";
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
