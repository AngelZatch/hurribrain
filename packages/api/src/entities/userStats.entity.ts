import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
  type Rel,
} from "@mikro-orm/core"
import { User } from "./user.entity.js"
import { v4 } from "uuid"

@Entity()
export class UserStats {
  @PrimaryKey({ hidden: true })
  uuid: string = v4()

  @Property({ type: Number, default: 1 })
  level: number = 1

  @Property({ type: Number, default: 0 })
  experiencePoints: number = 0

  @Property({ type: Number, default: 0 })
  gamesPlayed: number = 0

  @Property({ type: Number, default: 0 })
  gamesWon: number = 0

  @Property({ type: Date, nullable: true })
  firstGamePlayed?: Date

  @Property({ type: Date, nullable: true })
  firstGameWon?: Date

  @ManyToOne({ entity: () => User, hidden: true })
  user?: Rel<User>

  constructor(user: User) {
    this.user = user
  }
}
