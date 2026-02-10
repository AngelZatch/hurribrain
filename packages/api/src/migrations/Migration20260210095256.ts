import { Migration } from '@mikro-orm/migrations';

export class Migration20260210095256 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`item\` (\`uuid\` varchar(255) not null, \`name\` varchar(255) not null, \`description\` varchar(255) not null, \`type\` enum('attack', 'defense', 'support') not null default 'support', \`created_at\` datetime not null, \`updated_at\` datetime not null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`item\` add unique \`item_name_unique\`(\`name\`);`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`item\`;`);
  }

}
