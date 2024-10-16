import { Question } from "./../entities/question.entity.js"
import {
  GetProgramsReply,
  GetQuestionsSchema,
  PostProgramBody,
  PostProgramReply,
  PostQuestionSchema,
  QuestionResponseSchema,
} from "./../schemas/question.schema.js"
import { FastifyInstance } from "fastify"

const QuestionController = async (fastify: FastifyInstance) => {
  fastify.addSchema(QuestionResponseSchema)

  fastify.get<{
    Reply: GetProgramsReply
  }>(
    "/",
    {
      schema: GetQuestionsSchema,
    },
    async (request, reply) => {
      const em = request.em

      const questions = await em.find(
        Question,
        {},
        { populate: ["tags", "choices"] }
      )

      return reply.code(200).send(questions)
    }
  )

  fastify.post<{
    Body: PostProgramBody
    Reply: PostProgramReply
  }>(
    "/",
    {
      schema: PostQuestionSchema,
    },
    async (request, reply) => {
      const em = request.em

      const { title, asset } = request.body

      const question = new Question({ title, asset })

      await em.persistAndFlush(question)

      const createdQuestion = await em.findOne(
        Question,
        {
          uuid: question.uuid,
        },
        { populate: ["tags", "choices"] }
      )

      return reply.code(201).send(createdQuestion)
    }
  )
}

export default QuestionController
