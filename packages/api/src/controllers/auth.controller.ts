import { User } from "./../entities/user.entity.js"
import { FastifyInstance } from "fastify"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {
  AuthErrorResponsesSchema,
  AuthResponseSchema,
  LoginRequestBody,
  LoginRequestSchema,
  RegistrationRequestBody,
  RegistrationRequestSchema,
} from "./../schemas/auth.schema.js"
import { verifyJWT } from "../utils/authChecker.js"
import { UserStats } from "../entities/userStats.entity.js"
import { Participation } from "../entities/participation.entity.js"
import { GetParticipationReplySchema } from "../schemas/player.schema.js"

const AuthController = async (fastify: FastifyInstance) => {
  fastify.post<{
    Body: LoginRequestBody
  }>(
    "/login",
    {
      schema: {
        tags: ["Authentication"],
        summary: "Login with email and password",
        body: LoginRequestSchema,
        response: {
          200: AuthResponseSchema,
          ...AuthErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
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
        return new Error("Invalid credentials (password)")
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
    }
  )

  fastify.post<{
    Body: RegistrationRequestBody
  }>(
    "/register",
    {
      schema: {
        tags: ["Authentication"],
        summary: "Register with email, password and name",
        body: RegistrationRequestSchema,
        response: {
          201: AuthResponseSchema,
          ...AuthErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
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

      em.persist(user)

      const stats = new UserStats(user)
      console.log(stats)

      em.persist(new UserStats(user))

      await em.flush()

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
    }
  )

  fastify.get(
    "/me",
    {
      preHandler: [fastify.auth([verifyJWT])],
      schema: {
        tags: ["Authentication"],
        summary: "Get active session user details",
      },
    },
    async (request) => {
      const em = request.em
      const user = await em.findOneOrFail(User, { uuid: request.user })

      const userStats = await em.findOneOrFail(UserStats, { user })

      return {
        ...user,
        stats: userStats,
      }
    }
  )

  fastify.get(
    "/my-participation",
    {
      preHandler: [fastify.auth([verifyJWT])],
      schema: {
        tags: ["User", "Participations"],
        summary:
          "Check if the user has a current participation to quickly resume",
        response: {
          200: GetParticipationReplySchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em

      const user = await em.findOneOrFail(User, { uuid: request.user })

      const activeParticipation = await em.findOne(
        Participation,
        {
          user: user,
          game: { finishedAt: null },
        },
        {
          fields: [
            "score",
            "previousScore",
            "rank",
            "previousRank",
            "streak",
            "maxStreak",
            "itemCharge",
            "activeItem",
            "statuses",
            "user.uuid",
            "user.email",
            "user.name",
            "game.uuid",
          ],
        }
      )

      if (!activeParticipation) {
        reply.statusCode = 204
        return null
      }

      return activeParticipation
    }
  )
}
export default AuthController
