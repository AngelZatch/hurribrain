import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Tag = {
  uuid: string;
  name: string;
  description?: string;
};

export const useGetTags = (token: string) => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async (): Promise<Tag[]> => {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/tags`,
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
