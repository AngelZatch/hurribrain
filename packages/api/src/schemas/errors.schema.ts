import { Type } from "@sinclair/typebox"

export const ErrorResponseTemplateSchema = Type.Object(
  {
    statusCode: Type.Optional(
      Type.Number({
        description: "The HTTP status code of the error response",
      })
    ),
    error: Type.Optional(
      Type.String({
        description: "The error message",
      })
    ),
    message: Type.Optional(
      Type.String({
        description: "The error message",
      })
    ),
    timestamp: Type.Optional(
      Type.String({
        format: "date-time",
        description: "The timestamp of the error response",
      })
    ),
  },
  { $id: "Error" }
)

export const BadRequestErrorResponseSchema = {
  400: Type.Ref(ErrorResponseTemplateSchema, { description: "Bad Request" }),
}

export const UnauthorizedErrorResponseSchema = {
  401: Type.Ref(ErrorResponseTemplateSchema, { description: "Unauthorized" }),
}

export const InvalidCredentialsErrorResponseSchema = {
  401: Type.Ref(ErrorResponseTemplateSchema, {
    description: "Invalid credentials",
  }),
}

export const ForbiddenErrorResponseSchema = {
  403: Type.Ref(ErrorResponseTemplateSchema, { description: "Forbidden" }),
}

export const NotFoundErrorResponseSchema = {
  404: Type.Ref(ErrorResponseTemplateSchema, { description: "Not Found" }),
}

export const ConflictErrorResponseSchema = {
  409: Type.Ref(ErrorResponseTemplateSchema, { description: "Conflict" }),
}

export const AuthenticationTimeoutErrorResponseSchema = {
  419: Type.Ref(ErrorResponseTemplateSchema, {
    description: "Authentication Timeout",
  }),
}

export const UnprocessableEntityErrorResponseSchema = {
  422: Type.Ref(ErrorResponseTemplateSchema, {
    description: "Unprocessable Entity",
  }),
}

export const InternalServerErrorResponseSchema = {
  500: Type.Ref(ErrorResponseTemplateSchema, {
    description: "Internal Server Error",
  }),
}

export const ErrorResponsesSchema = {
  ...BadRequestErrorResponseSchema,
  ...UnauthorizedErrorResponseSchema,
  ...ForbiddenErrorResponseSchema,
  ...NotFoundErrorResponseSchema,
  ...AuthenticationTimeoutErrorResponseSchema,
  ...UnprocessableEntityErrorResponseSchema,
  ...InternalServerErrorResponseSchema,
}

export const AuthErrorResponsesSchema = {
  ...BadRequestErrorResponseSchema,
  ...InvalidCredentialsErrorResponseSchema,
  ...ConflictErrorResponseSchema,
  ...AuthenticationTimeoutErrorResponseSchema,
  ...InternalServerErrorResponseSchema,
}
