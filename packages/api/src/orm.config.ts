import { MySqlDriver, Options } from "@mikro-orm/mysql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";

const config: Options = {
  entities: ["dist/entities/*.entity.js"],
  entitiesTs: ["src/entities/*.entities.ts"],
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  dbName: "hurribrain",
  driver: MySqlDriver,
};

export default config;
