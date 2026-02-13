import { verifyJWT } from "./../utils/authChecker.js"
import { Game } from "./../entities/game.entity.js"
import { Participation } from "./../entities/participation.entity.js"
import { User } from "./../entities/user.entity.js"
import {
  GameByIdParams,
  GameByIdParamsSchema,
} from "./../schemas/game.schema.js"
import { FastifyInstance } from "fastify"
import {
  GetLeaderboardReplySchema,
  GetParticipationReply,
  GetParticipationReplySchema,
} from "./../schemas/player.schema.js"

const PlayerController = async (fastify: FastifyInstance) => {
  fastify.get<{
    Params: GameByIdParams
  }>(
    "/",
    {
      schema: {
        tags: ["Games", "Leaderboard", "Players"],
        summary: "Returns the leaderboard for a game",
        params: GameByIdParamsSchema,
        response: {
          200: GetLeaderboardReplySchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em
      const { gameId } = request.params

      const game = await em.findOneOrFail(
        Game,
        { uuid: gameId },
        {
          failHandler: () => {
            reply.statusCode = 404
            return new Error("Game not found")
          },
        }
      )

      const leaderboard = await em.find(
        Participation,
        { game: game.uuid },
        {
          fields: [
            "score",
            "previousScore",
            "rank",
            "previousRank",
            "streak",
            "maxStreak",
            "itemCharge",
            "activeItem",
            "statuses",
            "user.uuid",
            "user.email",
            "user.name",
            "game.uuid",
          ],
          orderBy: { score: "desc" },
        }
      )

      return reply.code(200).send(leaderboard)
    }
  )

  fastify.get<{
    Params: GameByIdParams
  }>(
    "/me",
    {
      schema: {
        tags: ["Games", "Players"],
        summary: "Returns the player details for the game",
        params: GameByIdParamsSchema,
        response: {
          200: GetParticipationReplySchema,
        },
      },
      preHandler: [fastify.auth([verifyJWT])],
    },
    async (request, reply): Promise<GetParticipationReply> => {
      const em = request.em
      const { gameId } = request.params

      await em.findOneOrFail(
        Game,
        { uuid: gameId },
        {
          failHandler: () => {
            reply.statusCode = 404
            return new Error("Game not found")
          },
        }
      )

      return em.findOneOrFail(
        Participation,
        {
          user: { uuid: request.user } as User,
          game: { uuid: gameId },
        },
        {
          fields: [
            "score",
            "previousScore",
            "rank",
            "previousRank",
            "streak",
            "maxStreak",
            "itemCharge",
            "activeItem",
            "statuses",
            "user.uuid",
            "user.email",
            "user.name",
            "game.uuid",
          ],
        }
      )
    }
  )
}

export default PlayerController
