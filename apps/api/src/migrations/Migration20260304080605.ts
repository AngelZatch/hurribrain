import { Migration } from "@mikro-orm/migrations"

export class Migration20260304080605 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "answer" add column "medals" jsonb not null;`)
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "answer" drop column "medals";`)
  }
}
