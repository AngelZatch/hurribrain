import Queue from "bull"
import GameService from "./game.service.js"
const gameQueue = new Queue("games")

class SyncService {
  public listen() {
    const gameService = new GameService()
    gameQueue.process(
      async (
        job: Queue.Job<{
          gameId: string
          turnId: string | null
          order: "finish" | "next"
        }>
      ) => {
        const { gameId, turnId, order } = job.data

        // Finish a turn
        if (!!turnId && order === "finish") {
          await gameService.finishCurrentTurn(gameId, turnId)
        }

        // Start the next turn
        if (order === "next") {
          await gameService.startNextTurn(gameId)
        }
      }
    )
  }
}

export default SyncService
