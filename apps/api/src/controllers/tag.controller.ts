import { ErrorResponsesSchema } from "./../schemas/errors.schema.js"
import { Tag } from "./../entities/tag.entity.js"
import {
  GetTagParams,
  GetTagReply,
  GetTagsReply,
  TagParamsSchema,
  TagResponseSchema,
} from "./../schemas/tag.schema.js"
import fastify from "fastify"
import { verifyJWT } from "./../utils/authChecker.js"

const TagController = async (fastify: fastify.FastifyInstance) => {
  fastify.addSchema(TagResponseSchema)

  fastify.get<{
    Reply: GetTagsReply
  }>(
    "/",
    {
      schema: {
        tags: ["Tags"],
        summary: "Returns the list of all available tags",
        params: {},
        response: {
          200: {
            type: "array",
            items: TagResponseSchema,
          },
          ...ErrorResponsesSchema,
        },
      },
      preHandler: [fastify.auth([verifyJWT])],
    },
    async (request, reply) => {
      const em = request.em

      const tags = await em.find(
        Tag,
        {},
        {
          orderBy: { updatedAt: "DESC" },
        }
      )

      return reply.code(200).send(tags)
    }
  )

  fastify.get<{
    Params: GetTagParams
    Reply: GetTagReply
  }>(
    "/:uuid",
    {
      schema: {
        tags: ["Tags"],
        summary: "Returns a tag by its UUID",
        params: TagParamsSchema,
        response: {
          200: TagResponseSchema,
          ...ErrorResponsesSchema,
        },
      },
      preHandler: [fastify.auth([verifyJWT])],
    },
    async (request, reply) => {
      const em = request.em

      const tag = await em.findOneOrFail(Tag, { uuid: request.params.uuid })

      return reply.code(200).send(tag)
    }
  )
}

export default TagController
