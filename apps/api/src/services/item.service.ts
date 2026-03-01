import { ItemName } from "./../entities/item.entity.js"
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

    if (!participation.activeItem || participation.hasStatus("Lock")) {
      return
    }

    switch (participation.activeItem) {
      /**
       * Immediately clears all debuffs currently applied to the participant and protects them from new ones
       * until the end of the turn. Nullified by Super Quake
       */
      case "Shield":
        participation.addStatus(participation.activeItem)
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
       * Half: Immediately removes 2 wrong choices from the current question for the participant.
       * Hidden: During the turn, redirects all future attacks to another player ranked even higher.
       * Boost: For the current turn, if the participant answers correctly, the points awarded will be doubled.
       */
      case "Half":
      case "Hidden":
      case "Boost":
        participation.addStatus(participation.activeItem)
        break

      /**
       * Attacks
       *
       * All attacks target and random player ranked higher than the attacker.
       *
       * Scramble: Immediately scrambles the words in the question on the screen of the target.
       * Hurry: Immediately removes 5 seconds from the timer of the target.
       * Judge: If the target answers incorrectly, they will lose 3 points.
       * Lock: Prevents the target from using their item until the end of the turn.
       * Darkness: Hides the contents of one choice (it stays selectable).
       */
      case "Scramble":
      case "Hurry":
      case "Judge":
      case "Lock":
      case "Darkness":
        await this.attackTarget(participation, participation.activeItem)
        break

      /**
       * Super Attacks
       *
       * The Super Attacks behave differently:
       * - They attack EVERYONE, regardless of rank
       * - They break Shields (a player having a Shield will not get the debuff but will lose the Shield)
       *
       * Super Quake: Removes all buffs from all players
       * Super Darkness: Darkness for all players
       * Super Scramble: Scramble for all players
       */
      case "Super Quake":
      case "Super Darkness":
      case "Super Scramble":
        await this.attackEveryone(participation, participation.activeItem)
        break

      default:
        console.error("No item found that could match")
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
    const initialDebuffLength = participation.statuses.length

    participation.removeStatus([
      "Scramble",
      "Hurry",
      "Judge",
      "Lock",
      "Darkness",
    ])

    if (convertToCoins) {
      participation.score += initialDebuffLength - participation.statuses.length
    }

    return participation
  }

  /**
   * Finds a random player ranked higher than the participant using the item to be the target of the item's effect.
   *
   * @param attacker The player using the item
   * @returns
   */
  private attackTarget = async (attacker: Participation, item: ItemName) => {
    const em = getEntityManager()

    // Get all players ranked higher than the participant
    let potentialTargets = await em.find(Participation, {
      game: { uuid: attacker.game.uuid } as Game,
      rank: { $lt: attacker.rank },
    })

    // Exclude those with the "Hidden" status
    potentialTargets = potentialTargets.filter(
      (p) => !p.statuses.some((status) => status.name === "Hidden")
    )

    if (potentialTargets.length === 0) {
      return null
    }

    // Select a random target
    const target =
      potentialTargets[Math.floor(Math.random() * potentialTargets.length)]

    // If the target has an active shield, the effect is not applied
    if (target.statuses.some((status) => status.name === "Shield")) {
      return null
    }

    target.addStatus(item)

    em.persist(target)
    await em.flush()

    // Notify the target
    server.io
      .to(`game:${attacker.game.uuid}`)
      .emit("participation:updated", target)

    return target
  }

  private attackEveryone = async (attacker: Participation, item: ItemName) => {
    const em = getEntityManager()

    let potentialTargets = await em.find(Participation, {
      game: { uuid: attacker.game.uuid } as Game,
      uuid: { $ne: attacker.uuid },
    })

    // Exclude those with the "Hidden" status
    potentialTargets = potentialTargets.filter(
      (p) => !p.statuses.some((status) => status.name === "Hidden")
    )

    if (potentialTargets.length === 0) {
      return null
    }

    for (const target of potentialTargets) {
      // If item is super, the Shield is nullified but the debuffs are not applied
      if (
        item === "Super Darkness" ||
        item === "Super Quake" ||
        item === "Super Scramble"
      ) {
        if (target.hasStatus("Shield")) {
          target.removeStatus(["Shield"])
        } else {
          if (item === "Super Darkness") {
            target.addStatus("Darkness")
          }
          if (item === "Super Scramble") {
            target.addStatus("Scramble")
          }
          if (item === "Super Quake") {
            target.removeStatus(["Boost", "Half"])
          }
        }
      }

      em.persist(target)

      // Notify the target
      server.io
        .to(`game:${attacker.game.uuid}`)
        .emit("participation:updated", target)
    }

    await em.flush()

    return true
  }
}
