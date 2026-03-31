import AuthService from "./../services/auth.service.js"
import { CronJob } from "cron"

export const deleteAccountsCronJob = new CronJob(
  "0 0 * * *", // Every day at midnight
  async () => {
    console.log("RUNNING DELETE ACCOUNTS CRON JOB")
    const authService = new AuthService()
    await authService.deletedFlaggedAccounts()
  },
  null,
  false,
  "Europe/Paris"
)
