import { Static, Type } from "@sinclair/typebox"
import { ChoiceSchema } from "./choice.schema.js"
import { Nullable } from "./common.schema.js"
import { TagResponseSchema } from "./tag.schema.js"

// Question Schema
export const QuestionResponseSchema = Type.Object(
  {
    uuid: Type.String({ format: "uuid" }),
    title: Type.String({
      description: "The title of the question",
      examples: ["What is the capital of France?"],
    }),
    tags: Type.Array(TagResponseSchema),
    choices: Type.Array(ChoiceSchema),
    // asset: Nullable(Type.Ref(AssetResponseSchema)),
    // correctAnswers: Type.Optional(Type.Integer()),
    // incorrectAnswers: Type.Optional(Type.Integer()),
    successRate: Type.Optional(Nullable(Type.Number())),
    difficulty: Type.Optional(Type.String()),
  },
  {
    $id: "Question",
    description: "Question entity",
  }
)

// Params
export const QuestionParamsSchema = Type.Object({
  questionId: QuestionResponseSchema.properties.uuid,
})

export type QuestionParams = Static<typeof QuestionParamsSchema>

// GET
// Get all questions
export const GetQuestionsReplySchema = Type.Object({
  data: Type.Array(QuestionResponseSchema),
  nextCursor: Type.Optional(Type.Integer()),
})
// TODO: Validation does not work with those
export type GetQuestionsReply = Static<typeof GetQuestionsReplySchema>

// Get one question by id
export const GetQuestionReplySchema = QuestionResponseSchema
export type GetQuestionReply = Static<typeof GetQuestionReplySchema>

// POST
export const CreateQuestionSchema = Type.Object({
  title: Type.String({
    description: "The title of the question",
    examples: ["What is the capital of France?"],
    minLength: 5,
    maxLength: 255,
  }),
  asset: Type.Optional(
    Type.String({
      format: "uuid",
      description: "An optional asset",
    })
  ),
  choices: Type.Array(
    Type.Object({
      value: Type.String({
        description: "The value of the choice",
        examples: ["Paris"],
        minLength: 1,
        maxLength: 255,
      }),
      isCorrect: Type.Boolean({
        description:
          "Whether the choice is correct or not. Only one choice may be correct.",
      }),
    })
  ),
  tags: Type.Array(TagResponseSchema),
})

export type PostQuestionBody = Static<typeof CreateQuestionSchema>
export type PostQuestionReply = Static<typeof QuestionResponseSchema>
