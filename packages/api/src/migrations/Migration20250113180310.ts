import { Migration } from '@mikro-orm/migrations';

export class Migration20250113180310 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`turn\` (\`uuid\` varchar(255) not null, \`position\` int not null, \`question_uuid\` varchar(255) not null, \`game_uuid\` varchar(255) not null, \`started_at\` datetime null, \`finished_at\` datetime null, \`created_at\` datetime not null, \`updated_at\` datetime not null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`turn\` add index \`turn_question_uuid_index\`(\`question_uuid\`);`);
    this.addSql(`alter table \`turn\` add index \`turn_game_uuid_index\`(\`game_uuid\`);`);
    this.addSql(`alter table \`turn\` add unique \`turn_game_uuid_question_uuid_unique\`(\`game_uuid\`, \`question_uuid\`);`);

    this.addSql(`create table \`participation\` (\`uuid\` varchar(255) not null, \`score\` int not null, \`previous_score\` int not null, \`rank\` int not null, \`previous_rank\` int not null, \`user_uuid\` varchar(255) not null, \`game_uuid\` varchar(255) not null, \`created_at\` datetime not null, \`updated_at\` datetime not null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`participation\` add index \`participation_user_uuid_index\`(\`user_uuid\`);`);
    this.addSql(`alter table \`participation\` add index \`participation_game_uuid_index\`(\`game_uuid\`);`);
    this.addSql(`alter table \`participation\` add unique \`participation_user_uuid_game_uuid_unique\`(\`user_uuid\`, \`game_uuid\`);`);

    this.addSql(`create table \`answer\` (\`uuid\` varchar(255) not null, \`participation_uuid\` varchar(255) not null, \`turn_uuid\` varchar(255) not null, \`choice_uuid\` varchar(255) not null, \`speed\` int not null, \`created_at\` datetime not null, \`updated_at\` datetime not null, primary key (\`uuid\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`answer\` add index \`answer_participation_uuid_index\`(\`participation_uuid\`);`);
    this.addSql(`alter table \`answer\` add index \`answer_turn_uuid_index\`(\`turn_uuid\`);`);
    this.addSql(`alter table \`answer\` add index \`answer_choice_uuid_index\`(\`choice_uuid\`);`);
    this.addSql(`alter table \`answer\` add unique \`answer_participation_uuid_turn_uuid_unique\`(\`participation_uuid\`, \`turn_uuid\`);`);

    this.addSql(`alter table \`turn\` add constraint \`turn_question_uuid_foreign\` foreign key (\`question_uuid\`) references \`question\` (\`uuid\`) on update cascade;`);
    this.addSql(`alter table \`turn\` add constraint \`turn_game_uuid_foreign\` foreign key (\`game_uuid\`) references \`game\` (\`uuid\`) on update cascade;`);

    this.addSql(`alter table \`participation\` add constraint \`participation_user_uuid_foreign\` foreign key (\`user_uuid\`) references \`user\` (\`uuid\`) on update cascade;`);
    this.addSql(`alter table \`participation\` add constraint \`participation_game_uuid_foreign\` foreign key (\`game_uuid\`) references \`game\` (\`uuid\`) on update cascade;`);

    this.addSql(`alter table \`answer\` add constraint \`answer_participation_uuid_foreign\` foreign key (\`participation_uuid\`) references \`participation\` (\`uuid\`) on update cascade;`);
    this.addSql(`alter table \`answer\` add constraint \`answer_turn_uuid_foreign\` foreign key (\`turn_uuid\`) references \`turn\` (\`uuid\`) on update cascade;`);
    this.addSql(`alter table \`answer\` add constraint \`answer_choice_uuid_foreign\` foreign key (\`choice_uuid\`) references \`choice\` (\`uuid\`) on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`answer\` drop foreign key \`answer_turn_uuid_foreign\`;`);

    this.addSql(`alter table \`answer\` drop foreign key \`answer_participation_uuid_foreign\`;`);

    this.addSql(`drop table if exists \`turn\`;`);

    this.addSql(`drop table if exists \`participation\`;`);

    this.addSql(`drop table if exists \`answer\`;`);
  }

}
