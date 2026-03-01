import { wrap } from "@mikro-orm/core"

import { Asset } from "./../entities/asset.entity.js"
import { Choice } from "./../entities/choice.entity.js"
import { Question } from "./../entities/question.entity.js"
import { Tag } from "./../entities/tag.entity.js"
import { getEntityManager } from "./../middlewares/entityManager.middleware.js"
import { PostQuestionBody } from "./../schemas/question.schema.js"

export default class QuestionService {
  createQuestions = async (data: PostQuestionBody[]) => {
    const em = getEntityManager()

    const questionUUIDs = []

    for await (const item of data) {
      const { title, asset, choices, tags } = item

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

      questionUUIDs.push(question.uuid)
    }

    await em.flush()

    return await em.find(
      Question,
      {
        uuid: { $in: questionUUIDs },
      },
      {
        populate: ["choices", "tags"],
        populateWhere: { tags: { deletedAt: null } },
      }
    )
  }
}
