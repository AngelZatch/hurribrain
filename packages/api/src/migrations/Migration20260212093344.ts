import { Migration } from "@mikro-orm/migrations"

export class Migration20260212093344 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table \`item\` add \`is_debuff\` tinyint(1) not null default false;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`item\` drop column \`is_debuff\`;`)
  }
}
