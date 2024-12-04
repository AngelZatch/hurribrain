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

  fastify.post<{
    Body: {
      email: string
      password: string
      name: string
    }
  }>("/register", async (request, reply) => {
    const em = request.em
    const { email, password, name } = request.body

    // Check for unicity of email and name
    const existingUser = await em.findOne(User, {
      $or: [{ email }, { name }],
    })

    if (existingUser) {
      reply.statusCode = 409
      return new Error("User already exists")
    }

    const user = new User({ email, name })
    user.password = await bcrypt.hash(password, 10)

    await em.persistAndFlush(user)

    reply.statusCode = 201

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
