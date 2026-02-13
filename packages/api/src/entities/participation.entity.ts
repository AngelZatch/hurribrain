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
import { Item } from "./item.entity.js"

@Entity()
@Unique({ properties: ["user", "game"] })
export class Participation {
  @PrimaryKey()
  uuid: string = v4()

  // SCORE
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

  // RANK
  /**
   * The rank is the position of the participant in the game.
   */
  @Property()
  rank = 0

  @Property()
  previousRank = 0

  // STREAK
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

  // ITEMS AND STATUSES
  /**
   * The item charge represents the state of the participant's power up.
   * When it reaches 100, an item is granted to the participant, and the charge resets to 0.
   *
   * Every turn, the charge increases by a base amount of 33 (meaning that a player will get an item every 3 turns on
   * average, or 6 items for a standard 20-turn game). Additionnaly, depending on the distance the participant has with
   * the first place in the ranking, they will receive a bonus to their item charge:
   * - Between 0 and 5 points behind: +0 item charge
   * - Between 5 and 10 points behind: +5 item charge (roughly 7 items for a standard 20-turn game)
   * - Between 10 and 20 points behind: +15 item charge (roughly 9 items for a standard 20-turn game)
   * - Between 20 and 50 points behind: +25 item charge (roughly 11 items for a standard 20-turn game)
   * - Between 50 and 100 points behind: +40 item charge (roughly 14 items for a standard 20-turn game)
   * - More than 100 points behind: +60 item charge (roughly 18 items for a standard 20-turn game)
   *
   * This system allows players who are behind to catch up by giving them more power ups, while preventing players in
   * the lead from getting too much of an advantage.
   *
   * While the participant is holding onto an active item, the item charge won't increase past 50%.
   */
  @Property()
  itemCharge = 0

  /**
   * The active item represents the power up that the participant is currently having available.
   *
   * When the item charge reaches 100, an item is granted to the participant and stored in this field, and the item
   * charge resets to 0.
   * The participant can then choose to use the item during their turn, which will consume the item and set this field
   * back to null until they get another item.
   *
   * If the participant doesn't use the item during their turn, they can choose to keep it for later. However, they
   * won't be able to get another item until they use the one they have, since the item charge won't increase while they
   * have an active item.
   */
  @Property({ nullable: true })
  activeItem: Item["name"] | null = null

  /**
   * The statuses represent the active status effects applied to the participant.
   * Each status has an id (the item that granted it) and a duration (number of turns remaining).
   * This is stored as stringified JSON in the database.
   */
  @Property({ type: "json" })
  statuses: Array<{
    name: Item["name"]
    duration: number
  }> = []

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
