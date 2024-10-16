import { Type } from "@sinclair/typebox"

export const ChoiceSchema = Type.Object(
  {
    uuid: Type.String({
      format: "uuid",
      description: "Unique identifier for the choice",
    }),
    value: Type.String({ description: "Text of the choice" }),
    isCorrect: Type.Boolean({
      description: "Indicates if the choice is correct",
    }),
  },
  {
    $id: "Choice",
    description: "Choice entity",
  }
)
