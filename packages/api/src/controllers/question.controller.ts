import { Asset } from "./../entities/asset.entity.js"
import { Question } from "./../entities/question.entity.js"
import {
  PostQuestionBody,
  CreateQuestionSchema,
  QuestionParams,
  QuestionParamsSchema,
  QuestionResponseSchema,
  GetQuestionsReplySchema,
} from "./../schemas/question.schema.js"
import { FastifyInstance } from "fastify"
import { ErrorResponsesSchema } from "./../schemas/errors.schema.js"
import { Choice } from "./../entities/choice.entity.js"
import { wrap } from "@mikro-orm/core"
import { Tag } from "./../entities/tag.entity.js"

const QuestionController = async (fastify: FastifyInstance) => {
  fastify.addSchema(QuestionResponseSchema)

  fastify.get(
    "/",
    {
      schema: {
        tags: ["Questions"],
        summary: "Returns the list of all available questions",
        response: {
          200: GetQuestionsReplySchema,
          ...ErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em

      const questions = await em.findAll(Question, {
        populate: [
          "choices",
          "tags",
          "successRate",
          "correctAnswers",
          "incorrectAnswers",
        ],
        filters: { notDeleted: true },
        refresh: true,
      })

      return reply.code(200).send({
        data: questions,
        nextCursor: 50,
      })
    }
  )

  fastify.get<{
    Params: QuestionParams
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
          populate: ["choices", "tags"],
          filters: { notDeleted: true },
          refresh: true,
        }
      )

      return reply.code(200).send(question)
    }
  )

  fastify.post<{
    Body: PostQuestionBody
  }>(
    "/",
    {
      schema: {
        tags: ["Questions"],
        summary: "Creates a new question",
        body: CreateQuestionSchema,
        response: {
          201: QuestionResponseSchema,
          ...ErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em

      const { title, asset, choices, tags } = request.body

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

      // Add the tags
      const matchingTags = await em.find(
        Tag,
        { uuid: { $in: tags.map((tag) => tag.uuid) } },
        { fields: ["uuid"] }
      )
      wrap(question).assign({ tags: matchingTags })

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

  // TODO: If the question is being used in an ongoing game, it should not be editable
  fastify.put<{
    Params: QuestionParams
    Body: PostQuestionBody
  }>(
    "/:questionId",
    {
      schema: {
        tags: ["Questions"],
        summary: "Creates a new question",
        params: QuestionParamsSchema,
        body: CreateQuestionSchema,
        response: {
          200: QuestionResponseSchema,
          ...ErrorResponsesSchema,
        },
      },
    },
    async (request, reply) => {
      const em = request.em

      const { title, choices, tags } = request.body

      const question = await em.findOneOrFail(Question, {
        uuid: request.params.questionId,
      })

      question.title = title

      // Updating a question resets its success rate and removes the choices
      question.correctAnswers = 0
      question.incorrectAnswers = 0
      question.choices.removeAll()
      question.tags.removeAll()

      // Add the new choices
      const questionChoices = choices.map((choice) => {
        return new Choice({
          value: choice.value,
          isCorrect: choice.isCorrect,
        })
      })

      question.choices.add(questionChoices)

      // Add the tags
      const matchingTags = await em.find(
        Tag,
        { uuid: { $in: tags.map((tag) => tag.uuid) } },
        { fields: ["uuid"] }
      )
      wrap(question).assign({ tags: matchingTags })

      await em.persistAndFlush(question)

      return reply.code(200).send(question)
    }
  )
}

export default QuestionController
