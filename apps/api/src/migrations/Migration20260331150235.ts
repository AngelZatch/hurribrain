import { Migration } from '@mikro-orm/migrations';

export class Migration20260331150235 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "asset" add column "description" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "asset" drop column "description";`);
  }

}
