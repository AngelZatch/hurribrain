import { Item } from "./../entities/item.entity.js"
import { Game } from "./../entities/game.entity.js"
import { Participation } from "./../entities/participation.entity.js"
import { User } from "./../entities/user.entity.js"
import { getEntityManager } from "./../middlewares/entityManager.middleware.js"
import { server } from "./../server.js"

export default class ItemService {
  /**
   * Entrypoint method for item use
   *
   * @param userId
   * @param gameId
   * @returns
   */
  useItem = async (userId: User["uuid"], gameId: Game["uuid"]) => {
    const em = getEntityManager()

    const participation = await em.findOneOrFail(Participation, {
      user: { uuid: userId } as User,
      game: { uuid: gameId } as Game,
    })

    if (!participation.activeItem) {
      return
    }

    const item = await em.findOneOrFail(Item, {
      uuid: participation.activeItem,
    })

    switch (item.name) {
      /**
       * EFFECT:
       * - Immediately clears all debuffs currently applied to the participant.
       * - At the end of the turn, all queued debuffs will be cleared without being applied to the participant.
       */
      case "Shield":
        break

      /**
       * EFFECT:
       * - Immediately adds 1 point to the participant's score.
       */
      case "Coin":
        participation.score += 1
        break

      /**
       * EFFECT:
       * - Immediately removes 2 wrong choices from the current question for the participant.
       */
      case "Half":
        break

      /**
       * EFFECT:
       * - At the end of the turn, all queued debuffs will be turned into extra points (1 debuff = 1 extra point)
       * instead of being applied.
       */
      case "Turnaround":
        break

      /**
       * EFFECT:
       * - For the next turn, scrambles the words in the question and choices for a random player ranked higher
       * than the participant.
       * - Stackable on the target.
       */
      case "Scramble":
        break

      /**
       * EFFECT:
       * - For the next turn, removes 5 seconds from the timer for a random player ranked higher than the participant.
       * - Stackable on the target.
       */
      case "Hurry":
        break

      /**
       * EFFECT:
       * - For the next turn, if a random player ranked higher than the participant answers incorrectly, they will lose 3 points.
       * - Stackable on the target.
       */
      case "Punishment":
        break

      /**
       * EFFECT:
       * - For the next turn, a random player ranked higher than the participant will not be able to use their item.
       * - Stackable on the target.
       */
      case "Lock":
        break

      /**
       * EFFECT:
       * - For the next turn, any attack targeting the participant will be passed to another random player ranked higher.
       * - Cannot be stacked.
       */
      case "Passthrough":
        break

      /**
       * EFFECT:
       * - For the next turn, a random player ranked higher than the participant will not be able to fully see
       * the question and choices.
       * - Stackable on the target.
       */
      case "Hidden":
        break

      /**
       * EFFECT:
       * - Fur the current turn, if the participant answers correctly, the points awarded will be doubled.
       * - Cannot be stacked.
       */
      case "Boost":
        break

      /**
       * EFFECT:
       * - For the current turn, the participant using the item will be able to see what the others are answering.
       */
      case "Spy":
        break
      default:
        break
    }

    // Update the participation to remove the active item
    participation.activeItem = null
    em.persist(participation)
    await em.flush()

    // Emit updated participation to the participant
    server.io.to(`game:${gameId}`).emit("participation:updated", participation)
  }
}
