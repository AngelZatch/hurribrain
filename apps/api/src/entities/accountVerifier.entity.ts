import { Entity, Index, PrimaryKey, Property, Unique } from "@mikro-orm/core"
import { randomBytes } from "node:crypto"
import { v4 } from "uuid"

@Entity()
@Index({ properties: ["email", "verificationKey"] })
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

  constructor(body: Pick<AccountVerifier, "email">) {
    this.email = body.email
    this.verificationKey = Buffer.from(randomBytes(16)).toString("hex")
  }
}
