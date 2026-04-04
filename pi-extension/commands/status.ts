import type { ExtensionContext } from "@mariozechner/pi-coding-agent";
import type { StoredBuddyState } from "../state/buddy-storage.js";
import { loadBuddyState } from "../state/buddy-storage.js";
import { type BuddyVisual, renderBuddyStatusWidget } from "../ui/buddy-renderer.js";

/**
 * Status Command Handler
 * Shows current buddy status
 */

export function handleStatus(ctx: ExtensionContext): void {
  const buddy = loadBuddyState(ctx.sessionManager);

  if (!buddy) {
    ctx.ui.notify("🐣 No buddy yet! Use /buddy to hatch one.", "info");
    return;
  }

  // Convert to visual format
  const visual: BuddyVisual = {
    species: buddy.species,
    rarity: buddy.rarity,
    shiny: buddy.shiny,
    stage: buddy.stage,
  };

  // Calculate XP to next stage (simplified)
  const xpToNext = getXpToNext(buddy.stage, buddy.xp);

  // Show status widget
  const statusWidget = renderBuddyStatusWidget(visual, buddy.xp, xpToNext);
  ctx.ui.setWidget("buddy-status", [
    `✨ ${buddy.buddyName} (${buddy.species})`,
    `${buddy.rarity}${buddy.shiny ? " ✨" : ""} | ${buddy.stage}`,
    `XP: ${buddy.xp} → ${buddy.xp + xpToNext}`,
    `Skills: ${buddy.unlockedSkills.join(", ") || "None yet"}`,
  ]);

  ctx.ui.notify(`🐣 ${buddy.buddyName} is doing great!`, "success");
}

/**
 * Get XP needed for next stage (simplified)
 */
function getXpToNext(stage: string, currentXp: number): number {
  const thresholds: Record<string, number> = {
    baby: 100,
    child: 1000,
    teen: 10000,
    adult: 100000,
    elder: 1000000,
  };

  const nextThreshold = thresholds[stage] || 100;
  return Math.max(0, nextThreshold - currentXp);
}
