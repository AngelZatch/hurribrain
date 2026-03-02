import { Migration } from "@mikro-orm/migrations"

export class Migration20260302142324 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "asset" ("uuid" varchar(255) not null, "name" varchar(255) not null, "uri" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "asset_pkey" primary key ("uuid"));`
    )

    this.addSql(
      `create table "item" ("uuid" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) not null, "type" text check ("type" in ('attack', 'defense', 'support')) not null default 'support', "is_debuff" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "item_pkey" primary key ("uuid"));`
    )
    this.addSql(
      `alter table "item" add constraint "item_name_unique" unique ("name");`
    )

    this.addSql(
      `create table "question" ("uuid" varchar(255) not null, "title" varchar(255) not null, "asset_uuid" varchar(255) null, "correct_answers" int not null, "incorrect_answers" int not null, "success_rate" real null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "question_pkey" primary key ("uuid"));`
    )

    this.addSql(
      `create table "choice" ("uuid" varchar(255) not null, "value" varchar(255) not null, "is_correct" boolean not null, "question_uuid" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "choice_pkey" primary key ("uuid"));`
    )

    this.addSql(
      `create table "tag" ("uuid" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "tag_pkey" primary key ("uuid"));`
    )

    this.addSql(
      `create table "question_tags" ("question_uuid" varchar(255) not null, "tag_uuid" varchar(255) not null, constraint "question_tags_pkey" primary key ("question_uuid", "tag_uuid"));`
    )

    this.addSql(
      `create table "user" ("uuid" varchar(255) not null, "email" varchar(255) not null, "name" varchar(255) not null, "password" varchar(255) not null, "banned_at" timestamptz null, "role" text check ("role" in ('standard', 'admin')) not null default 'standard', "created_at" timestamptz not null, "updated_at" timestamptz not null, "deleted_at" timestamptz null, constraint "user_pkey" primary key ("uuid"));`
    )
    this.addSql(`create index "user_email_index" on "user" ("email");`)
    this.addSql(
      `alter table "user" add constraint "user_email_unique" unique ("email");`
    )
    this.addSql(`create index "user_name_index" on "user" ("name");`)
    this.addSql(
      `alter table "user" add constraint "user_name_unique" unique ("name");`
    )

    this.addSql(
      `create table "game" ("uuid" varchar(255) not null, "code" varchar(255) not null, "creator_uuid" varchar(255) not null, "length" int null default 20, "difficulty" text check ("difficulty" in ('easy', 'medium', 'hard', 'expert')) null default 'medium', "is_private" boolean not null default false, "started_at" timestamptz null, "finished_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "game_pkey" primary key ("uuid"));`
    )
    this.addSql(
      `alter table "game" add constraint "game_code_unique" unique ("code");`
    )

    this.addSql(
      `create table "turn" ("uuid" varchar(255) not null, "position" int not null, "is_gold" boolean not null default false, "question_uuid" varchar(255) not null, "game_uuid" varchar(255) not null, "started_at" timestamptz null, "finished_at" timestamptz null, "speed_ranking" text[] null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "turn_pkey" primary key ("uuid"));`
    )
    this.addSql(
      `alter table "turn" add constraint "turn_game_uuid_question_uuid_unique" unique ("game_uuid", "question_uuid");`
    )

    this.addSql(
      `create table "participation" ("uuid" varchar(255) not null, "score" int not null, "previous_score" int not null, "rank" int not null, "previous_rank" int not null, "streak" int not null, "max_streak" int not null, "item_charge" int not null, "active_item" varchar(255) null, "statuses" jsonb not null, "user_uuid" varchar(255) not null, "game_uuid" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "participation_pkey" primary key ("uuid"));`
    )
    this.addSql(
      `alter table "participation" add constraint "participation_user_uuid_game_uuid_unique" unique ("user_uuid", "game_uuid");`
    )

    this.addSql(
      `create table "answer" ("uuid" varchar(255) not null, "participation_uuid" varchar(255) not null, "turn_uuid" varchar(255) not null, "choice_uuid" varchar(255) not null, "speed" int not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "answer_pkey" primary key ("uuid"));`
    )
    this.addSql(
      `alter table "answer" add constraint "answer_participation_uuid_turn_uuid_unique" unique ("participation_uuid", "turn_uuid");`
    )

    this.addSql(
      `create table "game_tags" ("game_uuid" varchar(255) not null, "tag_uuid" varchar(255) not null, constraint "game_tags_pkey" primary key ("game_uuid", "tag_uuid"));`
    )

    this.addSql(
      `create table "user_stats" ("uuid" varchar(255) not null, "level" int not null default 1, "experience_points" int not null default 0, "games_played" int not null default 0, "games_won" int not null default 0, "first_game_played" timestamptz null, "first_game_won" timestamptz null, "user_uuid" varchar(255) null, constraint "user_stats_pkey" primary key ("uuid"));`
    )

    this.addSql(
      `alter table "question" add constraint "question_asset_uuid_foreign" foreign key ("asset_uuid") references "asset" ("uuid") on update cascade on delete set null;`
    )

    this.addSql(
      `alter table "choice" add constraint "choice_question_uuid_foreign" foreign key ("question_uuid") references "question" ("uuid") on update cascade on delete set null;`
    )

    this.addSql(
      `alter table "question_tags" add constraint "question_tags_question_uuid_foreign" foreign key ("question_uuid") references "question" ("uuid") on update cascade on delete cascade;`
    )
    this.addSql(
      `alter table "question_tags" add constraint "question_tags_tag_uuid_foreign" foreign key ("tag_uuid") references "tag" ("uuid") on update cascade on delete cascade;`
    )

    this.addSql(
      `alter table "game" add constraint "game_creator_uuid_foreign" foreign key ("creator_uuid") references "user" ("uuid") on update cascade;`
    )

    this.addSql(
      `alter table "turn" add constraint "turn_question_uuid_foreign" foreign key ("question_uuid") references "question" ("uuid") on update cascade;`
    )
    this.addSql(
      `alter table "turn" add constraint "turn_game_uuid_foreign" foreign key ("game_uuid") references "game" ("uuid") on update cascade;`
    )

    this.addSql(
      `alter table "participation" add constraint "participation_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade;`
    )
    this.addSql(
      `alter table "participation" add constraint "participation_game_uuid_foreign" foreign key ("game_uuid") references "game" ("uuid") on update cascade;`
    )

    this.addSql(
      `alter table "answer" add constraint "answer_participation_uuid_foreign" foreign key ("participation_uuid") references "participation" ("uuid") on update cascade;`
    )
    this.addSql(
      `alter table "answer" add constraint "answer_turn_uuid_foreign" foreign key ("turn_uuid") references "turn" ("uuid") on update cascade;`
    )
    this.addSql(
      `alter table "answer" add constraint "answer_choice_uuid_foreign" foreign key ("choice_uuid") references "choice" ("uuid") on update cascade;`
    )

    this.addSql(
      `alter table "game_tags" add constraint "game_tags_game_uuid_foreign" foreign key ("game_uuid") references "game" ("uuid") on update cascade on delete cascade;`
    )
    this.addSql(
      `alter table "game_tags" add constraint "game_tags_tag_uuid_foreign" foreign key ("tag_uuid") references "tag" ("uuid") on update cascade on delete cascade;`
    )

    this.addSql(
      `alter table "user_stats" add constraint "user_stats_user_uuid_foreign" foreign key ("user_uuid") references "user" ("uuid") on update cascade on delete set null;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "question" drop constraint "question_asset_uuid_foreign";`
    )

    this.addSql(
      `alter table "choice" drop constraint "choice_question_uuid_foreign";`
    )

    this.addSql(
      `alter table "question_tags" drop constraint "question_tags_question_uuid_foreign";`
    )

    this.addSql(
      `alter table "turn" drop constraint "turn_question_uuid_foreign";`
    )

    this.addSql(
      `alter table "answer" drop constraint "answer_choice_uuid_foreign";`
    )

    this.addSql(
      `alter table "question_tags" drop constraint "question_tags_tag_uuid_foreign";`
    )

    this.addSql(
      `alter table "game_tags" drop constraint "game_tags_tag_uuid_foreign";`
    )

    this.addSql(
      `alter table "game" drop constraint "game_creator_uuid_foreign";`
    )

    this.addSql(
      `alter table "participation" drop constraint "participation_user_uuid_foreign";`
    )

    this.addSql(
      `alter table "user_stats" drop constraint "user_stats_user_uuid_foreign";`
    )

    this.addSql(`alter table "turn" drop constraint "turn_game_uuid_foreign";`)

    this.addSql(
      `alter table "participation" drop constraint "participation_game_uuid_foreign";`
    )

    this.addSql(
      `alter table "game_tags" drop constraint "game_tags_game_uuid_foreign";`
    )

    this.addSql(
      `alter table "answer" drop constraint "answer_turn_uuid_foreign";`
    )

    this.addSql(
      `alter table "answer" drop constraint "answer_participation_uuid_foreign";`
    )

    this.addSql(`drop table if exists "asset" cascade;`)

    this.addSql(`drop table if exists "item" cascade;`)

    this.addSql(`drop table if exists "question" cascade;`)

    this.addSql(`drop table if exists "choice" cascade;`)

    this.addSql(`drop table if exists "tag" cascade;`)

    this.addSql(`drop table if exists "question_tags" cascade;`)

    this.addSql(`drop table if exists "user" cascade;`)

    this.addSql(`drop table if exists "game" cascade;`)

    this.addSql(`drop table if exists "turn" cascade;`)

    this.addSql(`drop table if exists "participation" cascade;`)

    this.addSql(`drop table if exists "answer" cascade;`)

    this.addSql(`drop table if exists "game_tags" cascade;`)

    this.addSql(`drop table if exists "user_stats" cascade;`)
  }
}
