import { EntityManager } from "@mikro-orm/mysql"
import { Seeder } from "@mikro-orm/seeder"
import { TagFactory } from "./../factories/tag.factory.js"

export class QuestionSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Seed questions here

    const tags = [
      "video games",
      "80s",
      "science",
      "history",
      "movies",
      "music",
      "sports",
      "literature",
      "geography",
      "technology",
    ]

    for (const tag of tags) {
      await new TagFactory(em).createOne({ name: tag })
    }
  }
}
