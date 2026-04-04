import type { ExtensionContext } from "@mariozechner/pi-coding-agent";
import { renderHatchingOverlay } from "./block-renderer.js";

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
 */
export async function showHatchingOverlay(
  ctx: ExtensionContext,
  options: HatchOption[],
): Promise<HatchOption | null> {
  const selectedIndex = 0;

  // Initial render
  const render = () => {
    const lines = renderHatchingOverlay(options, selectedIndex);
    // In a real implementation, this would use ctx.ui.custom()
    // For now, we return the lines for display
    return lines;
  };

  // TODO: Implement proper TUI overlay with keyboard input
  // This requires ctx.ui.custom() which provides:
  // - Keyboard event handling (arrow keys, enter, escape)
  // - Differential rendering for smooth updates
  // - Focus management

  // Placeholder: just return first option for now
  // In full implementation, this would:
  // 1. Show overlay with ctx.ui.custom()
  // 2. Handle keyboard events to move selection
  // 3. Return selected option on Enter, or null on Escape

  return options[0] || null;
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
