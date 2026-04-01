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
  CannotStartGameErrorResponseSchema,
} from "./../schemas/game.schema.js"
import { Tag } from "./../entities/tag.entity.js"
import { Participation } from "./../entities/participation.entity.js"
import { User } from "./../entities/user.entity.js"
import {
  excludeLiteUsers,
  verifyJWT,
  verifyJWTIfExists,
} from "./../utils/authChecker.js"
import PlayerController from "./player.controller.js"
import TurnController from "./turn.controller.js"
import GameService from "./../services/game.service.js"

const GameController = async (fastify: FastifyInstance) => {
  fastify.addSchema(GameResponseSchema)

  fastify.get(
    "/",
    {
      schema: {
        tags: ["Games"],
        summary:
          "Returns the list of all available games to the authenticated user.",
        response: {
          200: GetGamesReplySchema,
          ...ErrorResponsesSchema,
        },
      },
      preHandler: [fastify.auth([verifyJWT])],
    },
    async (request, reply) => {
      const em = request.em

      const activeGamesAccessedByUser = (
        await em.find(
          Participation,
          {
            game: { isPrivate: true, finishedAt: null },
            user: request.user,
          },
          { populate: ["game"] }
        )
      ).map((participation) => participation.game.uuid)

      // The user can access different types of games:
      // - Public games with at least one spot to join
      // - Private games created by the user
      // - Private games the user is allowed to join by already having a participation
      const games = await em.find(
        Game,
        {
          finishedAt: null,
          $or: [
            { isPrivate: false, playerCount: { $lt: 12 } },
            { isPrivate: true, creator: { uuid: request.user } },
            { isPrivate: true, uuid: { $in: activeGamesAccessedByUser } },
          ],
        },
        {
          refresh: true,
          populate: ["tags", "playerCount", "creator"],
        }
      )

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
      preHandler: [fastify.auth([verifyJWT])],
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
      preHandler: [fastify.auth([verifyJWT, excludeLiteUsers])],
    },
    async (request, reply) => {
      const em = request.em
      const user = await em.findOneOrFail(
        User,
        { uuid: request.user },
        { filters: { notDeleted: true } }
      )

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

      await em.persist(game).flush()

      const createdGame = await em.findOne(
        Game,
        { uuid: game.uuid },
        { populate: ["tags", "creator"] }
      )

      return reply.code(201).send(createdGame)
    }
  )

  fastify.get<{
    Params: GameByCodeParams
  }>(
    "/:gameCode/prejoin",
    {
      schema: {
        tags: ["Games"],
        summary: `Checks if a game can be joined. If a user is provided, the endpoint will also check if they have already
          joined the game and let them through in that case`,
        params: GameByCodeParamsSchema,
        response: {
          200: GameResponseSchema,
          ...ErrorResponsesSchema,
        },
      },
      preHandler: [fastify.auth([verifyJWTIfExists])],
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
          populate: ["playerCount", "tags", "creator"],
          failHandler: () => {
            reply.statusCode = 404
            return new Error("Game not found")
          },
        }
      )

      // If the user isn't authenticated, we simply check if the game has enough room for them to join.
      if (!request.user) {
        if (game.playerCount === 12) {
          reply.statusCode = 403
          return new Error("Player limit reached")
        }

        // If the game has room, send back an OK
        return reply.code(200).send(game)
      } else {
        // If the request is authenticated, the user is checked against the participants of the game to see
        // if they have already joined the game. If they have, or if there's room left, they are said OK
        const userHasParticipation = await em.findOne(Participation, {
          user: { uuid: request.user },
          game,
        })

        if (!userHasParticipation && game.playerCount === 12) {
          reply.statusCode = 403
          return new Error("Player limit reached")
        }

        return reply.code(200).send(game)
      }
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
        response: {
          200: GameResponseSchema,
          ...ErrorResponsesSchema,
        },
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
          populate: ["tags", "playerCount", "creator"],
          failHandler: () => {
            reply.statusCode = 404
            return new Error("Game not found")
          },
        }
      )

      const userHasParticipation = await em.findOne(Participation, {
        user: { uuid: request.user },
        game,
      })

      if (!userHasParticipation) {
        // If the game already has 12 players, new ones cannot join
        if (game.playerCount === 12) {
          reply.statusCode = 403
          return new Error("Player limit reached")
        }

        const participation = new Participation({
          user: { uuid: request.user } as User,
          game,
        })
        await em.persist(participation).flush()
      }

      return reply.code(201).send(game)
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
        response: {
          200: {
            type: "boolean",
          },
          ...ErrorResponsesSchema,
          ...CannotStartGameErrorResponseSchema,
        },
      },
      preHandler: [fastify.auth([verifyJWT, excludeLiteUsers])],
    },
    async (request, reply) => {
      const { gameId } = request.params
      const gameService = new GameService()

      await gameService.startGame(gameId, request.user)
      await gameService.startNextTurn(gameId)

      return reply.code(200).send(true)
    }
  )

  fastify.put<{
    Params: GameByIdParams
  }>(
    "/:gameId/end",
    {
      schema: {
        tags: ["Games"],
        summary:
          "Ends a game. Can only be used by the creator of the game to end it prematurely and free all participants.",
        params: GameByIdParamsSchema,
        response: {
          200: {
            type: "boolean",
          },
          ...ErrorResponsesSchema,
        },
      },
      preHandler: [fastify.auth([verifyJWT])],
    },
    async (request, reply) => {
      const { gameId } = request.params
      const gameService = new GameService()

      await gameService.manuallyEndGame(gameId, request.user)

      return reply.code(200).send(true)
    }
  )

  fastify.register(TurnController, { prefix: "/:gameId/turns" })
  fastify.register(PlayerController, { prefix: "/:gameId/leaderboard" })
}

export default GameController
