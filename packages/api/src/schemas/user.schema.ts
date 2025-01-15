import { Type } from "@sinclair/typebox"

export const UserResponseSchema = Type.Object(
  {
    uuid: Type.String({ format: "uuid" }),
    email: Type.String({ format: "email" }),
    name: Type.String(),
  },
  {
    $id: "User",
    description: "User entity",
  }
)
