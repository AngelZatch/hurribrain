import { getEntityManager } from "./../middlewares/entityManager.middleware.js"
import { Answer } from "./../entities/answer.entity.js"
import { Turn } from "./../entities/turn.entity.js"
import { Participation } from "./../entities/participation.entity.js"
import { Game } from "./../entities/game.entity.js"
import { Question } from "./../entities/question.entity.js"
import { PlayableTurn, PlayedTurn } from "./../schemas/turn.schema.js"
import { Choice } from "./../entities/choice.entity.js"

export default class GameService {
  startGame = async (gameId: string) => {
    console.log(gameId)
  }

  syncGame = async (
    gameId: string
  ): Promise<PlayableTurn | PlayedTurn | null> => {
    const em = getEntityManager()

    // Getting the ongoing turn
    const currentTurn = await em.findOne(
      Turn,
      {
        game: gameId,
        startedAt: { $ne: null },
        finishedAt: null,
      },
      {
        orderBy: { position: "ASC" },
        fields: [
          "uuid",
          "position",
          "startedAt",
          "finishedAt",
          "question.title",
          "question.successRate",
          "question.difficulty",
          "question.choices.uuid",
          "question.choices.value",
          "game",
        ],
      }
    )

    // If no ongoing turn, return the last finished turn
    if (!currentTurn) {
      return em.findOne(
        Turn,
        {
          game: gameId,
          startedAt: { $ne: null },
          finishedAt: { $ne: null },
        },
        {
          orderBy: { position: "DESC" },
          fields: [
            "uuid",
            "position",
            "startedAt",
            "finishedAt",
            "question.title",
            "question.successRate",
            "question.difficulty",
            "question.choices.uuid",
            "question.choices.value",
            "question.choices.isCorrect",
            "game",
          ],
        }
      )
    }

    return currentTurn
  }

  startNextTurn = async (gameId: string): Promise<PlayableTurn | null> => {
    const em = getEntityManager()

    const nextTurn: PlayableTurn | null = await em.findOne(
      Turn,
      {
        game: gameId,
        startedAt: null,
      },
      {
        orderBy: { position: "ASC" },
        fields: [
          "uuid",
          "position",
          "startedAt",
          "finishedAt",
          "question.title",
          "question.successRate",
          "question.difficulty",
          "question.choices.uuid",
          "question.choices.value",
          "game",
        ],
      }
    )

    if (!nextTurn) {
      return null
    }

    nextTurn.startedAt = new Date()
    await em.persistAndFlush(nextTurn)

    return nextTurn
  }

  finishCurrentTurn = async (targetTurn: Turn): Promise<PlayedTurn> => {
    const em = getEntityManager()

    targetTurn.finishedAt = new Date()

    em.persist(targetTurn)

    // Get question score reward
    const questionScoreReward = this.getQuestionScore(
      targetTurn.question.difficulty
    )

    // Find all the correct answers
    const correctChoice = await em.findOneOrFail(Choice, {
      question: { uuid: targetTurn.question.uuid } as Question,
      isCorrect: true,
    })

    const turnAnswers = await em.find(
      Answer,
      {
        turn: { uuid: targetTurn.uuid } as Turn,
      },
      {
        orderBy: { speed: "ASC" },
        fields: ["uuid", "participation.uuid", "choice.uuid"],
      }
    )

    const correctAnswers: Array<{
      uuid: string
      participation: { uuid: string }
      choice: { uuid: string }
    }> = []
    const incorrectAnswers: Array<{
      uuid: string
      participation: { uuid: string }
      choice: { uuid: string }
    }> = []

    turnAnswers.forEach((answer) => {
      if (answer.choice.uuid === correctChoice!.uuid) {
        correctAnswers.push(answer)
      } else {
        incorrectAnswers.push(answer)
      }
    })

    console.log(targetTurn.question)

    targetTurn.question.correctAnswers += correctAnswers.length
    targetTurn.question.incorrectAnswers += incorrectAnswers.length

    em.persist(targetTurn.question)

    const correctAnswersByParticipationId = correctAnswers.reduce<{
      [key: string]: {
        uuid: string
        participation: { uuid: string }
        choice: { uuid: string }
        rank: number
      }
    }>((accumulator, answer, index) => {
      accumulator[answer.participation.uuid] = { ...answer, rank: index }
      return accumulator
    }, {})

    const incorrectAnswersByParticipationId = incorrectAnswers.reduce<{
      [key: string]: {
        uuid: string
        participation: { uuid: string }
        choice: { uuid: string }
        rank: number
      }
    }>((accumulator, answer, index) => {
      accumulator[answer.participation.uuid] = { ...answer, rank: index }
      return accumulator
    }, {})

    // Add points to all correct participants
    const participations = await em.find(Participation, {
      game: { uuid: targetTurn.game.uuid } as Game,
    })

    participations.forEach((participation) => {
      // Update previous score
      participation.previousScore = participation.score

      // Correct answer
      if (correctAnswersByParticipationId[participation.uuid]) {
        participation.score += questionScoreReward
      }

      // Incorrect answer
      if (incorrectAnswersByParticipationId[participation.uuid]) {
        participation.score -= 1
      }
      em.persist(participation)
    })

    // Refresh ranks of all participants
    let currentRank = 0
    let minScore = Infinity

    participations
      .sort((a, b) => b.score - a.score)
      .forEach((participation) => {
        if (participation.score < minScore) {
          minScore = participation.score
          currentRank += 1
        }

        participation.previousRank = participation.rank
        participation.rank = currentRank

        em.persist(participation)
      })

    await em.flush()

    const updatedTurn = await em.findOneOrFail(
      Turn,
      { uuid: targetTurn.uuid },
      {
        fields: [
          "uuid",
          "position",
          "startedAt",
          "finishedAt",
          "question.title",
          "question.successRate",
          "question.difficulty",
          "question.choices.uuid",
          "question.choices.value",
          "question.choices.isCorrect",
          "game",
        ],
      }
    )

    return updatedTurn
  }

  private getQuestionScore = (difficulty: Question["difficulty"]) => {
    switch (difficulty) {
      case "expert":
        return 5
      case "hard":
        return 3
      case "medium":
        return 2
      case "easy":
      case "unknown":
      default:
        return 1
    }
  }
}
