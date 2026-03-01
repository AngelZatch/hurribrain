import { Loaded } from "@mikro-orm/core"
import { User } from "./../entities/user.entity.js"
import { getEntityManager } from "./../middlewares/entityManager.middleware.js"
import bcrypt from "bcrypt"
import { Participation } from "./../entities/participation.entity.js"

export default class AuthService {
  checkCredentials = async (
    email: string,
    password: string
  ): Promise<
    Loaded<
      User,
      never,
      "email" | "uuid" | "name" | "role" | "password" | "deletedAt",
      never
    >
  > => {
    const em = getEntityManager()

    // Check if the user exists
    const user = await em.findOneOrFail(
      User,
      { email },
      {
        fields: ["uuid", "email", "name", "role", "password", "deletedAt"],
        filters: { notBanned: true },
        failHandler: () => {
          throw new Error("Invalid credentials")
        },
      }
    )

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      throw new Error("Invalid credentials")
    }

    return user
  }

  deletedFlaggedAccounts = async () => {
    const em = getEntityManager()

    const flaggedAccounts = (
      await em.find(User, {}, { filters: { notDeleted: false } })
    ).map((flaggedAccount) => flaggedAccount.uuid)

    if (flaggedAccounts.length === 0) {
      return
    }

    // Delete all participations, just in case (there should be none but you never know)
    await em.nativeDelete(Participation, { user: { $in: flaggedAccounts } })

    // Delete all accounts
    await em.nativeDelete(User, { uuid: { $in: flaggedAccounts } })
  }
}
