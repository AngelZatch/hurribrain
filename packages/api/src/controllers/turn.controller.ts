import { Answer } from "@src/entities/answer.entity.js"
import { Choice } from "@src/entities/choice.entity.js"
import { Participation } from "@src/entities/participation.entity.js"
import { Turn } from "@src/entities/turn.entity.js"
import { FastifyInstance } from "fastify"

const TurnController = async (fastify: FastifyInstance) => {
  fastify.post<{
    Params: { turnId: string }
    Body: { choiceId: string | null }
  }>("/:turnId/answers", async (request, reply) => {
    const em = request.em
    const { turnId } = request.params
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
        user: { uuid: request.user },
        game: { uuid: turn.game.uuid },
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
      participation: participation.uuid,
      turn: turn.uuid,
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
  })
}

export default TurnController
