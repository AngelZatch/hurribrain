import { Factory } from "@mikro-orm/seeder"
import { faker } from "@faker-js/faker/locale/fr"
import { Tag } from "./../entities/tag.entity.js"

export class TagFactory extends Factory<Tag> {
  model = Tag

  definition(): Partial<Tag> {
    return {
      name: faker.lorem.word(),
    }
  }
}
