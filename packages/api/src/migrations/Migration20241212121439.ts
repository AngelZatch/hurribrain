import { Migration } from '@mikro-orm/migrations';

export class Migration20241212121439 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`game\` (\`uuid\` varchar(255) not null, \`code\` varchar(255) not null, \`length\` int null default 20, \`difficulty\` enum('easy', 'medium', 'hard', 'expert') null default 'medium', \`is_private\` tinyint(1) not null default false, \`started_at\` datetime null, \`finished_at\` datetime null, \`created_at\` datetime not null, \`updated_at\` datetime not null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`game\` add unique \`game_code_unique\`(\`code\`);`);

    this.addSql(`create table \`game_tags\` (\`game_uuid\` varchar(255) not null, \`tag_uuid\` varchar(255) not null, primary key (\`game_uuid\`, \`tag_uuid\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`game_tags\` add index \`game_tags_game_uuid_index\`(\`game_uuid\`);`);
    this.addSql(`alter table \`game_tags\` add index \`game_tags_tag_uuid_index\`(\`tag_uuid\`);`);

    this.addSql(`create table \`user\` (\`uuid\` varchar(255) not null, \`email\` varchar(255) not null, \`name\` varchar(255) not null, \`password\` varchar(255) not null, \`banned_at\` datetime null, \`role\` enum('standard', 'admin') not null default 'standard', \`created_at\` datetime not null, \`updated_at\` datetime not null, \`deleted_at\` datetime null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`user\` add index \`user_email_index\`(\`email\`);`);
    this.addSql(`alter table \`user\` add unique \`user_email_unique\`(\`email\`);`);
    this.addSql(`alter table \`user\` add index \`user_name_index\`(\`name\`);`);
    this.addSql(`alter table \`user\` add unique \`user_name_unique\`(\`name\`);`);

    this.addSql(`alter table \`game_tags\` add constraint \`game_tags_game_uuid_foreign\` foreign key (\`game_uuid\`) references \`game\` (\`uuid\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`game_tags\` add constraint \`game_tags_tag_uuid_foreign\` foreign key (\`tag_uuid\`) references \`tag\` (\`uuid\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`game_tags\` drop foreign key \`game_tags_game_uuid_foreign\`;`);

    this.addSql(`drop table if exists \`game\`;`);

    this.addSql(`drop table if exists \`game_tags\`;`);

    this.addSql(`drop table if exists \`user\`;`);
  }

}
