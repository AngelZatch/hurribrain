import { MikroORM, Options } from "@mikro-orm/postgresql"

export const database = {} as {
  orm: MikroORM
}

export const initializeDatabase = async (ormConfig: Options) => {
  database.orm = await MikroORM.init(ormConfig)
}
