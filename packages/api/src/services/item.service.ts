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

    switch (participation.activeItem) {
      /**
       * Immediately clears all debuffs currently applied to the participant and protects them from new ones
       * until the end of the turn.
       */
      case "Shield":
        this.addStatus(participation, participation.activeItem)
        this.clearCurrentDebuffs(participation)
        break

      // Immediately adds 1 point to the participant's score.
      case "Coin":
        participation.score += 1
        break

      // Immediately turns all debuffs into coins for the participant (1 point per debuff removed).
      case "Turnaround":
        this.clearCurrentDebuffs(participation, true)
        break

      /**
       * Buffs
       *
       * (TODO:) Half: Immediately removes 2 wrong choices from the current question for the participant.
       * (TODO:) Passthrough: During the turn, redirects all future attacks to another player ranked even higher. (Non stack)
       * Boost: For the current turn, if the participant answers correctly, the points awarded will be doubled.
       * (TODO:) Spy: For the current turn, the participant using the item will be able to see what the others are answering.
       */
      case "Half":
      case "Passthrough":
      case "Boost":
      case "Spy":
        this.addStatus(participation, participation.activeItem)
        break

      /**
       * Attacks
       *
       * All attacks target and random player ranked higher than the attacker.
       *
       * Scramble: Immediately scrambles the words in the question on the screen of the target.
       * (TODO:) Hurry: Immediately removes 5 seconds from the timer of the target.
       * Punishment: If the target answers incorrectly, they will lose 3 points.
       * Lock: Prevents the target from using their item until the end of the turn.
       * (TODO:) Hidden: Parts of the question will be hidden on the screen of the target.
       */
      case "Scramble":
      case "Hurry":
      case "Punishment":
      case "Lock":
      case "Hidden":
        await this.attackTarget(participation, participation.activeItem)
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
   * @param participation The player to cleanse
   * @param convertToCoins Add coins for each debuff removed (if the method is called by the Turnaround item)
   */
  private clearCurrentDebuffs = (
    participation: Participation,
    convertToCoins = false
  ) => {
    const debuffs = ["Scramble", "Hurry", "Punishment", "Lock", "Hidden"]
    const initialDebuffLength = participation.statuses.length

    participation.statuses = participation.statuses.filter((status) => {
      return !debuffs.some((debuff) => debuff === status.name)
    })

    if (convertToCoins) {
      participation.score += initialDebuffLength - participation.statuses.length
    }

    return participation
  }

  /**
   * Add a status (buff or debuff) to a participant. If the participant already has the same status,
   * its duration will be extended by one turn instead.
   * @param participation
   * @param item
   */
  private addStatus = (participation: Participation, item: string) => {
    const existingStatus = participation.statuses.find(
      (status) => status.name === item
    )

    if (existingStatus) {
      existingStatus.duration += 1
    } else {
      participation.statuses.push({
        name: item,
        duration: 1,
      })
    }

    return participation
  }

  /**
   * Finds a random player ranked higher than the participant using the item to be the target of the item's effect.
   *
   * TODO: Implement "Passthrough" effect.
   * @param participation The player using the item
   * @returns
   */
  private attackTarget = async (participation: Participation, item: string) => {
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
