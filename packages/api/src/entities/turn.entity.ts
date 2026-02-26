import {
  ArrayType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
  type Rel,
} from "@mikro-orm/core"
import { Question } from "./question.entity.js"
import { Game } from "./game.entity.js"
import { v4 } from "uuid"

@Entity()
@Unique({ properties: ["game", "question"] })
export class Turn {
  @PrimaryKey()
  uuid: string = v4()

  // The position of the turn in the game
  @Property()
  position: number

  /**
   * A Gold Turn is a rare variant of the turn with several effects:
   * - Points gained are doubled
   * - No points are lost by answering incorrectly (this does not nullify Judge)
   * - Streaks are kept if they were to be reset
   */
  @Property({ type: Boolean, default: false })
  isGold!: boolean

  // The question asked in this turn
  @ManyToOne({ entity: () => Question })
  question: Rel<Question>

  // The game the turn belongs to
  @ManyToOne({ entity: () => Game })
  game: Rel<Game>

  // Turn state
  @Property({ type: Date, nullable: true })
  startedAt: Date | null = null

  @Property({ type: Date, nullable: true })
  finishedAt: Date | null = null

  // Speed ranks
  @Property({ type: ArrayType, nullable: true })
  speedRanking: string[] = []

  // Timestamps
  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  constructor(body: Pick<Turn, "game" | "question" | "position" | "isGold">) {
    this.game = body.game
    this.question = body.question
    this.position = body.position
    this.isGold = body.isGold ?? false
  }
}
