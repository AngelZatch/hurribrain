import { getEntityManager } from "./../middlewares/entityManager.middleware.js"
import { Answer } from "./../entities/answer.entity.js"
import { Turn } from "./../entities/turn.entity.js"
import { Participation } from "./../entities/participation.entity.js"
import { Game } from "./../entities/game.entity.js"
import { Question } from "./../entities/question.entity.js"
import { PlayableTurn, PlayedTurn } from "./../schemas/turn.schema.js"
import { Choice } from "./../entities/choice.entity.js"
import { UserStats } from "./../entities/userStats.entity.js"
import { server } from "./../server.js"

import Queue from "bull"
const gameQueue = new Queue("games")

export default class GameService {
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

  startGame = async (gameId: string, userId: string) => {
    const em = getEntityManager()

    const game = await em.findOneOrFail(
      Game,
      {
        uuid: gameId,
        creator: { uuid: userId },
        startedAt: null,
        finishedAt: null,
      },
      {
        populate: ["tags"],
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

    // Create all turns
    pickedQuestions.forEach(async (question, index) => {
      const turn = new Turn({
        question: { uuid: question } as Question,
        game,
        position: index + 1,
      })
      em.persist(turn)
    })

    await em.flush()

    server.io.to(`game:${game.uuid}`).emit("game:updated", game)

    return game
  }

  /**
   * Starts the next turn of the game.
   *
   * To keep the gameplay loop going, this method will also create a job for the Game Worker to finish the turn in 15s.
   *
   * @param gameId The identifier of the game
   * @returns a PlayableTurn object or null if the game is finished
   */
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
      this.finishGame(gameId)
      return null
    }

    nextTurn.startedAt = new Date()
    await em.persistAndFlush(nextTurn)

    // Update sockets
    server.io.to(`game:${gameId}`).emit("turn:current", nextTurn)

    // 15s timer to play the turn
    gameQueue.add(
      {
        gameId,
        turnId: nextTurn.uuid,
        order: "finish",
      },
      {
        delay: 15000,
        attempts: 3,
        removeOnComplete: true,
      }
    )
    return nextTurn
  }

  /**
   * Finishes the turn.
   *
   * This method does a lot of things for the game overall:
   * - It finishes the turn
   * - It calculates the score of every participant based on their answers for the turn
   * - It then refreshes the ranks of all participants
   *
   * @param gameId The identifier of the game
   * @param turnId The identifier of the turn to finish
   * @returns A PlayedTurn object
   */
  finishCurrentTurn = async (
    gameId: string,
    turnId: string
  ): Promise<PlayedTurn> => {
    const em = getEntityManager()

    const targetTurn = await em.findOneOrFail(
      Turn,
      {
        uuid: turnId,
        game: { uuid: gameId } as Game,
        startedAt: { $ne: null },
        finishedAt: null,
      },
      {
        populate: ["question", "question.choices"],
      }
    )

    targetTurn.finishedAt = new Date()

    em.persist(targetTurn)

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

    // Get question score reward
    const questionScoreReward = this.getQuestionScore(
      targetTurn.question.difficulty
    )

    participations.forEach((participation) => {
      // Update previous score
      participation.previousScore = participation.score

      // Correct answer
      if (correctAnswersByParticipationId[participation.uuid]) {
        let scoreReward = questionScoreReward

        // Update streak
        participation.streak += 1
        participation.maxStreak = Math.max(
          participation.maxStreak,
          participation.streak
        )

        // If the streak is a multiple of 5, add a bonus
        if (participation.streak % 5 === 0) {
          scoreReward += participation.streak / 5
        }

        //  Speed bonus for the fastest correct answers
        if (participation.rank < 3) {
          scoreReward += Math.max(3 - participation.rank, 0)
          targetTurn.speedRanking.push(participation.uuid)
        }

        // Update score
        participation.score += scoreReward
      } else {
        // Reset streak
        participation.streak = 0

        // Incorrect answer
        if (incorrectAnswersByParticipationId[participation.uuid]) {
          participation.score = Math.max(participation.score - 1, 0)
        }
      }

      em.persist(participation)
    })

    em.persist(targetTurn)

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
          "speedRanking",
        ],
      }
    )

    console.log("UPDATED FINISHED TURN: ", updatedTurn)

    // Update sockets
    server.io.to(`game:${gameId}`).emit("turn:current", updatedTurn)

    // Job for the next turn in 15s
    gameQueue.add(
      {
        gameId,
        turnId: null,
        order: "next",
      },
      { delay: 15000, attempts: 3, removeOnComplete: true }
    )

    return updatedTurn
  }

  finishGame = async (gameId: string) => {
    const em = getEntityManager()

    const game = await em.findOneOrFail(Game, {
      uuid: gameId,
      startedAt: { $ne: null },
      finishedAt: null,
    })

    game.finishedAt ||= new Date()

    em.persist(game)

    // Give EXP to all participants based on their rank
    const participations = await em.find(Participation, {
      game: { uuid: gameId } as Game,
    })

    const userIds = participations.map((participation) => participation.user)

    const userStats = await em.find(UserStats, {
      user: { $in: userIds },
    })

    userStats.forEach((userStat) => {
      const participation = participations.find(
        (participation) => participation.user === userStat.user
      )

      if (!participation) {
        return
      }

      // Add the game played to the stat
      userStat.gamesPlayed += 1

      // Add experience points
      let experiencePoints = 100
      if (participation.rank === 1) {
        // Add the game won to the stat
        userStat.gamesWon += 1
        userStat.firstGameWon ||= new Date()
        experiencePoints += 100
      }
      if (participation.rank === 2) {
        experiencePoints += 150
      }
      if (participation.rank === 3) {
        experiencePoints += 125
      }
      userStat.experiencePoints += experiencePoints
      userStat.level = this.setUserLevel(userStat.experiencePoints)

      // Assign the first game played is not already set
      userStat.firstGamePlayed ||= new Date()

      em.persist(userStat)
    })

    await em.flush()

    server.io.to(`game:${gameId}`).emit("game:updated", game)

    return game
  }

  /**
   * Reference method to get the points awarded by a question based on its difficulty:
   * - 1 point for easy questions
   * - 2 points for medium questions
   * - 3 points for hard questions
   * - 4 points for expert questions
   * @param difficulty The difficulty of the question
   * @returns one of the 4 possible values
   */
  private getQuestionScore = (
    difficulty: Question["difficulty"]
  ): 1 | 2 | 3 | 4 => {
    switch (difficulty) {
      case "expert":
        return 4
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

  /**
   * Sets the level of the user based on the experience points. This method contains a static experience table
   * up to level 100.
   * @param experiencePoints The amount of experience points accumulated by the user
   * @returns nothing
   */
  private setUserLevel = (experiencePoints: number) => {
    const experienceTable: Array<number> = [
      100, 220, 364, 536, 742, 989, 1285, 1640, 2066, 2577, 3139, 3757, 4436,
      5182, 6002, 6904, 7896, 8987, 10187, 11507, 12919, 14429, 16044, 17772,
      19620, 21597, 23712, 25975, 28396, 30986, 33705, 36559, 39555, 42700,
      46002, 49469, 53109, 56931, 60944, 65157, 69538, 74094, 78832, 83759,
      88883, 94211, 99752, 105514, 111506, 117737, 124154, 130763, 137570,
      144581, 151802, 159239, 166899, 174788, 182913, 191281, 199816, 208521,
      217400, 226456, 235693, 245114, 254723, 264524, 274521, 284717, 295014,
      305413, 315915, 326522, 337235, 348055, 358983, 370020, 381167, 392425,
      403795, 415278, 426875, 438587, 450416, 462363, 474429, 486615, 498922,
      511352, 523906, 536585, 549390, 562323, 575385, 588577, 601900, 615356,
      628946, 642671,
    ]

    let level = 1

    // Return the level of the user based on the experience points
    for (let i = 0; i < experienceTable.length; i++) {
      if (experiencePoints < experienceTable[i]) {
        break
      }
      level++
    }

    return level
  }
}
