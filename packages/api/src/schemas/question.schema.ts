import { Type } from "@sinclair/typebox"
import { ErrorResponsesSchema } from "./errors.schema.js"

export const QuestionResponseSchema = Type.Object(
  {
    uuid: Type.String({ format: "uuid" }),
    title: Type.Optional(Type.String()),
    tags: Type.Optional(Type.Array(Type.String())),
    choices: Type.Optional(Type.Array(Type.String())),
    asset: Type.Optional(Type.String()),
    correctAnswers: Type.Optional(Type.Number()),
    incorrectAnswers: Type.Optional(Type.Number()),
    createdAt: Type.String({ format: "date-time" }),
    updatedAt: Type.String({ format: "date-time" }),
    deletedAt: Type.Optional(Type.String({ format: "date-time" })),
  },
  {
    $id: "Question",
    description: "Question entity",
  }
)

export const GetQuestionsSchema = {
  tags: ["Questions"],
  summary: "Returns the list of all available questions",
  params: {},
  response: {
    200: {
      type: "array",
      items: QuestionResponseSchema,
    },
    ...ErrorResponsesSchema,
  },
}
