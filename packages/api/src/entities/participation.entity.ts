import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
  type Rel,
} from "@mikro-orm/core"
import { v4 } from "uuid"
import { User } from "./user.entity.js"
import { Game } from "./game.entity.js"

@Entity()
@Unique({ properties: ["user", "game"] })
export class Participation {
  @PrimaryKey()
  uuid: string = v4()

  /**
   * The score determines who's winning the game.
   * Every correct answer increases the score by 1.
   *
   * Various bonuses can be applied to further increase the score each turn:
   * - A difficulty bonus is applied depending on the difficulty of the question: +1 for medium, +2 for hard, +3 for expert.
   * - A streak bonus is applied every 5 consecutive correct answers: +1 for every 5 correct answers.
   */
  @Property()
  score = 0

  @Property()
  previousScore = 0

  /**
   * The rank is the position of the participant in the game.
   */
  @Property()
  rank = 0

  @Property()
  previousRank = 0

  /**
   * The streak is the number of consecutive answers the participant has answered correctly.
   *
   * It's increased by one for every correct answer and reset to zero when the participant answers incorrectly.
   * Every 5 consecutive correct answers, the participant's score receives a bonus.
   */
  @Property()
  streak = 0

  /**
   * The maximum streak is the highest streak the participant has achieved during the game.
   *
   * It's kept as a statistic to show the participant's best performance.
   */
  @Property()
  maxStreak = 0

  @ManyToOne({ entity: () => User })
  user: Rel<User>

  @ManyToOne({ entity: () => Game })
  game: Rel<Game>

  // Timestamps
  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  constructor(body: Pick<Participation, "user" | "game">) {
    this.user = body.user
    this.game = body.game
  }
}
