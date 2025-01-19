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
import { Question } from "./../entities/question.entity.js"
import { Turn } from "./../entities/turn.entity.js"
import PlayerController from "./player.controller.js"

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
        populate: ["tags", "playerCount", "creator"],
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
        { populate: ["tags", "playerCount", "creator"] }
      )

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
      preHandler: [fastify.auth([verifyJWT])],
    },
    async (request, reply) => {
      const em = request.em
      const user = await em.findOneOrFail(User, { uuid: request.user })

      const { length, difficulty, tags, isPrivate = false } = request.body

      // Create the game
      const game = new Game({
        length,
        difficulty,
        isPrivate,
        creator: user,
      })

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
        { populate: ["tags", "creator"] }
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

  fastify.put<{
    Params: GameByIdParams
  }>(
    "/:gameId/start",
    {
      schema: {
        tags: ["Games"],
        summary: "Starts a game",
        params: GameByIdParamsSchema,
      },
      preHandler: [fastify.auth([verifyJWT])],
    },
    async (request, reply) => {
      const em = request.em
      const { gameId } = request.params

      const game = await em.findOneOrFail(
        Game,
        {
          uuid: gameId,
          creator: { uuid: request.user },
          startedAt: null,
          finishedAt: null,
        },
        {
          populate: ["tags"],
          failHandler: () => {
            reply.statusCode = 404
            return new Error("Game not found")
          },
        }
      )

      // Update game
      game.startedAt = new Date()

      em.persist(game)

      // Create all turns
      const difficultyFilter = {
        easy: 50,
        medium: 20,
        hard: 1,
        expert: 0,
      }

      // Get game.length questions from the database based on the tags and the difficulty
      const pickedQuestions = (
        await em.find(
          Question,
          {
            tags: { $in: game.tags.getItems() },
            $or: [
              {
                successRate: null,
              },
              {
                successRate: { $gte: difficultyFilter[game.difficulty!] },
              },
            ],
          },
          {
            fields: ["uuid"],
          }
        )
      )
        .map((question) => question.uuid)
        .sort(() => Math.random() - 0.5)
        .slice(0, game.length)

      console.log(pickedQuestions)

      // Create all turns
      pickedQuestions.forEach(async (question, index) => {
        const turn = new Turn({
          question: { uuid: question } as Question,
          game,
          position: index + 1,
        })
        if (index === 0) {
          turn.startedAt = new Date()
        }
        em.persist(turn)
      })

      await em.flush()

      console.log("FLUSHED")

      const firstTurn = await em.findOneOrFail(
        Turn,
        { game: game.uuid, position: 1 },
        { populate: ["question"] }
      )

      fastify.io.to(`game:${game.uuid}`).emit("game:updated", game)
      fastify.io.to(`game:${game.uuid}`).emit("turn:current", firstTurn)

      return reply.code(200).send(true)
    }
  )

  fastify.register(PlayerController, { prefix: "/:gameId/leaderboard" })
}

export default GameController
