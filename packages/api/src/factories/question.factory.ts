import { faker } from "@faker-js/faker/locale/fr"
import { Factory } from "@mikro-orm/seeder"
import { Question } from "./../entities/question.entity.js"

export class QuestionFactory extends Factory<Question> {
  model = Question

  definition(): Partial<Question> {
    return {
      title: faker.lorem.sentence(),
    }
  }
}
