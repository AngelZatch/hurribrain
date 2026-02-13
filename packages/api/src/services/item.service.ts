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

    if (
      !participation.activeItem ||
      participation.statuses.some((status) => status.name === "lock")
    ) {
      return
    }

    const item = await em.findOneOrFail(Item, {
      uuid: participation.activeItem,
    })

    switch (item.name) {
      /**
       * Immediately clears all debuffs currently applied to the participant and protects them from new ones
       * until the end of the turn.
       */
      case "Shield":
        this.addStatus(participation, item)
        await this.clearCurrentDebuffs(participation)
        break

      /**
       * Immediately adds 1 point to the participant's score.
       */
      case "Coin":
        participation.score += 1
        break

      /**
       * TODO:
       * Immediately removes 2 wrong choices from the current question for the participant.
       */
      case "Half":
        this.addStatus(participation, item)
        break

      /**
       * TODO:
       * Immediately turns all debuffs into coins for the participant (1 point per debuff removed).
       */
      case "Turnaround":
        this.addStatus(participation, item)
        break

      /**
       * Immediately scrambles the words in the question and choices for a random player ranked higher
       * than the participant.
       * Stackable on the target.
       */
      case "Scramble":
        await this.attackTarget(participation, item)
        break

      /**
       * TODO:
       * Immediately removes 5 seconds from the timer for a random player ranked higher than the participant.
       * Stackable on the target.
       */
      case "Hurry":
        await this.attackTarget(participation, item)
        break

      /**
       * Immediately, if a random player ranked higher than the participant answers incorrectly, they will lose 3 points.
       * Stackable on the target.
       */
      case "Punishment":
        await this.attackTarget(participation, item)
        break

      /**
       * Immediately prevents a random player ranked higher than the participant from using their item.
       * Stackable on the target.
       */
      case "Lock":
        await this.attackTarget(participation, item)
        break

      /**
       * TODO:
       * During the turn, redirects all future attacks to another player ranked even higher.
       * Cannot be stacked.
       */
      case "Passthrough":
        this.addStatus(participation, item)
        break

      /**
       * TODO:
       * Immediately, a random player ranked higher than the participant will not be able to fully see
       * the question and choices.
       * Stackable on the target.
       */
      case "Hidden":
        await this.attackTarget(participation, item)
        break

      /**
       * For the current turn, if the participant answers correctly, the points awarded will be doubled.
       * Cannot be stacked.
       */
      case "Boost":
        this.addStatus(participation, item)
        break

      /**
       * TODO:
       * For the current turn, the participant using the item will be able to see what the others are answering.
       */
      case "Spy":
        this.addStatus(participation, item)
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

  /**
   * Removes all the debuffs currently applied to the participant.
   * @param participation
   */
  private clearCurrentDebuffs = async (participation: Participation) => {
    const em = getEntityManager()

    const debuffs = await em.find(Item, {
      isDebuff: true,
    })
    participation.statuses = participation.statuses.filter((status) => {
      return !debuffs.some((debuff) => debuff.name === status.name)
    })

    return participation
  }

  /**
   * Add a status (buff or debuff) to a participant. If the participant already has the same status,
   * its duration will be extended by one turn instead.
   * @param participation
   * @param item
   */
  private addStatus = (participation: Participation, item: Item) => {
    const existingStatus = participation.statuses.find(
      (status) => status.name === item.name
    )

    if (existingStatus) {
      existingStatus.duration += 1
    } else {
      participation.statuses.push({
        name: item.name,
        duration: 1,
      })
    }

    return participation
  }

  /**
   * Finds a random player ranked higher than the participant using the item to be the target of the item's effect.
   *
   * TODO: Implement "Shield" and "Passthrough" effects.
   * @param participation The player using the item
   * @returns
   */
  private attackTarget = async (participation: Participation, item: Item) => {
    const em = getEntityManager()

    // Random number between 1 and the rank of the participant
    const rankToTarget =
      Math.floor(Math.random() * (participation.rank - 1)) + 1

    // Find players ranked higher than the participant
    const target = await em.findOne(Participation, {
      game: { uuid: participation.game.uuid } as Game,
      rank: rankToTarget,
    })

    if (!target) {
      return null
    }

    // If the target has a shield active, the debuff isn't applied
    if (target.statuses.some((status) => status.name === "shield")) {
      return null
    }

    this.addStatus(target, item)

    // Notify target
    server.io
      .to(`game:${participation.game.uuid}`)
      .emit("participation:updated", target)

    return target
  }
}
