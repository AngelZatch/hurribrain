import { User, UserRole } from "./../entities/user.entity.js"
import { FastifyRequest, FastifyReply } from "fastify"
import jwt from "jsonwebtoken"

export const verifyJWT = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.headers.authorization) {
    reply.statusCode = 401
    throw new Error("Unauthorized")
  }

  // Get the token from Bearer
  const token = request.headers.authorization.split(" ")[1]

  const decoded = jwt.verify(
    token,
    process.env.JWTSALT ?? "changeSecretIntoEnvVariable"
  ) as {
    uuid: string
  }
  if (!decoded) {
    reply.statusCode = 401
    throw new Error("Unauthorized")
  }

  request.user = decoded["uuid"]
}

export const verifyJWTIfExists = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (request.headers.authorization) {
    return verifyJWT(request, reply)
  }

  request.user = ""
}

/**
 * LITE Users are "temporary" accounts created by giving a name only, for the purpose of quickly
 * joining a game (and lowering the access barrier to the app). They have very restricted capabilities:
 * - They cannot create a game
 * - They cannot edit their profile
 */
export const excludeLiteUsers = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const em = request.em

  await em.findOneOrFail(
    User,
    { role: { $ne: UserRole.LITE }, uuid: request.user },
    {
      failHandler: () => {
        reply.statusCode = 403
        throw new Error("Forbidden")
      },
    }
  )

  return true
}
