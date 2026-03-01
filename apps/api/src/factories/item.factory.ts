import { faker } from "@faker-js/faker/locale/fr"
import { Factory } from "@mikro-orm/seeder"
import { Item } from "./../entities/item.entity.js"

export class ItemFactory extends Factory<Item> {
  model = Item

  definition(): Partial<Item> {
    return {
      name: faker.lorem.word(),
      type: faker.helpers.arrayElement([
        "attack",
        "defense",
        "support",
      ]) as Item["type"],
    }
  }
}
