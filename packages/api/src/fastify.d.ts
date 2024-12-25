import { EntityManager } from "@mikro-orm/mysql"

declare module "fastify" {
  interface FastifyRequest {
    em: EntityManager
    user: string
    getBaseUrl: () => URL
  }
}
