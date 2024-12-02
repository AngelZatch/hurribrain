import { Static, Type } from "@sinclair/typebox"
import { TagResponseSchema } from "./tag.schema.js"
import { GameDifficulty } from "@src/entities/game.entity.js"

export const GameResponseSchema = Type.Object(
  {
    uuid: Type.String({ format: "uuid" }),
    code: Type.String({
      description: "The unique code of the game",
      examples: ["GDK29MED"],
    }),
    tags: Type.Array(TagResponseSchema),
    length: Type.Integer(),
    difficulty: Type.Enum(GameDifficulty),
  },
  {
    $id: "Game",
    description: "Game entity",
  }
)

export const GameParamsSchema = Type.Object({
  gameId: GameResponseSchema.properties.uuid,
})

export type GameParams = Static<typeof GameParamsSchema>

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
