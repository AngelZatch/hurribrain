import { Migrator } from "@mikro-orm/migrations"
import { PostgreSqlDriver, Options } from "@mikro-orm/postgresql"
import { TsMorphMetadataProvider } from "@mikro-orm/reflection"
import { SeedManager } from "@mikro-orm/seeder"

export function getOrmConfig(): Options {
  return {
    user: "neuron",
    password: "synapse",
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5432,
    dbName: "hurribrain",
    entities: ["./dist/entities"],
    entitiesTs: ["./src/entities"],
    baseDir: process.cwd(),
    metadataProvider: TsMorphMetadataProvider,
    debug: true,
    driver: PostgreSqlDriver,
    migrations: {
      path: "./dist/migrations",
      pathTs: "./src/migrations",
    },
    extensions: [Migrator, SeedManager],
  }
}

export default getOrmConfig
