import { Static, Type } from "@sinclair/typebox"

import { TagResponseSchema } from "./tag.schema.js"
import { GameDifficulty } from "./../entities/game.entity.js"
import { UserResponseSchema } from "./user.schema.js"
import { Nullable } from "./common.schema.js"
import { ErrorResponseTemplateSchema } from "./errors.schema.js"

export const GameResponseSchema = Type.Object(
  {
    uuid: Type.String({ format: "uuid" }),
    code: Type.String({
      description: "The unique code of the game",
      examples: ["GDK29MED"],
    }),
    tags: Type.Array(TagResponseSchema),
    length: Type.Integer({
      minimum: 10,
      maximum: 50,
      examples: [20],
    }),
    difficulty: Type.Enum(GameDifficulty),
    playerCount: Type.Optional(Type.Integer()),
    creator: UserResponseSchema,
    isPrivate: Type.Boolean(),
    startedAt: Type.Optional(Nullable(Type.String({ format: "date-time" }))),
    finishedAt: Type.Optional(Nullable(Type.String({ format: "date-time" }))),
  },
  {
    $id: "Game",
    description: "Game entity",
  }
)

export const GameByIdParamsSchema = Type.Object({
  gameId: GameResponseSchema.properties.uuid,
})

export const GameByCodeParamsSchema = Type.Object({
  gameCode: GameResponseSchema.properties.code,
})

export const GameByIdOrCodeParamsSchema = Type.Object({
  identifier: Type.Union([
    GameResponseSchema.properties.uuid,
    GameResponseSchema.properties.code,
  ]),
})

export type GameByIdParams = Static<typeof GameByIdParamsSchema>
export type GameByCodeParams = Static<typeof GameByCodeParamsSchema>
export type GameByIdOrCodeParams = Static<typeof GameByIdOrCodeParamsSchema>

// GET

// Get all games
export const GetGamesReplySchema = Type.Object({
  data: Type.Array(GameResponseSchema),
  nextCursor: Type.Optional(Type.Integer()),
})
export type GetGamesReply = Static<typeof GetGamesReplySchema>

// Get one game by id
export const GetGameReplySchema = GameResponseSchema
export type GetGameReply = Static<typeof GetGameReplySchema>

// POST
export const CreateGameSchema = Type.Object({
  length: Type.Integer({
    description: "The length of the game",
    examples: [20],
    minimum: 10,
    maximum: 50,
  }),
  difficulty: Type.Enum(GameDifficulty),
  tags: Type.Array(TagResponseSchema),
  isPrivate: Type.Optional(Type.Boolean()),
})

export type PostGameBody = Static<typeof CreateGameSchema>
export type PostGameReply = Static<typeof GameResponseSchema>

export const CannotStartGameErrorResponseSchema = {
  400: Type.Ref(ErrorResponseTemplateSchema, {
    description:
      "The game is already started and cannot be started again, preventing duplicate logical actions.",
    title: "This game is already ongoing or finished and cannot be started.",
    examples: [
      {
        statusCode: 400,
        error: "Bad Request",
        message:
          "This game is already ongoing or finished and cannot be started.",
        timestamp: "2021-07-06T16:00:00.000Z",
      },
    ],
  }),
}
