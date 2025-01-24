import { FastifyInstance } from "fastify"
import { Answer } from "./../entities/answer.entity.js"
import { Choice } from "./../entities/choice.entity.js"
import { Participation } from "./../entities/participation.entity.js"
import { Turn } from "./../entities/turn.entity.js"
import { verifyJWT } from "./../utils/authChecker.js"
import { Game } from "./../entities/game.entity.js"
import { User } from "./../entities/user.entity.js"
import { ErrorResponsesSchema } from "./../schemas/errors.schema.js"
import { MyAnswerSchema } from "./../schemas/answer.schema.js"
import { GameByIdParams } from "./../schemas/game.schema.js"
import GameService from "./../services/game.service.js"

const TurnController = async (fastify: FastifyInstance) => {
  fastify.get<{
    Params: GameByIdParams
  }>("/", async (request) => {
    const em = request.em

    return em.find(
      Turn,
      {
        game: { uuid: request.params.gameId } as Game,
      },
      { orderBy: { position: "ASC" }, populate: ["question"] }
    )
  })

  fastify.get<{
    Params: GameByIdParams
  }>("/current", async (request) => {
    const em = request.em

    return em.findOne(
      Turn,
      {
        game: { uuid: request.params.gameId } as Game,
        startedAt: { $ne: null },
        finishedAt: null,
      },
      {
        orderBy: { position: "ASC" },
        populate: ["question"],
      }
    )
  })

  fastify.put<{
    Params: { gameId: string; turnId: string }
  }>("/:turnId/finish", async (request) => {
    const { gameId, turnId } = request.params
    const gameService = new GameService()

    const updatedTurn = await gameService.finishCurrentTurn(gameId, turnId)

    return updatedTurn
  })

  fastify.put<{
    Params: GameByIdParams
  }>("/next", async (request) => {
    const { gameId } = request.params
    const gameService = new GameService()

    const currentTurn = await gameService.startNextTurn(gameId)

    return currentTurn
  })

  fastify.post<{
    Params: { gameId: string; turnId: string }
    Body: { choiceId: string | null }
  }>(
    "/:turnId/answers",
    {
      schema: {
        tags: ["Turns", "Answers"],
      },
      preHandler: [fastify.auth([verifyJWT])],
    },
    async (request, reply) => {
      const em = request.em
      const { gameId, turnId } = request.params
      const user = request.user
      const { choiceId } = request.body

      const turn = await em.findOneOrFail(
        Turn,
        {
          uuid: turnId,
          startedAt: { $ne: null },
          finishedAt: null,
        },
        {
          failHandler: () => {
            reply.statusCode = 404
            return new Error("This turn is not available.")
          },
        }
      )

      // Putting the speed of answer as early as possible
      const speedOfAnswer = Math.round(
        Date.now() - Date.parse(turn.startedAt!.toString())
      )

      const participation = await em.findOneOrFail(
        Participation,
        {
          user: { uuid: user } as User,
          game: { uuid: gameId } as Game,
        },
        {
          failHandler: () => {
            reply.statusCode = 404
            return new Error("You are not participating in this game.")
          },
        }
      )

      if (!choiceId) {
        await em.nativeDelete(Answer, {
          participation: participation.uuid,
          turn: turn.uuid,
        })
        return true
      }

      const choice = await em.findOneOrFail(
        Choice,
        {
          uuid: choiceId,
          question: turn.question,
        },
        {
          failHandler: () => {
            reply.statusCode = 404
            return new Error(
              "The selected option does not belong to this question. Please refresh your game to get the correct question."
            )
          },
        }
      )

      let playerAnswer = await em.findOne(Answer, {
        participation: { uuid: participation.uuid } as Participation,
        turn: { uuid: turn.uuid } as Turn,
      })

      if (!playerAnswer) {
        playerAnswer = new Answer({
          participation,
          turn,
          choice,
          speed: speedOfAnswer,
        })
      } else {
        playerAnswer.choice = choice
        playerAnswer.speed = speedOfAnswer
      }

      await em.persistAndFlush(playerAnswer)

      return true
    }
  )

  fastify.get<{
    Params: { gameId: string; turnId: string }
  }>(
    "/:turnId/myanswer",
    {
      schema: {
        tags: ["Turns", "Answers", "Gameplay Loop"],
        summary: "Get the answer of the current user for the current turn",
        response: {
          200: MyAnswerSchema,
          ...ErrorResponsesSchema,
        },
      },
      preHandler: [fastify.auth([verifyJWT])],
    },
    async (request) => {
      const em = request.em
      const { gameId, turnId } = request.params
      const user = request.user

      const participant = await em.findOneOrFail(Participation, {
        user: { uuid: user } as User,
        game: { uuid: gameId } as Game,
      })

      return em.findOne(
        Answer,
        {
          participation: { uuid: participant.uuid } as Participation,
          turn: { uuid: turnId } as Turn,
        },
        {
          populate: ["choice"],
        }
      )
    }
  )
}

export default TurnController
