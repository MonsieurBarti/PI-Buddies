import type { ExtensionContext } from "@mariozechner/pi-coding-agent";
import type { Buddy } from "../../src/hexagons/buddy/domain/buddy.entity.js";
import { HatchBuddiesUseCase } from "../../src/hexagons/buddy/use-cases/hatch-buddies.use-case.js";
import { saveBuddyState } from "../state/buddy-storage.js";
import { createHatchOptions, showHatchingOverlay } from "../ui/hatch-overlay.js";

/**
 * Hatch Command Handler
 * Generates 3 buddies and handles selection
 */

export async function handleHatch(
  ctx: ExtensionContext,
  userId: string,
  pi: { appendEntry: (type: string, data: unknown) => void },
): Promise<Buddy | null> {
  console.error("[PI-Buddy] handleHatch called");
  // Generate 3 buddy options
  const useCase = new HatchBuddiesUseCase();
  const result = useCase.execute({ userId, count: 3 });
  console.error(`[PI-Buddy] Generated ${result.options.length} buddies`);

  // Show hatching UI (selection overlay)
  const options = result.options.map((opt) => ({
    index: opt.index,
    species: opt.preview.species,
    rarity: opt.preview.rarity,
    shiny: opt.preview.shiny,
    description: opt.preview.description,
    buddy: opt.buddy,
  }));

  console.error("[PI-Buddy] Calling showHatchingOverlay...");
  const selected = await showHatchingOverlay(ctx, options);
  console.error(`[PI-Buddy] Selected: ${selected?.species ?? "null"}`);

  if (!selected) {
    ctx.ui.notify("Hatching cancelled.", "info");
    return null;
  }

  // Get the selected buddy
  const selectedOption = result.options.find((opt) => opt.index === selected.index);
  if (!selectedOption) {
    ctx.ui.notify("Error selecting buddy.", "error");
    return null;
  }

  // Save to state
  saveBuddyState(pi, selectedOption.buddy);

  // Notify user
  const shinyText = selectedOption.preview.shiny ? "✨ " : "";
  ctx.ui.notify(
    `🐣 Hatched ${shinyText}${selectedOption.preview.species} (${selectedOption.preview.rarity})!`,
    "success",
  );

  return selectedOption.buddy;
}
