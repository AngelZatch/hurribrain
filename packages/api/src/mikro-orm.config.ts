import { Migrator } from "@mikro-orm/migrations"
import { MySqlDriver, Options } from "@mikro-orm/mysql"
import { TsMorphMetadataProvider } from "@mikro-orm/reflection"
import { SeedManager } from "@mikro-orm/seeder"

const config: Options = {
  user: "neuron",
  password: "synapse",
  host: "localhost",
  dbName: "hurribrain",
  entities: ["./dist/entities"],
  entitiesTs: ["./src/entities"],
  baseDir: process.cwd(),
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  driver: MySqlDriver,
  migrations: {
    path: "./dist/migrations",
    pathTs: "./src/migrations",
  },
  extensions: [Migrator, SeedManager],
}

export default config
