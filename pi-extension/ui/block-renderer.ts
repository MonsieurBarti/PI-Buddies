import type { ExtensionContext } from "@mariozechner/pi-coding-agent";

/**
 * Unicode Block Renderer for PI Buddy visuals
 * Creates "pixel art" style silhouettes using Unicode blocks
 */

// Block characters for different densities
const BLOCKS = {
  light: "░",
  medium: "▒",
  heavy: "▓",
  solid: "█",
};

// Rarity color indicators (for terminal themes that support it)
export const RARITY_COLORS: Record<string, string> = {
  common: "\x1b[37m", // White
  uncommon: "\x1b[32m", // Green
  rare: "\x1b[34m", // Blue
  epic: "\x1b[35m", // Purple
  legendary: "\x1b[33m", // Yellow/Gold
  mythic: "\x1b[31m", // Red (distinctive)
};

export const RESET_COLOR = "\x1b[0m";

/**
 * Generate a species silhouette using Unicode blocks
 * Different species have different "shapes"
 */
export function renderSpeciesSilhouette(
  species: string,
  stage: string,
  width = 12,
  height = 8,
): string[] {
  // Seed-based pseudo-random for consistent shapes per species
  const seed = species.charCodeAt(0) + species.length + stage.length;

  const lines: string[] = [];

  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      // Create shape based on position and species seed
      const pos = (x + y * width + seed) % 16;

      // Different species have different shape patterns
      if (species === "Blob" || species === "Puff") {
        // Rounded shapes
        const centerX = width / 2;
        const centerY = height / 2;
        const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        if (dist < 3.5) {
          line += pos % 3 === 0 ? BLOCKS.light : BLOCKS.medium;
        } else if (dist < 4.5) {
          line += BLOCKS.light;
        } else {
          line += " ";
        }
      } else if (species === "Spark" || species === "Wisp") {
        // Spiky/star shapes
        const isSpike = (x + y) % 3 === 0 || (x - y + width) % 4 === 0;
        if (isSpike && x > 2 && x < width - 2 && y > 1 && y < height - 1) {
          line += pos % 2 === 0 ? BLOCKS.heavy : BLOCKS.solid;
        } else {
          line += " ";
        }
      } else if (species === "Solara" || species === "Glimmeron") {
        // Radiant shapes
        const centerX = width / 2;
        const centerY = height / 2;
        const angle = Math.atan2(y - centerY, x - centerX);
        const rays = Math.cos(angle * 8) > 0.5;
        if (rays || (x > 4 && x < 8 && y > 3 && y < 6)) {
          line += pos % 2 === 0 ? BLOCKS.solid : BLOCKS.heavy;
        } else {
          line += " ";
        }
      } else if (species === "Abysswyrm" || species === "Voidlet") {
        // Dark/dragon shapes
        if (y < height / 2 && x > width / 3 && x < (2 * width) / 3) {
          line += BLOCKS.solid;
        } else if (y >= height / 2 && x > width / 4 && x < (3 * width) / 4) {
          line += pos % 2 === 0 ? BLOCKS.heavy : BLOCKS.medium;
        } else {
          line += " ";
        }
      } else {
        // Default: generic creature shape
        const centerX = width / 2;
        const distFromCenter = Math.abs(x - centerX);
        const topCurve = height / 3 + distFromCenter / 2;
        const bottomCurve = (2 * height) / 3 - distFromCenter / 3;

        if (y >= topCurve && y <= bottomCurve) {
          const density = (y - topCurve) / (bottomCurve - topCurve);
          if (density < 0.3) line += BLOCKS.light;
          else if (density < 0.6) line += BLOCKS.medium;
          else line += BLOCKS.heavy;
        } else {
          line += " ";
        }
      }
    }
    lines.push(line);
  }

  return lines;
}

/**
 * Render a card for the 3-card selection UI
 */
export function renderCard(
  index: number,
  species: string,
  rarity: string,
  shiny: boolean,
  selected: boolean,
  width = 14,
): string[] {
  const silhouette = renderSpeciesSilhouette(species, "baby", width - 2, 8);

  // Card border based on selection and rarity
  const topBorder = selected ? "┌─[SELECTED]─┐" : "┌────────────┐";
  const bottomBorder = selected ? "└────────────┘" : "└────────────┘";

  const lines: string[] = [topBorder];

  // Add silhouette with padding
  for (const row of silhouette) {
    lines.push(`│${row}│`);
  }

  // Add info section
  const raritySymbol = getRaritySymbol(rarity);
  const shinyIndicator = shiny ? "✨" : "  ";
  const name = species.padEnd(10).substring(0, 10);

  lines.push(`│${shinyIndicator}${name}│`);
  lines.push(`│  ${raritySymbol} ${rarity.padEnd(8).substring(0, 8)}│`);
  lines.push(bottomBorder);

  return lines;
}

/**
 * Get a symbol for rarity
 */
function getRaritySymbol(rarity: string): string {
  const symbols: Record<string, string> = {
    common: "○",
    uncommon: "◇",
    rare: "◆",
    epic: "★",
    legendary: "☆",
    mythic: "✦",
  };
  return symbols[rarity.toLowerCase()] || "○";
}

/**
 * Render the full 3-card hatching overlay
 */
export function renderHatchingOverlay(
  cards: Array<{
    index: number;
    species: string;
    rarity: string;
    shiny: boolean;
  }>,
  selectedIndex: number,
): string[] {
  const renderedCards = cards.map((card) =>
    renderCard(card.index, card.species, card.rarity, card.shiny, card.index === selectedIndex),
  );

  // Combine cards side by side
  const maxHeight = Math.max(...renderedCards.map((c) => c.length));
  const lines: string[] = [];

  // Title
  lines.push("┌─────────────────────────────────────────────────────────────┐");
  lines.push("│  🐣  Choose Your Companion                                  │");
  lines.push("└─────────────────────────────────────────────────────────────┘");
  lines.push("");

  // Cards side by side
  for (let i = 0; i < maxHeight; i++) {
    let line = "  "; // Left margin
    for (const card of renderedCards) {
      line += `${(card[i] || "").padEnd(16)}  `;
    }
    lines.push(line);
  }

  // Instructions
  lines.push("");
  lines.push("  [←/→] Select    [Enter] Hatch    [ESC] Cancel");

  return lines;
}

/**
 * Render a status widget for the buddy
 */
export function renderBuddyStatus(
  name: string,
  species: string,
  rarity: string,
  stage: string,
  xp: number,
  xpToNext: number,
): string[] {
  const progress = xpToNext > 0 ? Math.round((xp / (xp + xpToNext)) * 100) : 100;
  const progressBar = "▓".repeat(progress / 10) + "░".repeat(10 - progress / 10);

  return [
    "┌─ 🐣 PI Buddy ─────────────────────┐",
    `│ ${name.padEnd(16)} (${species.padEnd(8)}) │`,
    `│ ${rarity.padEnd(12)} ${stage.padEnd(10)} │`,
    `│ XP: ${xp.toString().padStart(6)} / ${(xp + xpToNext).toString().padStart(6)} │`,
    `│ [${progressBar}] ${progress.toString().padStart(3)}% │`,
    "└───────────────────────────────────┘",
  ];
}
