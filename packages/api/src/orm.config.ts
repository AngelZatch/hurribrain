import { MySqlDriver, Options } from "@mikro-orm/mysql"
import { TsMorphMetadataProvider } from "@mikro-orm/reflection"

const config: Options = {
  user: "neuron",
  password: "synapse",
  host: "localhost",
  dbName: "hurribrain",
  entities: ["dist/entities/*.entity.js"],
  entitiesTs: ["src/entities/*.entities.ts"],
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  driver: MySqlDriver,
}

export default config
