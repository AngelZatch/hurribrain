import { Migration } from "@mikro-orm/migrations"

export class Migration20260304084158 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "answer" drop constraint "answer_choice_uuid_foreign";`
    )

    this.addSql(
      `alter table "answer" alter column "choice_uuid" type varchar(255) using ("choice_uuid"::varchar(255));`
    )
    this.addSql(
      `alter table "answer" alter column "choice_uuid" drop not null;`
    )
    this.addSql(
      `alter table "answer" add constraint "answer_choice_uuid_foreign" foreign key ("choice_uuid") references "choice" ("uuid") on update cascade on delete set null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "answer" drop constraint "answer_choice_uuid_foreign";`
    )

    this.addSql(
      `alter table "answer" alter column "choice_uuid" type varchar(255) using ("choice_uuid"::varchar(255));`
    )
    this.addSql(`alter table "answer" alter column "choice_uuid" set not null;`)
    this.addSql(
      `alter table "answer" add constraint "answer_choice_uuid_foreign" foreign key ("choice_uuid") references "choice" ("uuid") on update cascade on delete no action;`
    )
  }
}
