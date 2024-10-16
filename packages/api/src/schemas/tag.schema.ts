import { Static, Type } from "@sinclair/typebox"

// Tag Schema
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

// GET Tags
export type GetTagsReply = Static<typeof TagResponseSchema>

// POST Tags
