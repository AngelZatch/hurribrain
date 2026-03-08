import { initializeDatabase } from "./database.js"
import { getOrmConfig } from "./mikro-orm.config.js"
import { server, initializeServer } from "./server.js"
import SyncService from "./services/sync.service.js"
const PORT = process.env.PORT ?? 8080
const HOST = process.env.HOST ?? "0.0.0.0"

;(async () => {
  try {
    const ormConfig = getOrmConfig()
    await initializeDatabase(ormConfig)
    await initializeServer()

    // Init game worker
    const syncService = new SyncService()
    syncService.listen()

    await server.listen({ host: HOST, port: Number(PORT) })
    console.log(`Server is running at http://${HOST}:${PORT}`)
  } catch (err) {
    console.error(err)
    server.log.error(err)
    process.exit(1)
  }
})()
