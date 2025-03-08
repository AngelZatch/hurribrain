"use server"
import { revalidatePath } from "next/cache";
import { CreateQuestionDto, Question, QuestionFormInputs } from "../types/question"

const getQuestion = async (uuid: string): Promise<Question> => {
  const data = await fetch(`http://localhost:8080/questions/${uuid}`, {
    cache: "no-cache",
  });
  const question = await data.json();

  return question;
}

const createQuestion = async (data: QuestionFormInputs) => { 
  const rawFormData: CreateQuestionDto = {
    title: data.title,
    choices: [
      {
        value: data["choices-0"],
        isCorrect: true,
      },
      {
        value: data["choices-1"],
        isCorrect: false,
      },
      {
        value: data["choices-2"],
        isCorrect: false,
      },
      {
        value: data["choices-3"],
        isCorrect: false,
      },
    ],
    tags: data.tags,
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

const importQuestions = async (data: FormData) => {
  await fetch("http://localhost:8080/questions/import", {
    method: "POST",
    body: data,
  });

  revalidatePath("/questions");
}

const updateQuestion = async (data: QuestionFormInputs, uuid: string): Promise<void> => {
  const rawFormData: CreateQuestionDto = {
    title: data.title,
    choices: [
      {
        value: data["choices-0"],
        isCorrect: true,
      },
      {
        value: data["choices-1"],
        isCorrect: false,
      },
      {
        value: data["choices-2"],
        isCorrect: false,
      },
      {
        value: data["choices-3"],
        isCorrect: false,
      },
    ],
    tags: data.tags,
  };

  await fetch(`http://localhost:8080/questions/${uuid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rawFormData),
  });

  revalidatePath("/questions");
}

export { getQuestion, createQuestion, importQuestions, updateQuestion };