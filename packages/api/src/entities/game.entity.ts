import {
  Collection,
  Entity,
  Enum,
  Filter,
  Formula,
  ManyToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"
import { v4 } from "uuid"
import { Tag } from "./tag.entity.js"

export enum GameDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  EXPERT = "expert",
}

@Entity()
@Filter({ name: "notDeleted", cond: { deletedAt: null } })
export class Game {
  @PrimaryKey()
  uuid: string = v4()

  @Property()
  @Unique()
  code: string = this.generateUniqueCode()

  // Game options
  @ManyToMany({ entity: () => Tag, lazy: true })
  tags = new Collection<Tag>(this)

  @Property({ type: "number", default: 20 })
  length?: number

  @Enum({ items: () => GameDifficulty, default: GameDifficulty.MEDIUM })
  difficulty?: GameDifficulty

  @Property({ type: "boolean", default: false })
  isPrivate: boolean

  // Game state
  @Property({ type: Date, nullable: true })
  startedAt: Date | null = null

  @Property({ type: Date, nullable: true })
  finishedAt: Date | null = null

  @Formula(
    (alias) => `(
    SELECT COUNT(*)
    FROM participation
    WHERE participation.game_uuid = ${alias}.uuid
  )`,
    {
      type: "number",
      persist: false,
      lazy: true,
    }
  )
  playerCount: number = 0

  // Timestamps
  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  constructor(body: Pick<Game, "length" | "difficulty" | "isPrivate">) {
    this.length = body.length
    this.difficulty = body.difficulty
    this.isPrivate = body.isPrivate
  }

  private generateUniqueCode(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      result += characters[randomIndex]
    }
    return result
  }
}
