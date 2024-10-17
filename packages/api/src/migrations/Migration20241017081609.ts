import { Migration } from '@mikro-orm/migrations';

export class Migration20241017081609 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`asset\` add \`deleted_at\` datetime null;`);

    this.addSql(`alter table \`question\` drop column \`asset\`;`);

    this.addSql(`alter table \`question\` add \`asset_uuid\` varchar(255) null;`);
    this.addSql(`alter table \`question\` add constraint \`question_asset_uuid_foreign\` foreign key (\`asset_uuid\`) references \`asset\` (\`uuid\`) on update cascade on delete set null;`);
    this.addSql(`alter table \`question\` add index \`question_asset_uuid_index\`(\`asset_uuid\`);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`question\` drop foreign key \`question_asset_uuid_foreign\`;`);

    this.addSql(`alter table \`asset\` drop column \`deleted_at\`;`);

    this.addSql(`alter table \`question\` drop index \`question_asset_uuid_index\`;`);
    this.addSql(`alter table \`question\` drop column \`asset_uuid\`;`);

    this.addSql(`alter table \`question\` add \`asset\` varchar(255) null;`);
  }

}
