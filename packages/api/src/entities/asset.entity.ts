import { Entity, Property, PrimaryKey, Filter } from "@mikro-orm/core"
import { v4 } from "uuid"

@Entity()
@Filter({ name: "notDeleted", cond: { deletedAt: null } })
export class Asset {
  @PrimaryKey()
  uuid: string = v4()

  @Property()
  name: string

  @Property()
  uri: string

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Property({ nullable: true })
  deletedAt?: Date

  constructor(name: string, uri: string) {
    this.name = name
    this.uri = uri
  }
}
