import GameService from "@src/services/game.service.js"
import { CronJob } from "cron"

const job = new CronJob(
  "*/30 * * * *", // Every 30 minutes
  async () => {
    const gameService = new GameService()
    await gameService.deleteFinishedGames()
  },
  null,
  true,
  "Europe/Paris"
)

job.start()
