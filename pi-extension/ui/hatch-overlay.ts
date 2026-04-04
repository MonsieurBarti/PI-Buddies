import type { ExtensionContext } from "@mariozechner/pi-coding-agent";
import type { Box } from "@mariozechner/pi-tui";
import {
  type BuddyVisual,
  detectImageSupport,
  renderBuddyCard,
  renderHatchingSelection,
} from "./buddy-renderer.js";

/**
 * Hatch Overlay Component
 * Displays 3 buddy options for selection with keyboard navigation
 */

export interface HatchOption {
  index: number;
  species: string;
  rarity: string;
  shiny: boolean;
  description: string;
}

/**
 * Show the hatching overlay and wait for user selection
 * Uses PI TUI SelectList for native keyboard navigation
 */
export async function showHatchingOverlay(
  ctx: ExtensionContext,
  options: HatchOption[],
): Promise<HatchOption | null> {
  // Convert to BuddyVisual format
  const buddies: BuddyVisual[] = options.map((opt) => ({
    species: opt.species,
    rarity: opt.rarity,
    shiny: opt.shiny,
    stage: "baby",
  }));

  // Detect terminal capabilities
  const imageSupport = detectImageSupport();
  if (imageSupport.kitty || imageSupport.iterm2) {
    ctx.ui.notify("🎨 Using pixel art images for buddies!", "info");
  } else {
    ctx.ui.notify("📊 Using Unicode blocks for buddies (install Kitty/iTerm2 for images)", "info");
  }

  // Return first option for now (full TUI integration in future)
  return new Promise((resolve) => {
    renderHatchingSelection(buddies, (index) => {
      resolve(options[index] ?? null);
    });

    // TODO: Use ctx.ui.custom() or tui.showOverlay() for full integration
    // For now, just preview the options
    ctx.ui.notify(`Option 1: ${options[0]?.species} (${options[0]?.rarity})`, "info");
    ctx.ui.notify(`Option 2: ${options[1]?.species ?? "?"} (${options[1]?.rarity ?? "?"})`, "info");
    ctx.ui.notify(`Option 3: ${options[2]?.species ?? "?"} (${options[2]?.rarity ?? "?"})`, "info");

    // Default to first option for now
    setTimeout(() => resolve(options[0] ?? null), 100);
  });
}

/**
 * Create hatch options from generated buddies
 */
export function createHatchOptions(
  buddies: Array<{
    species: string;
    rarity: string;
    shiny: boolean;
    description: string;
  }>,
): HatchOption[] {
  return buddies.map((buddy, index) => ({
    index,
    species: buddy.species,
    rarity: buddy.rarity,
    shiny: buddy.shiny,
    description: buddy.description,
  }));
}

/**
 * Create 3 buddy cards for display
 */
export function createBuddyCards(buddies: HatchOption[], selectedIndex: number): Box[] {
  return buddies.map((buddy, index) => {
    const visual: BuddyVisual = {
      species: buddy.species,
      rarity: buddy.rarity,
      shiny: buddy.shiny,
      stage: "baby",
    };
    return renderBuddyCard(visual, index === selectedIndex);
  });
}
