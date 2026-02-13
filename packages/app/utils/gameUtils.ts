import { Item, Participation } from "@/api/play.api";

/**
 * Looks for a specific status in a player.
 * @param participation The player
 * @param item The item to look for
 * @returns A boolean for the presence of the status
 */
export function hasStatus(participation: Participation, item: Item): boolean {
  if (!participation.statuses) return false;
  return participation.statuses.some((status) => status.itemUuid === item.uuid);
}

/**
 * Shuffles letters of each word in a sentence.
 * @param sentence The sentence to scramble.
 * @returns The sentence with the words in a random order.
 */
export function scrambleSentence(sentence: string): string {
  const scrambleWord = (word: string): string => {
    const chars = word.split("");
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join("");
  };

  return sentence.split(" ").map(scrambleWord).join(" ");
}