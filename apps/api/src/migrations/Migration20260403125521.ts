import { Migration } from "@mikro-orm/migrations"

export class Migration20260403125521 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "account_verifier" ("uuid" varchar(255) not null, "email" varchar(255) not null, "verification_key" varchar(255) not null, "created_at" timestamptz not null, constraint "account_verifier_pkey" primary key ("uuid"));`
    )
    this.addSql(
      `alter table "account_verifier" add constraint "account_verifier_email_unique" unique ("email");`
    )
    this.addSql(
      `alter table "account_verifier" add constraint "account_verifier_verification_key_unique" unique ("verification_key");`
    )
    this.addSql(
      `create index "account_verifier_email_verification_key_index" on "account_verifier" ("email", "verification_key");`
    )

    this.addSql(`alter table "asset" drop column "description";`)
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "account_verifier" cascade;`)

    this.addSql(
      `alter table "asset" add column "description" varchar(255) null;`
    )
  }
}
