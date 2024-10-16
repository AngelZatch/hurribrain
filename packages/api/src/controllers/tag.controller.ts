import { Tag } from "./../entities/tag.entity.js"
import {
  GetTagsReply,
  getTagsSchema,
  TagResponseSchema,
} from "./../schemas/tag.schema.js"
import fastify from "fastify"

const TagController = async (fastify: fastify.FastifyInstance) => {
  fastify.addSchema(TagResponseSchema)

  fastify.get<{
    Reply: GetTagsReply[]
  }>(
    "/",
    {
      schema: getTagsSchema,
    },
    async (request, reply) => {
      const em = request.em

      const tags = await em.find(Tag, {})

      return reply.code(200).send(tags)
    }
  )
}

export default TagController
