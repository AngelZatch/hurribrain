import { EntityManager } from "@mikro-orm/mysql"
import { Seeder } from "@mikro-orm/seeder"
import { QuestionSeeder } from "./question.seeder.js"
import { ItemSeeder } from "./item.seeder.js"

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [QuestionSeeder, ItemSeeder])
  }
}
