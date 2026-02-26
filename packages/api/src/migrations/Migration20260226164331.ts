import { Migration } from '@mikro-orm/migrations';

export class Migration20260226164331 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`turn\` add \`is_gold\` tinyint(1) not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`turn\` drop column \`is_gold\`;`);
  }

}
