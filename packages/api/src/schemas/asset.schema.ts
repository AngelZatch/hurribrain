import { Static, Type } from "@sinclair/typebox/type"
import { ErrorResponsesSchema } from "./errors.schema.js"

// Asset Schema
export const AssetResponseSchema = Type.Object(
  {
    uuid: Type.String({ format: "uuid" }),
    name: Type.String(),
    uri: Type.String(),
  },
  {
    $id: "Asset",
    description: "Asset entity",
  }
)

// GET Assets
export const GetAssetsSchema = {
  tags: ["Assets"],
  summary: "Returns the list of all available assets",
  params: {},
  response: {
    200: {
      type: "array",
      items: AssetResponseSchema,
    },
    ...ErrorResponsesSchema,
  },
}

export type GetAssetsReply = Static<typeof AssetResponseSchema>
