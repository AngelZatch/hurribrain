import { Factory } from "@mikro-orm/seeder"
import { Game } from "@src/entities/game.entity.js"

export class GameFactory extends Factory<Game> {
  model = Game

  definition(): Partial<Game> {
    return {
      isPrivate: false,
    }
  }
}
