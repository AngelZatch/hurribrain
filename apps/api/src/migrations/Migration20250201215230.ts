import { Migration } from "@mikro-orm/migrations"

export class Migration20250201215230 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table \`turn\` add \`speed_ranking\` text null;`)
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`turn\` drop column \`speed_ranking\`;`)
  }
}
