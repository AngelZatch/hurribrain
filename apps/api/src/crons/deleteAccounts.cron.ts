import AuthService from "./../services/auth.service.js"
import { CronJob } from "cron"

export const deleteAccountsCronJob = new CronJob(
  "0 */1 * * *", // Every hour
  async () => {
    console.log("RUNNING DELETE ACCOUNTS CRON JOB")
    const authService = new AuthService()
    await authService.deletedFlaggedAccounts()
    await authService.deletedUnverifiedAccounts()
  },
  null,
  false,
  "Europe/Paris"
)
