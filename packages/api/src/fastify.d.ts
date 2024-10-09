import { EntityManager } from "@mikro-orm/mysql";

declare module "fastify" {
  interface FastifyRequest {
    em: EntityManager;
    getBaseUrl: () => URL;
  }
}
