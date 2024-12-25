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

  const decoded = jwt.verify(token, "changeSecretIntoEnvVariable")
  if (!decoded) {
    reply.statusCode = 401
    throw new Error("Unauthorized")
  }
  console.log(decoded)

  request.user = "41bbd3c9-b4a4-45af-a473-1cfd0d15edde"
}
