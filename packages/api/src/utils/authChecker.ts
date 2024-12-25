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

  const decoded = jwt.verify(token, "changeSecretIntoEnvVariable") as {
    uuid: string
  }
  if (!decoded) {
    reply.statusCode = 401
    throw new Error("Unauthorized")
  }
  console.log(decoded)

  request.user = decoded["uuid"]
}
