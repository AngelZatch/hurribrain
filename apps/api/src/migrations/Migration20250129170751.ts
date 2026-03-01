import { Migration } from "@mikro-orm/migrations"

export class Migration20250129170751 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table \`participation\` add \`streak\` int not null, add \`max_streak\` int not null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table \`participation\` drop column \`streak\`, drop column \`max_streak\`;`
    )
  }
}
