import AuthService from "./../services/auth.service.js"
import { CronJob } from "cron"

const job = new CronJob(
  "0 0 * * *", // Every day at midnight
  async () => {
    const authService = new AuthService()
    await authService.deletedFlaggedAccounts()
  },
  null,
  true,
  "Europe/Paris"
)

job.start()
