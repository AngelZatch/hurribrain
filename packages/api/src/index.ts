import { initializeDatabase } from "./database.js"
import { getOrmConfig } from "./mikro-orm.config.js"
import { server, initializeServer } from "./server.js"
const PORT = 8080

server.get("/", async () => {
  return { hello: "world" }
})
;(async () => {
  try {
    const ormConfig = getOrmConfig()
    await initializeDatabase(ormConfig)
    // If dev, migrate and seed database

    await initializeServer()
    await server.listen({ port: PORT })
    console.log(`Server is running at http://localhost:${PORT}`)
  } catch (err) {
    console.error(err)
    server.log.error(err)
    process.exit(1)
  }
})()
