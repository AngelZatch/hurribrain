import {
  Entity,
  Enum,
  Filter,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"
import { v4 } from "uuid"

export enum UserRole {
  STANDARD = "standard",
  ADMIN = "admin",
}

@Entity()
@Filter({ name: "notDeleted", cond: { deletedAt: null } })
@Filter({ name: "notBanned", cond: { bannedAt: null } })
export class User {
  @PrimaryKey()
  uuid: string = v4()

  @Property()
  @Unique()
  @Index()
  email!: string

  @Property()
  @Unique()
  @Index()
  name!: string

  // Access restrictions
  @Property({ hidden: true, lazy: true })
  password!: string

  @Property({ hidden: true, lazy: true })
  bannedAt?: Date

  @Enum({ items: () => UserRole, default: UserRole.STANDARD })
  role!: UserRole

  // Timestamps
  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Property({ hidden: true, nullable: true })
  deletedAt?: Date

  constructor(body: Pick<User, "email" | "name">) {
    this.email = body.email
    this.name = body.name
    // this.level = 1
  }
}
