import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type Tag = {
  uuid: string;
  name: string;
  description?: string;
};

export const useGetTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: async (): Promise<Tag[]> => {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/tags`,
      );
      return response.data;
    },
  });
};
