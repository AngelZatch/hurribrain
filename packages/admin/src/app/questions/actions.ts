import { revalidatePath } from "next/cache";
import { CreateQuestionDto, Question } from "../types/question"

const getQuestion = async (uuid: string): Promise<Question> => {
  const data = await fetch(`http://localhost:8080/questions/${uuid}`);
  const question = await data.json();

  return question;
}

const createQuestion = async (formData: FormData) => { 
  const title = formData.get("title") as string;
  const choices = [
    {
      value: formData.get("choice-0") as string,
      isCorrect: formData.get("correct-choice") === "choice-0",
    },
    {
      value: formData.get("choice-1") as string,
      isCorrect: formData.get("correct-choice") === "choice-1",
    },
    {
      value: formData.get("choice-2") as string,
      isCorrect: formData.get("correct-choice") === "choice-2",
    },
    {
      value: formData.get("choice-3") as string,
      isCorrect: formData.get("correct-choice") === "choice-3",
    },
  ]

  const rawFormData: CreateQuestionDto = {
    title,
    // tags: [],
    choices,
  };

  console.log(rawFormData)

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