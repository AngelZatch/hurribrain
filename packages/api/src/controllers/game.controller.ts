import { Game } from "@src/entities/game.entity.js"
import { ErrorResponsesSchema } from "@src/schemas/errors.schema.js"
import {
  CreateGameSchema,
  GameParams,
  GameParamsSchema,
  GameResponseSchema,
  GetGamesReplySchema,
  PostGameBody,
} from "@src/schemas/game.schema.js"
import { FastifyInstance } from "fastify"
import { wrap } from "@mikro-orm/core"
import { Tag } from "@src/entities/tag.entity.js"

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
      })

      return reply.code(200).send({
        data: games,
        nextCursor: 50,
      })
    }
  )

  fastify.get<{
    Params: GameParams
  }>(
    "/:gameId",
    {
      schema: {
        tags: ["Games"],
        summary: "Returns a game by id",
        params: GameParamsSchema,
        response: {
          200: GameResponseSchema,
          ...ErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em
      const { gameId } = request.params

      const game = await em.findOne(Game, { uuid: gameId })

      if (!game) {
        return reply.code(404).send({
          message: "Game not found",
        })
      }

      return reply.code(200).send(game)
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

      return reply.code(201).send(game)
    }
  )
}

export default GameController
