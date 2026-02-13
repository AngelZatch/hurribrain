import { Static, Type } from "@sinclair/typebox"
import { UserResponseSchema } from "./user.schema.js"
import { Nullable } from "./common.schema.js"

export const PlayerSchema = Type.Object(
  {
    uuid: Type.String({ format: "uuid" }),
    score: Type.Number({ examples: [0] }),
    previousScore: Type.Number({ examples: [0] }),
    rank: Type.Number({ examples: [1] }),
    previousRank: Type.Number({ examples: [1] }),
    streak: Type.Number({ examples: [0] }),
    maxStreak: Type.Number({ examples: [0] }),
    itemCharge: Type.Number({ examples: [0] }),
    activeItem: Nullable(Type.String()),
    statuses: Type.Array(
      Type.Object({
        name: Type.String(),
        duration: Type.Number({ examples: [3] }),
      })
    ),
    user: UserResponseSchema,
    game: Type.Object({
      uuid: Type.String({
        format: "uuid",
      }),
    }),
  },
  { $id: "Player", description: "Player entity" }
)

export const GetParticipationReplySchema = PlayerSchema
export type GetParticipationReply = Static<typeof GetParticipationReplySchema>

export const GetLeaderboardReplySchema = Type.Array(PlayerSchema)
export type GetLeaderboardReply = Static<typeof GetLeaderboardReplySchema>
