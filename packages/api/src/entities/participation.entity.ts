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

  @Property()
  score = 0

  @Property()
  previousScore = 0

  @Property()
  rank = 0

  @Property()
  previousRank = 0

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
