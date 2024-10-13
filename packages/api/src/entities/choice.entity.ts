import {
  Entity,
  Property,
  PrimaryKey,
  ManyToOne,
  type Rel,
} from "@mikro-orm/core"
import { v4 } from "uuid"
import { Question } from "./question.entity.js"

@Entity()
export class Choice {
  @PrimaryKey()
  uuid: string = v4()

  @Property()
  value: string

  @Property()
  isCorrect: boolean

  @ManyToOne({ entity: () => Question })
  question?: Rel<Question>

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  constructor(body: Pick<Choice, "value" | "isCorrect">) {
    this.value = body.value
    this.isCorrect = body.isCorrect
  }
}
