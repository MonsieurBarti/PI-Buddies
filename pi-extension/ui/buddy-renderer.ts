import { Box, Image, SelectList, Text } from "@mariozechner/pi-tui";

/**
 * Hybrid Buddy Renderer
 * Uses actual images when terminal supports it (Kitty/iTerm2),
 * falls back to Unicode blocks for legacy terminals
 */

export interface BuddyVisual {
  species: string;
  rarity: string;
  shiny: boolean;
  stage: string;
}

/**
 * Detect if terminal supports inline images
 */
export function detectImageSupport(): {
  kitty: boolean;
  iterm2: boolean;
  sixel: boolean;
} {
  const term = process.env.TERM || "";
  const termProgram = process.env.TERM_PROGRAM || "";
  const kittyWindowId = process.env.KITTY_WINDOW_ID;

  return {
    kitty: !!kittyWindowId || term.includes("kitty"),
    iterm2: termProgram === "iTerm.app" || term.includes("iterm"),
    sixel: term.includes("sixel") || term.includes("mlterm"),
  };
}

/**
 * Render a buddy card
 * Uses Image component for supported terminals, Unicode blocks for others
 */
export function renderBuddyCard(buddy: BuddyVisual, selected: boolean, width = 16): Box {
  const imageSupport = detectImageSupport();

  if (imageSupport.kitty || imageSupport.iterm2 || imageSupport.sixel) {
    // Modern terminal - use pixel art image
    return renderImageCard(buddy, selected, width);
  }

  // Legacy terminal - use Unicode blocks
  return renderBlockCard(buddy, selected, width);
}

/**
 * Render card with actual image (Kitty/iTerm2/Sixel)
 */
function renderImageCard(buddy: BuddyVisual, selected: boolean, width: number): Box {
  // Generate or load pixel art image for species
  // Images stored in pi-extension/assets/buddies/{species}-{stage}.png
  const imagePath = `./assets/buddies/${buddy.species.toLowerCase()}-${buddy.stage}.png`;

  const card = new Box({
    width,
    border: selected ? "double" : "single",
    title: `${selected ? "▶ " : ""}${buddy.species}`,
  });

  // Add species image
  const image = new Image(imagePath, {
    width: width - 4,
    preserveAspectRatio: true,
  });
  card.addChild(image);

  // Add info
  const rarityColor = getRarityColor(buddy.rarity);
  const shinyIndicator = buddy.shiny ? " ✨" : "";
  const info = new Text(`${rarityColor}${buddy.rarity}${shinyIndicator}`);
  card.addChild(info);

  return card;
}

/**
 * Render card with Unicode blocks (fallback)
 */
function renderBlockCard(buddy: BuddyVisual, selected: boolean, width: number): Box {
  const silhouette = renderBlockSilhouette(buddy.species, buddy.stage, width - 4);

  const card = new Box({
    width,
    border: selected ? "double" : "single",
  });

  // Add silhouette lines
  for (const line of silhouette) {
    card.addChild(new Text(line));
  }

  // Add info
  const raritySymbol = getRaritySymbol(buddy.rarity);
  const shinyIndicator = buddy.shiny ? "✨" : "  ";
  card.addChild(new Text(`${shinyIndicator} ${buddy.species}`));
  card.addChild(new Text(`  ${raritySymbol} ${buddy.rarity}`));

  return card;
}

/**
 * Render 3-card selection overlay using SelectList
 */
export function renderHatchingSelection(
  buddies: BuddyVisual[],
  onSelect: (index: number) => void,
): SelectList {
  const items = buddies.map((buddy, index) => ({
    label: `${buddy.species} (${buddy.rarity})${buddy.shiny ? " ✨" : ""}`,
    value: index.toString(),
  }));

  return new SelectList({
    items,
    title: "🐣 Choose Your Companion",
    onSelect: (value) => onSelect(Number.parseInt(value)),
  });
}

/**
 * Render buddy status widget
 */
export function renderBuddyStatusWidget(buddy: BuddyVisual, xp: number, xpToNext: number): Box {
  const progress = xpToNext > 0 ? Math.round((xp / (xp + xpToNext)) * 100) : 100;
  const progressBar = "▓".repeat(progress / 10) + "░".repeat(10 - progress / 10);

  const widget = new Box({
    width: 40,
    title: "🐣 PI Buddy",
  });

  // Mini silhouette or icon
  const visual = new Text(getSpeciesIcon(buddy.species));
  widget.addChild(visual);

  // Info lines
  widget.addChild(new Text(`${buddy.buddyName || buddy.species} (${buddy.species})`));
  widget.addChild(new Text(`${buddy.rarity} | ${buddy.stage}`));
  widget.addChild(new Text(`XP: ${xp} / ${xp + xpToNext}`));
  widget.addChild(new Text(`[${progressBar}] ${progress}%`));

  return widget;
}

// Block rendering (fallback)
const BLOCKS = {
  light: "░",
  medium: "▒",
  heavy: "▓",
  solid: "█",
};

function renderBlockSilhouette(species: string, stage: string, width: number): string[] {
  const seed = species.charCodeAt(0) + species.length + stage.length;
  const height = 8;
  const lines: string[] = [];

  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      const pos = (x + y * width + seed) % 16;

      // Shape patterns per species type
      if (species === "Blob" || species === "Puff") {
        // Rounded
        const centerX = width / 2;
        const centerY = height / 2;
        const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        if (dist < 3) line += pos % 3 === 0 ? BLOCKS.light : BLOCKS.medium;
        else if (dist < 4) line += BLOCKS.light;
        else line += " ";
      } else if (species === "Spark" || species === "Wisp") {
        // Spiky
        const isSpike = (x + y) % 3 === 0;
        if (isSpike && x > 2 && x < width - 2 && y > 1 && y < height - 1) {
          line += pos % 2 === 0 ? BLOCKS.heavy : BLOCKS.solid;
        } else line += " ";
      } else {
        // Default rounded
        const centerX = width / 2;
        const distFromCenter = Math.abs(x - centerX);
        const topCurve = height / 3 + distFromCenter / 2;
        const bottomCurve = (2 * height) / 3 - distFromCenter / 3;

        if (y >= topCurve && y <= bottomCurve) {
          const density = (y - topCurve) / (bottomCurve - topCurve);
          if (density < 0.3) line += BLOCKS.light;
          else if (density < 0.6) line += BLOCKS.medium;
          else line += BLOCKS.heavy;
        } else line += " ";
      }
    }
    lines.push(line);
  }

  return lines;
}

// Helpers
function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    common: "\x1b[37m",
    uncommon: "\x1b[32m",
    rare: "\x1b[34m",
    epic: "\x1b[35m",
    legendary: "\x1b[33m",
    mythic: "\x1b[31m",
  };
  return colors[rarity.toLowerCase()] || "";
}

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

function getSpeciesIcon(species: string): string {
  const icons: Record<string, string> = {
    Blob: "🟢",
    Puff: "☁️",
    Spark: "⚡",
    Wisp: "👻",
    Glimmeron: "💎",
    Solara: "☀️",
    Abysswyrm: "🐉",
    Primordial: "🌌",
  };
  return icons[species] || "🥚";
}
