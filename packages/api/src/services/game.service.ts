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
import { SECOND } from "./../utils/helperVariables.js"
import { User } from "./../entities/user.entity.js"
import { Item } from "./../entities/item.entity.js"
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

  /**
   * Gets the participation of a user in a game, which contains all the information about their progress in the game
   * (score, rank, streak, item charge, etc.). Is used when a user arrives in a game and needs to get their current state.
   *
   * @param userId The id of the user for which we want to get the participation
   * @param gameId The id of the game for which we want to get the participation
   * @returns A Participation object or null if the user is not participating in the game
   */
  getParticipation = async (
    userId: User["uuid"],
    gameId: Game["uuid"]
  ): Promise<Participation | null> => {
    const em = getEntityManager()

    console.log("Getting participation for user", userId, "in game", gameId)

    return em.findOne(
      Participation,
      {
        user: { uuid: userId } as User,
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
          "user",
          "game",
          "createdAt",
          "updatedAt",
        ],
      }
    )
  }

  /**
   * Starts the game.
   *
   * This method does a lot of things for the game overall:
   * - It updates the game with the start date
   * - It picks the questions for the game based on its settings (tags and difficulty)
   * - It creates all turns of the game with their corresponding question
   * - It emits a socket event to update the game in real time for all participants
   *
   * @param gameId The identifier of the game to start
   * @param userId The identifier of the user who starts the game (for security reasons, only the creator can start the game)
   * @returns
   */
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
        delay: 15 * SECOND,
        attempts: 3,
        removeOnComplete: true,
      }
    )
    return nextTurn
  }

  /**
   * Finishes the turn.
   *
   * When a turn finishes:
   * - The score of every participant is updated based on their answer (correct or not, speed, streak, etc.)
   * - Ranks are recalculated for every participant based on their new score
   * - TODO: Powerups must charged appropriately
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
    const questionDifficultyBonus = this.getDifficultyBonus(
      targetTurn.question.difficulty
    )

    participations.forEach((participation) => {
      // Update previous score
      participation.previousScore = participation.score
      let scoreReward = 0

      // Correct answer
      if (correctAnswersByParticipationId[participation.uuid]) {
        // Correct answer base reward
        scoreReward += 1

        // Difficulty bonus
        scoreReward += questionDifficultyBonus

        //  Speed bonus for the fastest correct answers
        if (correctAnswersByParticipationId[participation.uuid].rank < 3) {
          scoreReward += Math.max(
            3 - correctAnswersByParticipationId[participation.uuid].rank,
            0
          )
          targetTurn.speedRanking.push(participation.uuid)
        }

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

        // If the player has a boost status, the score reward is doubled
        if (participation.statuses.some((status) => status.name === "Boost")) {
          scoreReward *= 2
        }

        // Update score
        participation.score += scoreReward
      } else {
        // Incorrect answer score penalty
        scoreReward -= 1

        // If the player has a punishment status, they will lose an additional 2 points
        if (
          participation.statuses.some((status) => status.name === "Punishment")
        ) {
          scoreReward -= 2
        }

        // Reset streak
        participation.streak = 0

        if (incorrectAnswersByParticipationId[participation.uuid]) {
          participation.score = Math.max(participation.score + scoreReward, 0)
        }
      }

      // Increase item charge by 34 regardless of the answer, to a maximum of 100
      participation.itemCharge += 34

      em.persist(participation)
    })

    em.persist(targetTurn)

    const items = await em.findAll(Item)

    // Refresh ranks of all participants
    let currentRank = 0
    let topScore = 0
    let minScore = Infinity

    participations
      .sort((a, b) => b.score - a.score)
      .forEach((participation) => {
        if (participation.score < minScore) {
          minScore = participation.score
          currentRank += 1
        }

        // Update ranks
        participation.previousRank = participation.rank
        participation.rank = currentRank

        // Bonus item charge
        if (participation.rank === 1) {
          topScore = participation.score
        }

        participation.itemCharge += this.getBonusItemCharge(
          topScore - participation.score
        )

        if (participation.itemCharge >= 100) {
          // If the participant is holding an item, the charge caps to 50%
          if (participation.activeItem) {
            participation.itemCharge = 50
            return
          }

          // Grant item and remove 100 from the charge
          const grantedItemName = this.grantItemToParticipant(
            topScore - participation.score
          )
          const grantedItem = items.find(
            (item) => item.name === grantedItemName
          )
          if (grantedItem) {
            participation.activeItem = grantedItem.uuid
          }

          participation.itemCharge -= 100
        }

        // Remove 1 turn of duration to all statuses of the participant, removing those that are expired
        participation.statuses = participation.statuses
          .map((status) => ({ ...status, duration: status.duration - 1 }))
          .filter((status) => status.duration > 0)

        em.persist(participation)
      })

    await em.flush()

    // Emit updated participations to all participants in the room
    participations.forEach((participation) => {
      server.io
        .to(`game:${gameId}`)
        .emit("participation:updated", participation)
    })

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

    // Update sockets
    server.io.to(`game:${gameId}`).emit("turn:current", updatedTurn)

    // Job for the next turn in 15s
    gameQueue.add(
      {
        gameId,
        turnId: null,
        order: "next",
      },
      {
        delay: 15 * SECOND,
        attempts: 3,
        removeOnComplete: true,
      }
    )

    return updatedTurn
  }

  finishGame = async (gameId: string) => {
    const em = getEntityManager()

    const game = await em.findOne(Game, {
      uuid: gameId,
      startedAt: { $ne: null },
      finishedAt: null,
    })

    if (!game) {
      return null
    }

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
  private getDifficultyBonus = (
    difficulty: Question["difficulty"]
  ): 0 | 1 | 2 | 3 => {
    switch (difficulty) {
      case "expert":
        return 3
      case "hard":
        return 2
      case "medium":
        return 1
      case "easy":
      case "unknown":
      default:
        return 0
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

  /**
   * Grants a bonus to the item charge of a participant based on their distance to the top player.
   * The further they are, the bigger the bonus they get, to help them catch up and keep the game competitive.
   *
   * See the itemCharge property of the Participation entity for more details.
   *
   * @param pointsDifference The distance between the current participant and the top rank
   * @returns the bonus to apply to the item charge of the participant (between 0 and 60)
   */
  private getBonusItemCharge = (pointsDifference: number): number => {
    if (pointsDifference < 5) {
      return 0
    } else if (pointsDifference < 10) {
      return 5
    } else if (pointsDifference < 20) {
      return 15
    } else if (pointsDifference < 50) {
      return 25
    } else if (pointsDifference < 100) {
      return 40
    } else {
      return 60
    }
  }

  /**
   * Finds which item to grant to a participant based on their point distance to the top player.
   *
   * The probability distribution changes based on the distance, to give better items to players further behind.
   *
   * @param pointsDifference The distance between the current participant and the top rank
   * @returns the uuid of the item to grant to the participant
   */
  private grantItemToParticipant = (pointsDifference: number): string => {
    const probabilityDistribution =
      this.getProbabilityDistributionForItemGrant(pointsDifference)

    const randomValue = Math.random()

    const grantedItem = probabilityDistribution.find(
      (item) => randomValue >= item.min && randomValue <= item.max
    )

    return grantedItem ? grantedItem.name : "coin"
  }

  private getProbabilityDistributionForItemGrant = (
    pointsDifference: number
  ): Array<{
    name: string
    min: number
    max: number
  }> => {
    if (pointsDifference < 5) {
      return [
        { name: "Shield", min: 0, max: 0.25 }, // 25% chance to get a shield
        { name: "Coin", min: 0.26, max: 0.95 }, // 70% chance to get a coin
        { name: "Half", min: 0.96, max: 1.0 }, // 5% chance to get a half
      ]
    } else if (pointsDifference < 10) {
      return [
        { name: "Shield", min: 0, max: 0.15 }, // 15% chance to get a shield
        { name: "Turnaround", min: 0.16, max: 0.25 }, // 10% chance to get a turnaround
        { name: "Coin", min: 0.26, max: 0.55 }, // 30% chance to get a coin
        { name: "Scramble", min: 0.56, max: 0.6 }, // 5% chance to get a scramble
        { name: "Hurry", min: 0.61, max: 0.66 }, // 5% chance to get a hurry
        { name: "Punishment", min: 0.67, max: 0.7 }, // 5% chance to get a punishment
        { name: "Lock", min: 0.71, max: 0.8 }, // 10% chance to get a lock
        { name: "Passthrough", min: 0.81, max: 0.85 }, // 5% chance to get a passthrough
        { name: "Hidden", min: 0.86, max: 0.9 }, // 5% chance to get a hidden
        { name: "Half", min: 0.91, max: 0.95 }, // 5% chance to get a half
        { name: "Spy", min: 0.96, max: 1.0 }, // 5% chance to get a spy
      ]
    } else if (pointsDifference < 20) {
      return [
        { name: "Shield", min: 0, max: 0.05 }, // 5% shield
        { name: "Turnaround", min: 0.05, max: 0.15 }, // 10% turnaround
        { name: "Scramble", min: 0.15, max: 0.25 }, // 10% scramble
        { name: "Hurry", min: 0.25, max: 0.3 }, // 5% hurry
        { name: "Punishment", min: 0.3, max: 0.4 }, // 10% punishment
        { name: "Lock", min: 0.4, max: 0.5 }, // 10% lock
        { name: "Passthrough", min: 0.5, max: 0.7 }, // 20% passthrough
        { name: "Hidden", min: 0.7, max: 0.85 }, // 15% hidden
        { name: "Half", min: 0.85, max: 0.95 }, // 10% half
        { name: "Spy", min: 0.95, max: 1.0 }, // 5% spy
      ]
    } else if (pointsDifference < 50) {
      return [
        { name: "Scramble", min: 0, max: 0.15 }, // 15% scramble
        { name: "Boost", min: 0.15, max: 0.3 }, // 15% boost
        { name: "Hurry", min: 0.3, max: 0.5 }, // 20% hurry
        { name: "Punishment", min: 0.5, max: 0.65 }, // 15% punishment
        { name: "Lock", min: 0.65, max: 0.75 }, // 10% lock
        { name: "Passthrough", min: 0.75, max: 0.8 }, // 5% passthrough
        { name: "Hidden", min: 0.8, max: 0.9 }, // 10% hidden
        { name: "Spy", min: 0.9, max: 1.0 }, // 10% spy
      ]
    } else if (pointsDifference < 100) {
      return [
        { name: "Scramble", min: 0, max: 0.2 }, // 20% scramble
        { name: "Boost", min: 0.2, max: 0.35 }, // 15% boost
        { name: "Hurry", min: 0.35, max: 0.5 }, // 15% hurry
        { name: "Punishment", min: 0.5, max: 0.75 }, // 25% punishment
        { name: "Lock", min: 0.75, max: 0.95 }, // 20% lock
        { name: "Hidden", min: 0.95, max: 1.0 }, // 5% hidden
      ]
    } else {
      return [
        { name: "Scramble", min: 0, max: 0.2 }, // 20% scramble
        { name: "Boost", min: 0.2, max: 0.5 }, // 30% boost
        { name: "Hurry", min: 0.5, max: 0.65 }, // 15% hurry
        { name: "Punishment", min: 0.65, max: 0.95 }, // 30% punishment
        { name: "Lock", min: 0.95, max: 1.0 }, // 5% lock
      ]
    }
  }
}
