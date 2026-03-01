import { Migration } from "@mikro-orm/migrations"

export class Migration20250115103901 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table \`game\` add \`creator_uuid\` varchar(255) not null;`
    )
    this.addSql(
      `alter table \`game\` add constraint \`game_creator_uuid_foreign\` foreign key (\`creator_uuid\`) references \`user\` (\`uuid\`) on update cascade;`
    )
    this.addSql(
      `alter table \`game\` add index \`game_creator_uuid_index\`(\`creator_uuid\`);`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table \`game\` drop foreign key \`game_creator_uuid_foreign\`;`
    )

    this.addSql(`alter table \`game\` drop index \`game_creator_uuid_index\`;`)
    this.addSql(`alter table \`game\` drop column \`creator_uuid\`;`)
  }
}
