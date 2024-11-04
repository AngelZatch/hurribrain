import { ErrorResponsesSchema } from "./../schemas/errors.schema.js"
import { Tag } from "./../entities/tag.entity.js"
import {
  CreateTagSchema,
  GetTagParams,
  GetTagReply,
  GetTagsReply,
  PostTagBody,
  PostTagReply,
  PutTagBody,
  PutTagReply,
  TagParamsSchema,
  TagResponseSchema,
} from "./../schemas/tag.schema.js"
import fastify from "fastify"

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
    },
    async (request, reply) => {
      const em = request.em

      const tag = await em.findOneOrFail(Tag, { uuid: request.params.uuid })

      return reply.code(200).send(tag)
    }
  )

  fastify.post<{
    Body: PostTagBody
    Reply: PostTagReply
  }>(
    "/",
    {
      schema: {
        tags: ["Tags"],
        summary: "Creates a new tag",
        body: CreateTagSchema,
        response: {
          201: TagResponseSchema,
          ...ErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em

      const tag = new Tag({
        name: request.body.name,
      })

      await em.persistAndFlush(tag)

      return reply.code(201).send(tag)
    }
  )

  fastify.put<{
    Params: GetTagParams
    Body: PutTagBody
    Reply: PutTagReply
  }>(
    "/:uuid",
    {
      schema: {
        tags: ["Tags"],
        summary: "Updates a tag by its UUID",
        params: TagParamsSchema,
        body: CreateTagSchema,
        response: {
          200: TagResponseSchema,
          ...ErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em

      const tag = await em.findOneOrFail(Tag, { uuid: request.params.uuid })

      tag.name = request.body.name ?? tag.name
      tag.description = request.body.description ?? tag.description

      await em.persistAndFlush(tag)

      return reply.code(200).send(tag)
    }
  )
}

export default TagController
