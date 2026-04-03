import {
  Entity,
  Filter,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core"
import { HOUR } from "./../utils/helperVariables.js"
import { randomBytes } from "node:crypto"
import { v4 } from "uuid"

/**
 * AccountVerifiers are a email-key pair used only to pass the status of an account
 * to verified. They have a 24-hour TTL baked in at creation that cannot be modified.
 *
 * AccountVerifiers are automatically deleted by the account cleaning cron if unused.
 * Used verifiers are immedately deleted as part of the account verification process.
 */
@Entity()
@Index({ properties: ["email", "verificationKey"] })
@Filter({
  name: "hasExpired",
  cond: () => ({
    expiresAt: { $lte: new Date() },
  }),
})
export class AccountVerifier {
  @PrimaryKey()
  uuid: string = v4()

  @Property()
  @Unique()
  email!: string

  @Property()
  @Unique()
  verificationKey!: string

  @Property()
  createdAt: Date = new Date()

  // Each verifier has a 24-hour TTL that cannot be modified
  @Property()
  expiresAt: Date = new Date(new Date().getTime() + 24 * HOUR)

  constructor(body: Pick<AccountVerifier, "email">) {
    this.email = body.email
    this.verificationKey = Buffer.from(randomBytes(16)).toString("hex")
  }
}
