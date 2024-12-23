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
    onSuccess: (data) => {
      console.log("REGISTERED", data);
    },
    onError: (error) => {
      console.error("REGISTER ERROR", error);
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
    onSuccess: (data) => {
      console.log("LOGGED IN", data);
    },
    onError: (error) => {
      console.error("LOGIN ERROR", error);
    },
  });
};
