import {
  Entity,
  Property,
  Collection,
  ManyToMany,
  PrimaryKey,
  OneToMany,
} from "@mikro-orm/core"
import { Tag } from "./tag.entity.js"
import { v4 } from "uuid"
import { Choice } from "./choice.entity.js"

@Entity()
export class Question {
  @PrimaryKey()
  uuid: string = v4()

  @Property()
  title: string

  @ManyToMany(() => Tag)
  tags = new Collection<Tag>(this)

  @Property({ nullable: true })
  asset?: string | null

  @OneToMany(() => Choice, (choice) => choice.question)
  choices = new Collection<Choice>(this)

  @Property()
  correctAnswers: number = 0

  @Property()
  incorrectAnswers: number = 0

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
