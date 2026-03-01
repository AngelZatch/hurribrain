import { Item, Participation } from "@/api/play.api";

/**
 * Looks for a specific status in a player.
 * @param participation The player
 * @param item The item to look for
 * @returns A boolean for the presence of the status
 */
export function hasStatus(participation: Participation, item: string): boolean {
  if (!participation.statuses) return false;
  return participation.statuses.some((status) => status.name === item);
}