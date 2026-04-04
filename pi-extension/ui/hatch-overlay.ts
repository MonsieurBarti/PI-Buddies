import type { ExtensionContext } from "@mariozechner/pi-coding-agent";
import type { Box } from "@mariozechner/pi-tui";
import type { EvolutionStageValue } from "../../src/hexagons/buddy/domain/evolution.value-object.js";
import type { SpeciesName } from "../../src/hexagons/buddy/domain/species.value-object.js";
import {
  type BuddyVisual,
  detectImageSupport,
  renderBuddyCard,
  renderHatchingSelection,
} from "./buddy-renderer.js";
import {
  type ImageResolutionResult,
  formatImageResult,
  getHatchPreviewImage,
  hasBuddyImages,
  resolveBuddyImage,
} from "./image-resolver.js";

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
    // For now, just show notifications since full TUI overlay needs proper factory format
    // TODO: Implement proper ctx.ui.custom() factory when PI TUI API is confirmed
    ctx.ui.notify("🐣 Hatching... Choose your companion:", "info");

    // Check for custom images
    const hasImages = hasBuddyImages();
    if (hasImages) {
      ctx.ui.notify("🖼️ Custom buddy images enabled (~/Downloads/pi-buddies/)", "info");
    }

    // Show each option with image info
    options.forEach((opt, i) => {
      const species = opt.species as SpeciesName;
      const imgResult = getHatchPreviewImage(species, opt.shiny);
      const display = formatImageResult(imgResult);
      const shinyText = opt.shiny ? "✨ " : "";
      const fallbackText = imgResult.fallbackStage ? ` [using ${imgResult.fallbackStage}]` : "";

      ctx.ui.notify(
        `Option ${i + 1}: ${shinyText}${opt.species} (${opt.rarity}) — ${display}${fallbackText}`,
        "info",
      );
    });

    // Show options with delay to let user see all 3
    // TODO: Replace with actual user selection when TUI overlay is ready
    const SELECTION_DELAY_MS = 15000; // 15 seconds to review options

    ctx.ui.notify(`⏳ Auto-selecting first buddy in ${SELECTION_DELAY_MS / 1000}s...`, "info");

    // Default to first option after delay
    setTimeout(() => resolve(options[0] ?? null), SELECTION_DELAY_MS);
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
