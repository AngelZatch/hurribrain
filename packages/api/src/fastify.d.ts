import { EntityManager } from "@mikro-orm/mysql"
import { Socket } from "socket.io"

declare module "fastify" {
  interface FastifyInstance {
    io: Socket
  }
  interface FastifyRequest {
    em: EntityManager
    user: string
    getBaseUrl: () => URL
  }
}
