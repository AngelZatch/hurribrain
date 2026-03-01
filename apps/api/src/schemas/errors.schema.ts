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
  401: Type.Ref(ErrorResponseTemplateSchema, {
    description: "Unauthorized",
    examples: [
      {
        statusCode: 401,
        error: "Unauthorized",
        message: "You are not logged in. Please log in and try again.",
        timestamp: "2021-07-06T16:00:00.000Z",
      },
    ],
  }),
}

export const ForbiddenErrorResponseSchema = {
  403: Type.Ref(ErrorResponseTemplateSchema, {
    description: "Forbidden",
    examples: [
      {
        statusCode: 403,
        error: "Forbidden",
        message: "You do not have permission to access this resource",
        timestamp: "2021-07-06T16:00:00.000Z",
      },
    ],
  }),
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
