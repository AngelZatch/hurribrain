import { Static, Type } from "@sinclair/typebox"
import { ErrorResponsesSchema } from "./errors.schema.js"

// GET
export const TagResponseSchema = Type.Object(
  {
    uuid: Type.String({ format: "uuid" }),
    name: Type.String(),
    description: Type.Optional(Type.String()),
  },
  {
    $id: "Tag",
    description: "Tag entity",
  }
)

export const getTagsSchema = {
  tags: ["Tags"],
  summary: "Returns the list of all available tags",
  params: {},
  response: {
    200: {
      type: "array",
      items: TagResponseSchema,
    },
    ...ErrorResponsesSchema,
  },
}

export type GetTagsReply = Static<typeof TagResponseSchema>

// POST
