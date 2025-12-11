import { EntityData, EntityManager } from "@mikro-orm/core"
import { Seeder } from "@mikro-orm/seeder"
import { Item, ItemType } from "./../entities/item.entity.js"
import { ItemFactory } from "./../factories/item.factory.js"

export class ItemSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const items: Array<EntityData<Item>> = [
      {
        name: "Scramble",
        type: ItemType.ATTACK,
        description:
          "Makes everything harder to read for a random player ranked higher than you.",
      },
      {
        name: "Hurry",
        type: ItemType.ATTACK,
        description:
          "Removes 3 seconds off the timer of a random player ranked higher than you.",
      },
      {
        name: "Punishment",
        type: ItemType.ATTACK,
        description:
          "If a player ranked higher than you answers incorrectly, they will lose 3 points",
      },
      {
        name: "Lock",
        type: ItemType.ATTACK,
        description:
          "Prevents a random player ranked higher than you from using their power up for the next 2 turns.",
      },
      {
        name: "Turnaround",
        type: ItemType.DEFENSE,
        description:
          "Will transform the next attack aimed at you into a random bonus.",
      },
      {
        name: "Passthrough",
        type: ItemType.DEFENSE,
        description:
          "Redirects the next attack aimed at you to a random player ranked higher than you.",
      },
      {
        name: "Hidden",
        type: ItemType.ATTACK,
        description:
          "Hides parts of the question and answers for a random player ranked higher than you.",
      },
      {
        name: "Half",
        type: ItemType.SUPPORT,
        description:
          "Removes two wrong choices from the next question for you.",
      },
      {
        name: "Spy",
        type: ItemType.SUPPORT,
        description: "Shows what others are answering for the next question.",
      },
      {
        name: "Boost",
        type: ItemType.SUPPORT,
        description: "If you answer correctly, you will gain double points.",
      },
      {
        name: "Shield",
        type: ItemType.DEFENSE,
        description:
          "Removes any negative effect currently applied to you and negates the next attack.",
      },
      {
        name: "Coin",
        type: ItemType.SUPPORT,
        description: "Gives you 1 extra point at the end of the turn.",
      },
    ]

    await new ItemFactory(em).create(items.length, ...items)
  }
}
