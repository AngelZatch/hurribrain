import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 } from "uuid";

@Entity()
export class Tag {
  @PrimaryKey()
  uuid: string = v4();

  @Property()
  name!: string;

  @Property()
  description?: string = "";

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  constructor(body: Pick<Tag, "name" | "description">) {
    this.name = body.name;
    this.description = body.description ?? "";
  }
}
