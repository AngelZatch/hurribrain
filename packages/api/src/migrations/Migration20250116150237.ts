import { Migration } from '@mikro-orm/migrations';

export class Migration20250116150237 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`question\` modify \`success_rate\` float;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`question\` modify \`success_rate\` int;`);
  }

}
