import { Type, Static } from "@sinclair/typebox"
import {
  AuthenticationTimeoutErrorResponseSchema,
  BadRequestErrorResponseSchema,
  ConflictErrorResponseSchema,
  ErrorResponseTemplateSchema,
  InternalServerErrorResponseSchema,
} from "./errors.schema.js"

// Account Check Schema
export const AuthCheckResponseSchema = Type.Number()

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
export type LoginRequestBody = Static<typeof LoginRequestSchema>

// Registration
export const RegistrationRequestSchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
  name: Type.String(),
})
export type RegistrationRequestBody = Static<typeof RegistrationRequestSchema>

// Lite accounts
export const LiteRegistrationRequestSchema = Type.Object({
  name: Type.String(),
})
export type LiteRegistrationRequestBody = Static<
  typeof LiteRegistrationRequestSchema
>

export const LiteAccountConversionRequestSchema = Type.Object({
  uuid: Type.String({ format: "uuid" }),
  email: Type.String({ format: "email" }),
  password: Type.String(),
})
export type LiteAccountConversionRequestBody = Static<
  typeof LiteAccountConversionRequestSchema
>

export const InvalidCredentialsErrorResponseSchema = {
  401: Type.Ref(ErrorResponseTemplateSchema, {
    description: "Invalid credentials",
    examples: [
      {
        statusCode: 401,
        error: "Unauthorized",
        message: "Invalid credentials",
        timestamp: "2021-07-06T16:00:00.000Z",
      },
    ],
  }),
}

export const AuthErrorResponsesSchema = {
  ...BadRequestErrorResponseSchema,
  ...InvalidCredentialsErrorResponseSchema,
  ...ConflictErrorResponseSchema,
  ...AuthenticationTimeoutErrorResponseSchema,
  ...InternalServerErrorResponseSchema,
}
