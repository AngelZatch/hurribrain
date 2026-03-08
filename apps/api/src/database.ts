import { MikroORM, Options } from "@mikro-orm/postgresql"

export const database = {} as {
  orm: MikroORM
}

export const initializeDatabase = async (ormConfig: Options) => {
  database.orm = await MikroORM.init(ormConfig)
  if (process.env.NODE_ENV === "production") {
    await database.orm.migrator.up()
  }
}
