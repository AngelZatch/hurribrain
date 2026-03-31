import GameService from "./../services/game.service.js"
import { CronJob } from "cron"

export const deleteFinishedGamesCronJob = new CronJob(
  "*/30 * * * *", // Every 30 minutes
  async () => {
    console.log("RUNNING DELETE FINISHED GAMES CRON JOB")
    const gameService = new GameService()
    await gameService.deleteFinishedGames()
  },
  null,
  false,
  "Europe/Paris"
)
