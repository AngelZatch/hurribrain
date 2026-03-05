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

export type MedalName =
  | "correct"
  | "difficulty:medium"
  | "difficulty:hard"
  | "difficulty:expert"
  | "streak:5"
  | "streak:10"
  | "streak:15"
  | "streak:20"
  | "streak:25"
  | "streak:30"
  | "streak:35"
  | "streak:40"
  | "streak:45"
  | "streak:50"
  | "speed:fast"
  | "speed:faster"
  | "speed:fastest"
  | "boost"
  | "gold:boost"
  | "gold:shield"
  | "incorrect"
  | "judge"

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
  choice: Rel<Choice> | null

  // The speed at which the answer was given
  @Property()
  speed!: number

  @Property({ type: "json" })
  medals: Array<MedalName> = []

  // Timestamps
  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  constructor(
    body: Pick<Answer, "turn" | "choice" | "speed" | "participation" | "medals">
  ) {
    this.turn = body.turn
    this.choice = body.choice ?? null
    this.speed = body.speed
    this.participation = body.participation
    this.medals = body.medals ?? []
  }
}
