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

  /**
   * Grants experience points to the user and recomputes their level and current experience points
   * @param amount
   */
  grantExperiencePoints(amount: number) {
    const experienceTable: Array<number> = [
      100, 220, 364, 536, 742, 989, 1285, 1640, 2066, 2577, 3139, 3757, 4436,
      5182, 6002, 6904, 7896, 8987, 10187, 11507, 12919, 14429, 16044, 17772,
      19620, 21597, 23712, 25975, 28396, 30986, 33705, 36559, 39555, 42700,
      46002, 49469, 53109, 56931, 60944, 65157, 69538, 74094, 78832, 83759,
      88883, 94211, 99752, 105514, 111506, 117737, 124154, 130763, 137570,
      144581, 151802, 159239, 166899, 174788, 182913, 191281, 199816, 208521,
      217400, 226456, 235693, 245114, 254723, 264524, 274521, 284717, 295014,
      305413, 315915, 326522, 337235, 348055, 358983, 370020, 381167, 392425,
      403795, 415278, 426875, 438587, 450416, 462363, 474429, 486615, 498922,
      511352, 523906, 536585, 549390, 562323, 575385, 588577, 601900, 615356,
      628946, 642671,
    ]

    // Grant the amount of EXP to the user
    this.experiencePoints += amount

    // Get the amount of experience required to level up
    const experienceThreshold = experienceTable[this.level - 1]

    // If reached, level is increased and EXP is reset to 0, keeping the overflow
    if (this.experiencePoints >= experienceThreshold) {
      this.level += 1
      this.experiencePoints -= experienceThreshold
    }
  }
}
