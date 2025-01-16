import { Migration } from '@mikro-orm/migrations';

export class Migration20250116142751 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`question\` add \`success_rate\` int null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`question\` drop column \`success_rate\`;`);
  }

}
