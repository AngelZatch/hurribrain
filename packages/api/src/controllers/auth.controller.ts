import { User } from "./../entities/user.entity.js"
import { FastifyInstance } from "fastify"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {
  AuthCheckResponseSchema,
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
import AuthService from "./../services/auth.service.js"

const authService = new AuthService()

const AuthController = async (fastify: FastifyInstance) => {
  fastify.post<{
    Body: LoginRequestBody
  }>(
    "/check",
    {
      schema: {
        tags: ["Authentication"],
        summary: "Checks if the account can authenticate",
        body: LoginRequestSchema,
        response: {
          200: AuthCheckResponseSchema,
          ...AuthErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      try {
        const user = await authService.checkCredentials(email, password)

        if (user.deletedAt) {
          return reply.status(200).send(1)
        }

        return reply.status(200).send(0)
      } catch (error) {
        console.error(error)
        reply.statusCode = 401
        return new Error("Invalid credentials")
      }
    }
  )

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
      const { email, password } = request.body

      try {
        const user = await authService.checkCredentials(email, password)

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
      } catch (error) {
        console.error(error)
        reply.statusCode = 401
        return new Error("Invalid credentials")
      }
    }
  )

  fastify.post<{
    Body: LoginRequestBody
  }>(
    "/recover",
    {
      schema: {
        tags: ["Authentication", "User"],
        summary: "Recovers an account from deletion flag",
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

      try {
        const user = await em.findOneOrFail(
          User,
          {
            email,
          },
          {
            fields: ["uuid", "email", "name", "role", "password", "deletedAt"],
            filters: { notDeleted: false },
            failHandler: () => {
              reply.statusCode = 401
              return new Error("Invalid credentials")
            },
          }
        )

        user.deletedAt = undefined
        em.persist(user)

        await em.flush()

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
          throw new Error("Invalid credentials")
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
      } catch (error) {
        console.error(error)
        reply.statusCode = 401
        return new Error("Invalid credentials")
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
    async (request, reply) => {
      const em = request.em
      const user = await em.findOneOrFail(
        User,
        { uuid: request.user },
        {
          filters: { notDeleted: true },
          failHandler: () => {
            reply.statusCode = 401
            return new Error("Invalid Credentials")
          },
        }
      )

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

      const user = await em.findOneOrFail(
        User,
        { uuid: request.user },
        {
          filters: { notDeleted: true },
          failHandler: () => {
            reply.statusCode = 401
            return new Error("Invalid Credentials")
          },
        }
      )

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

  fastify.post<{
    Body: LoginRequestBody
  }>(
    "/delete",
    {
      preHandler: [fastify.auth([verifyJWT])],
      schema: {
        tags: ["User", "Authentication"],
        summary: "Allows a user to flag their account for deletion",
        body: LoginRequestSchema,
        response: {
          200: true,
          ...AuthErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em
      const { email, password } = request.body
      try {
        const user = await authService.checkCredentials(email, password)

        // If they do, flag them for deletion by setting their deletedAt Date 24 hours into the future
        user.deletedAt = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        em.persist(user)

        await em.flush()

        return reply.status(200).send(true)
      } catch (error) {
        console.error(error)
        reply.statusCode = 401
        return new Error("Invalid credentials")
      }
    }
  )
}
export default AuthController
