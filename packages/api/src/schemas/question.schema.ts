import { Static, Type } from "@sinclair/typebox"

// Question Schema
export const QuestionResponseSchema = Type.Object(
  {
    uuid: Type.String({ format: "uuid" }),
    title: Type.String({
      description: "The title of the question",
      examples: ["What is the capital of France?"],
    }),
    // tags: Type.Array(Type.Ref(TagResponseSchema)),
    // choices: Type.Array(Type.Ref(ChoiceSchema)),
    // asset: Nullable(Type.Ref(AssetResponseSchema)),
    correctAnswers: Type.Number(),
    incorrectAnswers: Type.Number(),
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
  data: Type.Array(Type.Ref(QuestionResponseSchema)),
  nextCursor: Type.Optional(Type.Integer()),
})
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
})

export type PostQuestionBody = Static<typeof CreateQuestionSchema>
export type PostQuestionReply = Static<typeof QuestionResponseSchema>
