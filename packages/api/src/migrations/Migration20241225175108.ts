import { Migration } from '@mikro-orm/migrations';

export class Migration20241225175108 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`user_stats\` (\`uuid\` varchar(255) not null, \`level\` int not null default 1, \`experience_points\` int not null default 0, \`games_played\` int not null default 0, \`games_won\` int not null default 0, \`first_game_played\` datetime null, \`first_game_won\` datetime null, \`user_uuid\` varchar(255) null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`user_stats\` add index \`user_stats_user_uuid_index\`(\`user_uuid\`);`);

    this.addSql(`alter table \`user_stats\` add constraint \`user_stats_user_uuid_foreign\` foreign key (\`user_uuid\`) references \`user\` (\`uuid\`) on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`user_stats\`;`);
  }

}
