import { Question } from "./../entities/question.entity.js"
import {
  GetQuestionsSchema,
  QuestionResponseSchema,
} from "./../schemas/question.schema.js"
import { FastifyInstance } from "fastify"

const QuestionController = async (fastify: FastifyInstance) => {
  fastify.addSchema(QuestionResponseSchema)

  fastify.get(
    "/",
    {
      schema: GetQuestionsSchema,
    },
    async (request) => {
      const em = request.em

      const questions = await em.find(Question, {})

      return questions
    }
  )
}

export default QuestionController
