import { wrap } from "@mikro-orm/core"
import { FastifyInstance } from "fastify"
import { Game } from "./../entities/game.entity.js"
import { ErrorResponsesSchema } from "./../schemas/errors.schema.js"
import {
  CreateGameSchema,
  GameByCodeParamsSchema,
  GameResponseSchema,
  GetGamesReplySchema,
  PostGameBody,
  GameByIdOrCodeParams,
  GameByIdOrCodeParamsSchema,
  GameByCodeParams,
  GameByIdParams,
  GameByIdParamsSchema,
} from "./../schemas/game.schema.js"
import { Tag } from "./../entities/tag.entity.js"
import { Participation } from "./../entities/participation.entity.js"
import { User } from "./../entities/user.entity.js"
import { verifyJWT } from "./../utils/authChecker.js"

const GameController = async (fastify: FastifyInstance) => {
  fastify.addSchema(GameResponseSchema)

  fastify.get(
    "/",
    {
      schema: {
        tags: ["Games"],
        summary: "Returns the list of all available games",
        response: {
          200: GetGamesReplySchema,
          ...ErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em

      const games = await em.findAll(Game, {
        refresh: true,
        populate: ["tags", "playerCount"],
      })

      return reply.code(200).send({
        data: games,
        nextCursor: 50,
      })
    }
  )

  fastify.get<{
    Params: GameByIdOrCodeParams
  }>(
    "/:identifier",
    {
      schema: {
        tags: ["Games"],
        summary: "Returns a game by id or code",
        params: GameByIdOrCodeParamsSchema,
        response: {
          200: GameResponseSchema,
          ...ErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em
      const { identifier } = request.params

      const game = await em.findOne(
        Game,
        { $or: [{ uuid: identifier }, { code: identifier }] },
        { populate: ["tags", "playerCount"] }
      )

      if (!game) {
        return reply.code(404).send({
          message: "Game not found",
        })
      }

      return reply.code(200).send(game)
    }
  )

  fastify.get<{
    Params: GameByIdParams
  }>(
    "/:gameId/leaderboard",
    {
      schema: {
        tags: ["Games"],
        summary: "Returns the leaderboard for a game",
        params: GameByIdParamsSchema,
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
          populate: ["user"],
          orderBy: { score: "desc" },
        }
      )

      return reply.code(200).send(leaderboard)
    }
  )

  fastify.post<{
    Body: PostGameBody
  }>(
    "/",
    {
      schema: {
        tags: ["Games"],
        summary: "Creates a new game",
        body: CreateGameSchema,
        response: {
          201: GameResponseSchema,
          ...ErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em

      const { length, difficulty, tags } = request.body

      // Create the game
      const game = new Game({ length, difficulty, isPrivate: false })

      em.persist(game)

      // Add the tags
      const matchingTags = await em.find(
        Tag,
        { uuid: { $in: tags.map((tag) => tag.uuid) } },
        { fields: ["uuid"] }
      )
      wrap(game).assign({ tags: matchingTags })

      await em.persistAndFlush(game)

      const createdGame = await em.findOne(
        Game,
        { uuid: game.uuid },
        { populate: ["tags"] }
      )

      return reply.code(201).send(createdGame)
    }
  )

  fastify.post<{
    Params: GameByCodeParams
  }>(
    "/:gameCode/join",
    {
      schema: {
        tags: ["Games"],
        summary: "Joins a game",
        params: GameByCodeParamsSchema,
      },
      preHandler: [fastify.auth([verifyJWT])],
    },
    async (request, reply) => {
      const em = request.em
      const { gameCode } = request.params

      const game = await em.findOneOrFail(
        Game,
        {
          code: gameCode,
          finishedAt: null,
        },
        {
          failHandler: () => {
            reply.statusCode = 404
            return new Error("Game not found")
          },
        }
      )

      const participation = new Participation({
        user: { uuid: request.user } as User,
        game,
      })
      await em.persistAndFlush(participation)

      return reply.code(201).send(participation)
    }
  )

  fastify.get("/:gameId/play", { websocket: true }, (socket) => {
    socket.on("message", (message: unknown) => {
      console.log(message)
      socket.send("pong")
    })
  })
}

export default GameController
