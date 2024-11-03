import { CreateTagDto } from "@/app/types/tag";

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
}

export { createTag, updateTag };
