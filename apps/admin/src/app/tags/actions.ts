"use server";
import { CreateTagDto, Tag } from "@/app/types/tag";
import { revalidatePath } from "next/cache";

const getTags = async (): Promise<Array<Tag>> => {
  const data = await fetch("http://localhost:8080/tags");
  const tags: Array<Tag> = await data.json();

  return tags;
}

const getTag = async (uuid: string): Promise<Tag> => {
  const data = await fetch(`http://localhost:8080/tags/${uuid}`);
  const tag = await data.json();

  return tag;
}

const createTag = async (formData: FormData): Promise<void> => {
  const rawFormData: CreateTagDto = {
    name: formData.get("name") as string,
  };

  await fetch("http://localhost:8080/tags", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rawFormData),
  });

  revalidatePath("/tags");
}

const updateTag = async (formData: FormData, uuid: string): Promise<void> => {
  const rawFormData: CreateTagDto = {
    name: formData.get("name") as string,
  };

  await fetch(`http://localhost:8080/tags/${uuid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rawFormData),
  });

  revalidatePath("/tags");
}

export { getTags, getTag, createTag, updateTag };
