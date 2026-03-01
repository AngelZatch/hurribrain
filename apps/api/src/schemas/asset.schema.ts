import { Static, Type } from "@sinclair/typebox/type"

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
export type GetAssetsReply = Static<typeof AssetResponseSchema>
