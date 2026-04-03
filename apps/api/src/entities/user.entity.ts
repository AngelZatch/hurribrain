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

/**
 * A LITE User is created when a user just gives a name to access a game and play in "Account-lite" mode. It has a TTL
 * of 2 hours and can be only be converted once after the player has finished playing the game they created the account
 * for. If they choose to leave, the LITE Account will eventually be deleted.
 * TODO: LITE accounts cannot create a game and cannot edit their profile.
 *
 * A STANDARD User is a regular account. It can either be created by registering to the app from the classic authentication
 * flow, or be a LITE account elevated after a game.
 *
 * An ADMIN User is a privileged account that is used for specific actions.
 */
export enum UserRole {
  LITE = "lite",
  STANDARD = "standard",
  ADMIN = "admin",
}

@Entity()
@Filter({
  name: "notDeleted",
  cond: {
    $or: [
      { deletedAt: null },
      { deletedAt: { $ne: null }, role: UserRole.LITE },
    ],
  },
})
@Filter({ name: "notBanned", cond: { bannedAt: null } })
@Filter({ name: "isVerified", cond: { isVerified: true } })
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

  @Property({ type: "boolean", default: false })
  isVerified!: boolean

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
  }
}
