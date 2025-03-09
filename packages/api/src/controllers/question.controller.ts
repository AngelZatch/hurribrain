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
import { pipeline } from "stream/promises"
import csv from "csv-parser"
import QuestionService from "./../services/question.service.js"

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
      const questionService = new QuestionService()

      const createdQuestion = await questionService.createQuestions([
        request.body,
      ])

      return reply.code(201).send(createdQuestion[0])
    }
  )

  fastify.post(
    "/import",
    {
      schema: {
        tags: ["Questions"],
        summary: "Imports questions from a CSV file",
      },
    },
    async (request, reply) => {
      const em = request.em
      const data = await request.file()

      if (!data) {
        return reply.code(400).send({ message: "No file uploaded" })
      }

      const questionsToCreate: PostQuestionBody[] = []
      const questionService = new QuestionService()

      const availableTags = await em.findAll(Tag, {
        fields: ["uuid", "name"],
        filters: { notDeleted: true },
      })

      await pipeline(
        data.file,
        csv({
          separator: ";",
        }),
        async (
          source: AsyncIterable<{
            title: string
            choices: string
            tags: string
          }>
        ) => {
          for await (const chunk of source) {
            // Split choices
            const choices = chunk.choices.split(",")

            // Split tags and find the existing ones
            const questionTags = chunk.tags.split(",")
            const matchingTags = availableTags.filter((tag) =>
              questionTags.find(
                (questionTag) =>
                  tag.name.toLocaleLowerCase() ===
                  questionTag.toLocaleLowerCase()
              )
            )

            questionsToCreate.push({
              title: chunk.title,
              choices: [
                { value: choices[0], isCorrect: true },
                { value: choices[1], isCorrect: false },
                { value: choices[2], isCorrect: false },
                { value: choices[3], isCorrect: false },
              ],
              tags: matchingTags,
            })
          }
        }
      )

      await questionService.createQuestions(questionsToCreate)

      return reply.code(201).send({ message: "Questions created." })
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
