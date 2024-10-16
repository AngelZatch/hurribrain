import { Static, Type } from "@sinclair/typebox"
import { ErrorResponsesSchema } from "./errors.schema.js"
import { TagResponseSchema } from "./tag.schema.js"
import { ChoiceSchema } from "./choice.schema.js"
import { Nullable } from "./common.schema.js"

// GET
export const QuestionResponseSchema = Type.Object(
  {
    uuid: Type.String({ format: "uuid" }),
    title: Type.String(),
    tags: Type.Array(Type.Ref(TagResponseSchema)),
    choices: Type.Array(Type.Ref(ChoiceSchema)),
    asset: Nullable(Type.Optional(Type.String())),
    correctAnswers: Type.Number(),
    incorrectAnswers: Type.Number(),
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

export type GetProgramsReply = Static<typeof QuestionResponseSchema>

// POST
const PostQuestionBodySchema = Type.Object({
  title: Type.String({
    description: "The title of the question",
    examples: ["What is the capital of France?"],
    minLength: 5,
    maxLength: 255,
  }),
  asset: Type.Optional(
    Type.String({
      description: "An optional asset",
      examples: ["uuidv4"],
    })
  ),
})

export type PostProgramBody = Static<typeof PostQuestionBodySchema>
export type PostProgramReply = Static<typeof QuestionResponseSchema>

export const PostQuestionSchema = {
  tags: ["Questions"],
  summary: "Creates a new question",
  params: {},
  body: PostQuestionBodySchema,
  response: {
    201: QuestionResponseSchema,
    ...ErrorResponsesSchema,
  },
}
