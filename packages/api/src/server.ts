import Fastify, {
  FastifyBaseLogger,
  FastifyPluginCallback,
  FastifyRequest,
  FastifyTypeProvider,
  RawServerDefault,
} from "fastify"
import fastifyCors from "@fastify/cors"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import QuestionController from "./controllers/question.controller.js"
import { ErrorResponseTemplateSchema } from "./schemas/errors.schema.js"
import TagController from "./controllers/tag.controller.js"
import { getEntityManager } from "./middlewares/entityManager.middleware.js"
import AuthController from "./controllers/auth.controller.js"
import fastifyAuth from "@fastify/auth"
import GameController from "./controllers/game.controller.js"
import fastifySocketIo from "fastify-socket.io"
import { Socket } from "socket.io"
import GameService from "./services/game.service.js"
import { fastifyMultipart } from "@fastify/multipart"
import { MEGABYTE } from "./utils/helperVariables.js"
import fastifyRedis from "@fastify/redis"

export const server = Fastify()

export const initializeServer = async () => {
  // Docs
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

  // Cors
  await server.register(fastifyCors, {
    credentials: true,
    origin: true,
  })

  // Multipart
  await server.register(fastifyMultipart, {
    limits: {
      files: 1,
      fileSize: 2 * MEGABYTE,
    },
  })

  // Websockets
  // Fastify Socket IO does not support Fastify v5 yet
  await server.register(
    fastifySocketIo as unknown as FastifyPluginCallback<
      object,
      RawServerDefault,
      FastifyTypeProvider,
      FastifyBaseLogger
    >,
    {}
  )

  // Redis
  await server.register(fastifyRedis, {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  })

  // Authentication
  await server.register(fastifyAuth)

  // Routes
  await server.register(async (instance) => {
    instance.addSchema(ErrorResponseTemplateSchema)
    instance.decorateRequest("em")
    instance.decorateRequest("user")

    instance.addHook("preHandler", async (request: FastifyRequest) => {
      request.em = getEntityManager()
    })

    await instance.register(AuthController, { prefix: "/auth" })
    await instance.register(QuestionController, { prefix: "/questions" })
    await instance.register(TagController, { prefix: "/tags" })
    await instance.register(GameController, { prefix: "/games" })
  })

  server.ready((err) => {
    if (err) throw err

    const gameService = new GameService()

    // Start the sync service
    server.io.on("connect", (socket: Socket) => {
      socket.on(
        "game:join",
        async ({ game, user }: { game: string; user: string }) => {
          // Confirm that there is a participation before joining
          await socket.join(`game:${game}`)
          socket.emit("game:joined")

          // Get the participation and emit it to the user
          const participation = await gameService.getParticipation(user, game)
          socket.emit("participation:updated", participation)
        }
      )

      socket.on("sync:request", async (gameId: string) => {
        // Send the current game state
        const currentTurn = await gameService.syncGame(gameId)
        socket.emit("turn:current", currentTurn)
      })

      socket.on(
        "item:use",
        async ({ game, user }: { game: string; user: string }) => {
          await gameService.useItem(user, game)
        }
      )
    })
  })
}
