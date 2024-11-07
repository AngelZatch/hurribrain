import {
  Entity,
  Property,
  Collection,
  ManyToMany,
  PrimaryKey,
  OneToMany,
  ManyToOne,
  Filter,
} from "@mikro-orm/core"
import { Tag } from "./tag.entity.js"
import { v4 } from "uuid"
import { Choice } from "./choice.entity.js"
import { Asset } from "./asset.entity.js"

@Entity()
@Filter({ name: "notDeleted", cond: { deletedAt: null } })
export class Question {
  @PrimaryKey()
  uuid: string = v4()

  @Property()
  title: string

  @ManyToMany({ entity: () => Tag, lazy: true })
  tags = new Collection<Tag>(this)

  @ManyToOne({ entity: () => Asset, nullable: true })
  asset: Asset | null

  @OneToMany(() => Choice, (choice) => choice.question, {
    orphanRemoval: true,
    orderBy: { isCorrect: "DESC" },
  })
  choices = new Collection<Choice>(this)

  @Property()
  correctAnswers: number = 0

  @Property()
  incorrectAnswers: number = 0

  @Property({ persist: false })
  get successRate(): number | null {
    const totalAnswers = this.correctAnswers + this.incorrectAnswers
    if (totalAnswers === 0) {
      return null
    }
    return (this.correctAnswers / totalAnswers) * 100
  }

  @Property({ persist: false })
  get difficulty(): string {
    const rate = this.successRate
    if (!rate) {
      return "unknown"
    }
    if (rate > 50) {
      return "easy"
    } else if (rate > 20) {
      return "medium"
    } else if (rate > 1) {
      return "hard"
    } else {
      return "expert"
    }
  }

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Property({ nullable: true })
  deletedAt?: Date

  constructor(body: Pick<Question, "title" | "asset">) {
    this.title = body.title
    this.asset = body.asset ?? null
  }
}
