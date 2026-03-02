import { EntityManager } from "@mikro-orm/postgresql"
import { database } from "./../database.js"

export const getEntityManager = (): EntityManager => {
  const em = database.orm.em.fork()

  return em
}
