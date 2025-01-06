import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
  type Rel,
} from "@mikro-orm/core"
import { Question } from "./question.entity.js"
import { Game } from "./game.entity.js"

@Entity()
@Unique({ properties: ["game", "question"] })
export class Turn {
  @PrimaryKey()
  uuid!: string

  // The position of the turn in the game
  @Property()
  position: number

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

  // Timestamps
  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  constructor(body: Pick<Turn, "game" | "question" | "position">) {
    this.game = body.game
    this.question = body.question
    this.position = body.position
  }
}
