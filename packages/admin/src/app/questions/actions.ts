import { revalidatePath } from "next/cache";
import { CreateQuestionDto, Question } from "../types/question"

const getQuestion = async (uuid: string): Promise<Question> => {
  const data = await fetch(`http://localhost:8080/questions/${uuid}`);
  const question = await data.json();

  return question;
}

const createQuestion = async (formData: FormData) => { 
  const rawFormData: CreateQuestionDto = {
    title: formData.get("title") as string,
    tags: JSON.parse(formData.get("tags") as string),
    choices: JSON.parse(formData.get("choices") as string),
  };

  await fetch("http://localhost:8080/questions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rawFormData),
  });

  revalidatePath("/questions");
}

export { getQuestion, createQuestion };