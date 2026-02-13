import { Migration } from "@mikro-orm/migrations"

export class Migration20260210104926 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table \`participation\` add \`item_charge\` int not null, add \`active_item\` varchar(255) null, add \`statuses\` json not null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table \`participation\` drop column \`item_charge\`, drop column \`active_item\`, drop column \`statuses\`;`
    )
  }
}
