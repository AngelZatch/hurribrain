import {
  Entity,
  Property,
  PrimaryKey,
  Filter,
  Enum,
  Formula,
} from "@mikro-orm/core"
import { v4 } from "uuid"

export enum AssetType {
  IMAGE = "image",
  VIDEO = "video",
  SOUND = "sound",
}

@Entity()
@Filter({ name: "notDeleted", cond: { deletedAt: null } })
export class Asset {
  @PrimaryKey()
  uuid: string = v4()

  @Property()
  name: string

  @Property()
  uri: string

  @Enum({ items: () => AssetType })
  type!: AssetType

  @Formula(
    (alias) => `(
    SELECT COUNT(*)
    FROM question
    WHERE question.asset_uuid = ${alias}.uuid
    )`,
    { type: "number", persist: false, lazy: true }
  )
  questionCount: number = 0

  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Property({ nullable: true })
  deletedAt?: Date

  constructor(name: string, uri: string, type: AssetType) {
    this.name = name
    this.uri = uri
    this.type = type
  }
}
