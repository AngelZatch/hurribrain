import { database, initializeDatabase } from "@src/database.js"
import { getOrmConfig } from "@src/mikro-orm.config.js"
import { initializeServer, server } from "@src/server.js"

before(async () => {
  try {
    const ormConfig = getOrmConfig()
    ormConfig.dbName = "hurribrain_test"
    await initializeDatabase(ormConfig)
    await initializeServer()
  } catch (error) {
    console.error("Error during setup", error)
  }
})

after(async () => {
  await database.orm.close(true)
  await server.close()
})
