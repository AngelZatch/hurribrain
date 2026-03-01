import { Asset } from "@src/entities/asset.entity.js"
import {
  AssetResponseSchema,
  GetAssetsReply,
} from "@src/schemas/asset.schema.js"
import { ErrorResponsesSchema } from "@src/schemas/errors.schema.js"
import { FastifyInstance } from "fastify"

const AssetController = async (fastify: FastifyInstance) => {
  fastify.addSchema(AssetResponseSchema)

  fastify.get<{
    Reply: GetAssetsReply[]
  }>(
    "/",
    {
      schema: {
        tags: ["Assets"],
        summary: "Returns the list of all available assets",
        params: {},
        response: {
          200: {
            type: "array",
            items: AssetResponseSchema,
          },
          ...ErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em

      const assets = await em.find(Asset, {}, { filters: { notDeleted: true } })

      return reply.code(200).send(assets)
    }
  )
}

export default AssetController
