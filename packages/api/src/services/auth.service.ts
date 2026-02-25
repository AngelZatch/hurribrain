import { Loaded } from "@mikro-orm/core"
import { User } from "./../entities/user.entity.js"
import { getEntityManager } from "./../middlewares/entityManager.middleware.js"
import bcrypt from "bcrypt"

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
      throw new Error("Invalid credentials (password)")
    }

    return user
  }
}
