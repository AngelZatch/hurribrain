import { User } from "./../entities/user.entity.js"
import { FastifyInstance } from "fastify"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {
  AuthResponseSchema,
  LoginRequestBody,
  LoginRequestSchema,
  RegistrationRequestBody,
  RegistrationRequestSchema,
} from "./../schemas/auth.schema.js"
import { AuthErrorResponsesSchema } from "./../schemas/errors.schema.js"

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

      console.log(existingUser)

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
    }
  )
}

export default AuthController
