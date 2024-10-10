import { Entity, Property, PrimaryKey } from "@mikro-orm/core"
import { v4 } from "uuid"

@Entity()
export class Choice {
  @PrimaryKey()
  uuid: string = v4()

  @Property()
  value: string

  @Property()
  isCorrect: boolean

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  constructor(body: Pick<Choice, "value" | "isCorrect">) {
    this.value = body.value
    this.isCorrect = body.isCorrect
  }
}
