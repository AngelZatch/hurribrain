import {
  Entity,
  Property,
  Collection,
  OneToMany,
  ManyToMany,
  OptionalProps,
  PrimaryKey,
} from "@mikro-orm/core";
import { Choice } from "./choice.entity.js"; // Entité future
import { Tag } from "./tag.entity.js";
import { v4 } from "uuid";

@Entity()
export class Question {
  @PrimaryKey()
  uuid: string = v4();

  @Property()
  title: string;

  @ManyToMany(() => Tag)
  tags = new Collection<Tag>(this);

  @OneToMany(() => Choice, (choice) => choice.question, { lazy: true })
  choices = new Collection<Choice>(this);

  @Property({ nullable: true })
  asset?: string | null;

  @Property()
  correctAnswers: number = 0;

  @Property()
  incorrectAnswers: number = 0;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ nullable: true })
  deletedAt?: Date;

  [OptionalProps]?: "successRate";

  get successRate(): number {
    const totalAnswers = this.correctAnswers + this.incorrectAnswers;
    return totalAnswers === 0 ? 0 : (this.correctAnswers / totalAnswers) * 100;
  }

  constructor(body: Pick<Question, "title" | "asset">) {
    this.title = body.title;
    this.asset = body.asset ?? null;
  }
}
