import Fastify, { FastifyRequest } from "fastify"
import fastifyCors from "@fastify/cors"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import QuestionController from "./controllers/question.controller.js"
import { ErrorResponseTemplateSchema } from "./schemas/errors.schema.js"
import TagController from "./controllers/tag.controller.js"
import { getEntityManager } from "./middlewares/entityManager.middleware.js"

export const server = Fastify()

export const initializeServer = async () => {
  await server.register(fastifySwagger, {
    mode: "dynamic",
    openapi: {
      openapi: "3.1.0",
      info: {
        title: "Hurribrain API",
        version: "1.0.0",
        description: "Hurribrain API",
      },
      tags: [
        {
          name: "Questions",
          description: "Questions API",
        },
      ],
    },
  })

  await server.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  })

  await server.register(fastifyCors, {
    credentials: true,
    origin: true,
  })

  await server.register(async (instance) => {
    instance.addSchema(ErrorResponseTemplateSchema)
    instance.decorateRequest("em", null)

    instance.addHook("preHandler", async (request: FastifyRequest) => {
      request.em = getEntityManager()
    })

    await instance.register(QuestionController, { prefix: "/questions" })
    await instance.register(TagController, { prefix: "/tags" })
  })

  await server.ready()
}
