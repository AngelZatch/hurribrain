import { Asset } from "./../entities/asset.entity.js"
import { Question } from "./../entities/question.entity.js"
import {
  GetQuestionReply,
  GetQuestionsReply,
  GetQuestionsReplySchema,
  PostQuestionBody,
  CreateQuestionSchema,
  PostQuestionReply,
  QuestionParams,
  QuestionParamsSchema,
  QuestionResponseSchema,
} from "./../schemas/question.schema.js"
import { FastifyInstance } from "fastify"
import { ErrorResponsesSchema } from "./../schemas/errors.schema.js"
import { Choice } from "./../entities/choice.entity.js"

const QuestionController = async (fastify: FastifyInstance) => {
  fastify.addSchema(QuestionResponseSchema)

  fastify.get<{
    Reply: GetQuestionsReply
  }>(
    "/",
    {
      schema: {
        tags: ["Questions"],
        summary: "Returns the list of all available questions",
        params: {},
        response: {
          200: GetQuestionsReplySchema,
          ...ErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em

      const questions = await em.find(
        Question,
        {},
        {
          populate: ["tags", "choices"],
          filters: { notDeleted: true },
        }
      )

      return reply.code(200).send({
        data: questions,
        nextCursor: 50,
      })
    }
  )

  fastify.get<{
    Params: QuestionParams
    Reply: GetQuestionReply
  }>(
    "/:questionId",
    {
      schema: {
        tags: ["Questions"],
        summary: "Returns a question by id",
        params: QuestionParamsSchema,
        response: {
          200: QuestionResponseSchema,
          ...ErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em

      const question = await em.findOneOrFail(
        Question,
        {
          uuid: request.params.questionId,
        },
        {
          populate: ["*"],
          populateWhere: { tags: { deletedAt: null } },
        }
      )

      return reply.code(200).send(question)
    }
  )

  fastify.post<{
    Body: PostQuestionBody
    Reply: PostQuestionReply
  }>(
    "/",
    {
      schema: {
        tags: ["Questions"],
        summary: "Creates a new question",
        params: {},
        body: CreateQuestionSchema,
        response: {
          201: QuestionResponseSchema,
          ...ErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em

      const { title, asset, choices } = request.body

      let targetAsset = null
      if (asset) {
        targetAsset = await em.findOneOrFail(
          Asset,
          { uuid: asset },
          {
            failHandler: () => {
              throw new Error("Asset not found")
            },
          }
        )
      }

      // Create the question
      const question = new Question({ title, asset: targetAsset })

      em.persist(question)

      // Add the choices
      const questionChoices = choices.map((choice) => {
        return new Choice({
          value: choice.value,
          isCorrect: choice.isCorrect,
        })
      })

      question.choices.add(questionChoices)

      await em.persistAndFlush(question)

      const createdQuestion = await em.findOneOrFail(
        Question,
        {
          uuid: question.uuid,
        },
        {
          populate: ["tags", "choices"],
          populateWhere: { tags: { deletedAt: null } },
        }
      )

      return reply.code(201).send(createdQuestion)
    }
  )
}

export default QuestionController
