import { User } from "@src/entities/user.entity.js"
import { FastifyInstance } from "fastify"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const AuthController = async (fastify: FastifyInstance) => {
  fastify.post<{
    Body: {
      email: string
      password: string
    }
  }>("/login", async (request, reply) => {
    const em = request.em
    const { email, password } = request.body

    const user = await em.findOneOrFail(
      User,
      { email },
      {
        fields: ["uuid", "email", "name", "role", "password"],
        filters: { notDeleted: true, notBanned: true },
        failHandler: () => {
          reply.statusCode = 401
          return new Error("Invalid credentials")
        },
      }
    )

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      reply.statusCode = 401
      return new Error("Invalid credentials")
    }

    const accessToken = jwt.sign(
      {
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      "changeSecretIntoEnvVariable",
      {
        expiresIn: "7d",
      }
    )

    return {
      accessToken,
      refreshToken: "",
    }
  })
}

export default AuthController
