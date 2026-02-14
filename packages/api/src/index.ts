import { initializeDatabase } from "./database.js"
import { getOrmConfig } from "./mikro-orm.config.js"
import { server, initializeServer } from "./server.js"
import SyncService from "./services/sync.service.js"
const PORT = 8080

;(async () => {
  try {
    const ormConfig = getOrmConfig()
    await initializeDatabase(ormConfig)
    // If dev, migrate and seed database

    await initializeServer()

    // Init game worker
    const syncService = new SyncService()
    syncService.listen()

    await server.listen({ host: "127.0.0.1", port: PORT })
    console.log(`Server is running at http://localhost:${PORT}`)
  } catch (err) {
    console.error(err)
    server.log.error(err)
    process.exit(1)
  }
})()
