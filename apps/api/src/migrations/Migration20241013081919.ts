import { Migration } from "@mikro-orm/migrations"

export class Migration20241013081919 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table \`asset\` (\`uuid\` varchar(255) not null, \`name\` varchar(255) not null, \`uri\` varchar(255) not null, \`created_at\` datetime not null, \`updated_at\` datetime not null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`
    )

    this.addSql(
      `create table \`question\` (\`uuid\` varchar(255) not null, \`title\` varchar(255) not null, \`asset\` varchar(255) null, \`correct_answers\` int not null, \`incorrect_answers\` int not null, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`deleted_at\` datetime null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`
    )

    this.addSql(
      `create table \`choice\` (\`uuid\` varchar(255) not null, \`value\` varchar(255) not null, \`is_correct\` tinyint(1) not null, \`question_uuid\` varchar(255) null, \`created_at\` datetime not null, \`updated_at\` datetime not null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`
    )
    this.addSql(
      `alter table \`choice\` add index \`choice_question_uuid_index\`(\`question_uuid\`);`
    )

    this.addSql(
      `create table \`tag\` (\`uuid\` varchar(255) not null, \`name\` varchar(255) not null, \`description\` varchar(255) null, \`created_at\` datetime not null, \`updated_at\` datetime not null, \`deleted_at\` datetime null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`
    )

    this.addSql(
      `create table \`question_tags\` (\`question_uuid\` varchar(255) not null, \`tag_uuid\` varchar(255) not null, primary key (\`question_uuid\`, \`tag_uuid\`)) default character set utf8mb4 engine = InnoDB;`
    )
    this.addSql(
      `alter table \`question_tags\` add index \`question_tags_question_uuid_index\`(\`question_uuid\`);`
    )
    this.addSql(
      `alter table \`question_tags\` add index \`question_tags_tag_uuid_index\`(\`tag_uuid\`);`
    )

    this.addSql(
      `alter table \`choice\` add constraint \`choice_question_uuid_foreign\` foreign key (\`question_uuid\`) references \`question\` (\`uuid\`) on update cascade on delete set null;`
    )

    this.addSql(
      `alter table \`question_tags\` add constraint \`question_tags_question_uuid_foreign\` foreign key (\`question_uuid\`) references \`question\` (\`uuid\`) on update cascade on delete cascade;`
    )
    this.addSql(
      `alter table \`question_tags\` add constraint \`question_tags_tag_uuid_foreign\` foreign key (\`tag_uuid\`) references \`tag\` (\`uuid\`) on update cascade on delete cascade;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table \`choice\` drop foreign key \`choice_question_uuid_foreign\`;`
    )

    this.addSql(
      `alter table \`question_tags\` drop foreign key \`question_tags_question_uuid_foreign\`;`
    )

    this.addSql(
      `alter table \`question_tags\` drop foreign key \`question_tags_tag_uuid_foreign\`;`
    )

    this.addSql(`drop table if exists \`asset\`;`)

    this.addSql(`drop table if exists \`question\`;`)

    this.addSql(`drop table if exists \`choice\`;`)

    this.addSql(`drop table if exists \`tag\`;`)

    this.addSql(`drop table if exists \`question_tags\`;`)
  }
}
