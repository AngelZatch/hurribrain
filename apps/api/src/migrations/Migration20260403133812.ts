import { Migration } from "@mikro-orm/migrations"

export class Migration20260403133812 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "account_verifier" add column "expires_at" timestamptz not null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "account_verifier" drop column "expires_at";`)
  }
}
