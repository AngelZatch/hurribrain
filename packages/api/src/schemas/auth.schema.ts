import { Type, Static } from "@sinclair/typebox"

// Auth Schema
export const AuthResponseSchema = Type.Object({
  accessToken: Type.String(),
  refreshToken: Type.String(),
})

// Login
export const LoginRequestSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
})

export const RegistrationRequestSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
  name: Type.String(),
})

export type LoginRequestBody = Static<typeof LoginRequestSchema>
export type RegistrationRequestBody = Static<typeof RegistrationRequestSchema>
