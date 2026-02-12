import { Entity, Enum, PrimaryKey, Property, Unique } from "@mikro-orm/core"
import { v4 } from "uuid"

export enum ItemType {
  ATTACK = "attack",
  DEFENSE = "defense",
  SUPPORT = "support",
}

@Entity()
@Unique({ properties: ["name"] })
export class Item {
  @PrimaryKey()
  uuid: string = v4()

  @Property()
  name!: string

  @Property()
  description!: string

  @Enum({ items: () => ItemType, default: ItemType.SUPPORT })
  type!: ItemType

  @Property({ type: "boolean", default: false })
  isDebuff!: boolean

  // Timestamps
  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  constructor(body: Pick<Item, "name" | "description" | "type" | "isDebuff">) {
    this.name = body.name
    this.type = body.type
    this.isDebuff = body.isDebuff
    this.description = body.description
  }
}
