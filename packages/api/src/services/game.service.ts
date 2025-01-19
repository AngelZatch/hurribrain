import { Turn } from "./../entities/turn.entity.js"
import { getEntityManager } from "./../middlewares/entityManager.middleware.js"

export default class GameService {
  startGame = async (gameId: string) => {
    console.log(gameId)
  }

  syncGame = async (gameId: string) => {
    const em = getEntityManager()

    const currentTurn = await em.findOne(Turn, {
      game: gameId,
      startedAt: { $ne: null },
      finishedAt: null,
    })

    return currentTurn
  }

  nextTurn = async (gameId: string) => {
    const em = getEntityManager()

    const currentTurn = await em.findOne(
      Turn,
      {
        game: gameId,
        startedAt: { $ne: null },
        finishedAt: null,
      },
      {
        orderBy: { position: "ASC" },
      }
    )

    if (!currentTurn) {
      return null
    }

    currentTurn.finishedAt = new Date()
    await em.persistAndFlush(currentTurn)

    const nextTurn = await em.findOne(Turn, {
      game: gameId,
      position: currentTurn.position + 1,
    })

    return nextTurn
  }
}
