import { ErrorResponsesSchema } from "@src/schemas/errors.schema.js"
import { Tag } from "./../entities/tag.entity.js"
import { GetTagsReply, TagResponseSchema } from "./../schemas/tag.schema.js"
import fastify from "fastify"

const TagController = async (fastify: fastify.FastifyInstance) => {
  fastify.addSchema(TagResponseSchema)

  fastify.get<{
    Reply: GetTagsReply[]
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
    },
    async (request, reply) => {
      const em = request.em

      const tags = await em.find(Tag, {})

      return reply.code(200).send(tags)
    }
  )
}

export default TagController
