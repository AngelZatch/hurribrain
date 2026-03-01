import { Type } from "@sinclair/typebox"

export const MyAnswerSchema = Type.Object(
  {
    uuid: Type.String({
      format: "uuid",
      description: "Unique identifier for the answer",
    }),
    participation: Type.String({
      format: "uuid",
      description: "Unique identifier for the participation",
    }),
    speed: Type.Number({
      description: "Speed of the answer in milliseconds",
    }),
    choice: Type.Object({
      uuid: Type.String({
        format: "uuid",
        description: "Unique identifier for the choice",
      }),
      value: Type.String({ description: "Text of the choice" }),
    }),
  },
  {
    $id: "Answer",
    description: "Answer entity",
  }
)
