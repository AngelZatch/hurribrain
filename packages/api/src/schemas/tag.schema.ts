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
export const CreateTagSchema = Type.Object(
  {
    name: Type.String(),
    description: Type.Optional(Type.String()),
  },
  {
    $id: "CreateTag",
    description: "Create Tag entity",
  }
)

export type PostTagBody = Static<typeof CreateTagSchema>
export type PostTagReply = Static<typeof TagResponseSchema>
