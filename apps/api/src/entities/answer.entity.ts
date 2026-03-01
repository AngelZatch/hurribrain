import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
  type Rel,
} from "@mikro-orm/core"
import { Turn } from "./turn.entity.js"
import { Choice } from "./choice.entity.js"
import { Participation } from "./participation.entity.js"
import { v4 } from "uuid"

@Entity()
@Unique({ properties: ["participation", "turn"] })
export class Answer {
  @PrimaryKey()
  uuid: string = v4()

  // The player who gave the answer
  @ManyToOne({ entity: () => Participation })
  participation: Rel<Participation>

  // The turn the question being answered belongs to
  @ManyToOne({ entity: () => Turn })
  turn: Rel<Turn>

  // The answer given by the player
  @ManyToOne({ entity: () => Choice })
  choice: Rel<Choice>

  // The speed at which the answer was given
  @Property()
  speed!: number

  // Timestamps
  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  constructor(
    body: Pick<Answer, "turn" | "choice" | "speed" | "participation">
  ) {
    this.turn = body.turn
    this.choice = body.choice
    this.speed = body.speed
    this.participation = body.participation
  }
}
