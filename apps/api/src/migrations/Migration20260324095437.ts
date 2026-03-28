import { Migration } from "@mikro-orm/migrations"

export class Migration20260324095437 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "asset" add column "type" text check ("type" in ('image', 'video', 'sound')) not null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "asset" drop column "type";`)
  }
}
