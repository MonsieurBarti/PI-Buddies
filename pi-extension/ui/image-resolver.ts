import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { EvolutionStageValue } from "../../src/hexagons/buddy/domain/evolution.value-object.js";
import type { SpeciesName } from "../../src/hexagons/buddy/domain/species.value-object.js";

/**
 * Multi-Stage Image Resolver for PI Buddies
 *
 * File Structure:
 * ~/Downloads/pi-buddies/
 *   ├── Blob/
 *   │   ├── egg.png
 *   │   ├── baby.png
 *   │   ├── child.png
 *   │   ├── teen.png
 *   │   ├── adult.png
 *   │   ├── elder.png
 *   │   └── ascended.png
 *   └── ...
 *
 * Features:
 * - Per-species folders with stage-based files
 * - Shiny effects are runtime-only (gold tint, sparkles, glow)
 * - Automatic fallback to nearest available stage
 * - Debug info for missing assets
 */

const BASE_IMAGE_DIR = join(homedir(), "Downloads", "pi-buddies");

const VALID_STAGES: EvolutionStageValue[] = [
  "egg",
  "baby",
  "child",
  "teen",
  "adult",
  "elder",
  "ascended",
];

const VALID_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif", ".webp"];

/**
 * Result of an image resolution attempt
 */
export interface ImageResolutionResult {
  /** Full path to image if found */
  path: string | null;
  /** Whether image was found */
  found: boolean;
  /** Requested species */
  species: SpeciesName;
  /** Requested stage */
  stage: EvolutionStageValue;
  /** Whether shiny effects should be applied */
  isShiny: boolean;
  /** Fallback stage used if requested not found */
  fallbackStage: EvolutionStageValue | null;
  /** All paths searched */
  searched: string[];
  /** Error message if applicable */
  error?: string;
}

/**
 * Shiny effect configuration for runtime application
 */
export interface ShinyEffectConfig {
  /** Apply gold tint overlay */
  applyGoldTint: boolean;
  /** Gold tint opacity (0-1) */
  goldTintOpacity: number;
  /** Gold tint hex color */
  goldTintColor: string;
  /** Add sparkle particles */
  addSparkles: boolean;
  /** Sparkle frequency (ms between sparkles) */
  sparkleFrequencyMs: number;
  /** Add glow bloom effect */
  addGlow: boolean;
  /** Glow intensity (0-1) */
  glowIntensity: number;
  /** Glow color */
  glowColor: string;
  /** Star-shaped pupils (for baby/child) */
  starPupils: boolean;
  /** Pulsing aura animation */
  pulseAura: boolean;
  /** Pulse speed in ms */
  pulseSpeedMs: number;
}

/**
 * Get shiny effect config based on evolution stage
 */
export function getShinyConfig(stage: EvolutionStageValue): ShinyEffectConfig {
  const baseConfig: ShinyEffectConfig = {
    applyGoldTint: true,
    goldTintOpacity: 0.3,
    goldTintColor: "#FFD700",
    addSparkles: true,
    sparkleFrequencyMs: 2000,
    addGlow: false,
    glowIntensity: 0,
    glowColor: "#FFD700",
    starPupils: false,
    pulseAura: true,
    pulseSpeedMs: 1500,
  };

  switch (stage) {
    case "egg":
      return {
        ...baseConfig,
        addGlow: true,
        glowIntensity: 0.4,
        sparkleFrequencyMs: 3000, // Slower, subtler
      };

    case "baby":
      return {
        ...baseConfig,
        starPupils: true,
        goldTintOpacity: 0.25,
        addGlow: true,
        glowIntensity: 0.3,
      };

    case "child":
      return {
        ...baseConfig,
        goldTintOpacity: 0.3,
        sparkleFrequencyMs: 1500, // More playful
      };

    case "teen":
      return {
        ...baseConfig,
        goldTintOpacity: 0.35,
        addGlow: true,
        glowIntensity: 0.5,
        pulseSpeedMs: 1200,
      };

    case "adult":
      return {
        ...baseConfig,
        goldTintOpacity: 0.4,
        addGlow: true,
        glowIntensity: 0.6,
        pulseSpeedMs: 1000,
      };

    case "elder":
      return {
        ...baseConfig,
        goldTintOpacity: 0.35,
        goldTintColor: "#D4AF37", // Deeper gold
        addGlow: true,
        glowIntensity: 0.5,
        sparkleFrequencyMs: 2500, // Slower, more dignified
      };

    case "ascended":
      return {
        ...baseConfig,
        goldTintOpacity: 0.5,
        addGlow: true,
        glowIntensity: 0.8,
        glowColor: "#FFF8DC", // Cosmic gold
        sparkleFrequencyMs: 800, // Constant cosmic sparkles
        pulseSpeedMs: 800,
      };

    default:
      return baseConfig;
  }
}

/**
 * Get the image path for a specific species and stage
 */
export function getBuddyImagePath(species: SpeciesName, stage: EvolutionStageValue): string | null {
  const result = resolveBuddyImage(species, stage, false);
  return result.path;
}

/**
 * Check if the base image directory exists
 */
export function hasBuddyImages(): boolean {
  return existsSync(BASE_IMAGE_DIR);
}

/**
 * Check if a specific species has any images
 */
export function hasSpeciesImages(species: SpeciesName): boolean {
  const speciesDir = join(BASE_IMAGE_DIR, species);
  if (!existsSync(speciesDir)) return false;

  try {
    const files = readdirSync(speciesDir);
    return files.some((f) => VALID_EXTENSIONS.some((ext) => f.toLowerCase().endsWith(ext)));
  } catch {
    return false;
  }
}

/**
 * Get all available stages for a species
 */
export function getAvailableStages(species: SpeciesName): EvolutionStageValue[] {
  const speciesDir = join(BASE_IMAGE_DIR, species);
  if (!existsSync(speciesDir)) return [];

  try {
    const files = readdirSync(speciesDir);
    const stages: EvolutionStageValue[] = [];

    for (const file of files) {
      const lowerFile = file.toLowerCase();
      const stage = VALID_STAGES.find((s) => lowerFile.startsWith(`${s}.`));
      if (stage && !stages.includes(stage)) {
        stages.push(stage);
      }
    }

    // Return in evolution order
    return VALID_STAGES.filter((s) => stages.includes(s));
  } catch {
    return [];
  }
}

/**
 * Find nearest available stage for fallback
 * Logic: prefer same or earlier stage, then next available
 */
function findFallbackStage(
  species: SpeciesName,
  requestedStage: EvolutionStageValue,
): EvolutionStageValue | null {
  const available = getAvailableStages(species);
  if (available.length === 0) return null;

  const requestedIndex = VALID_STAGES.indexOf(requestedStage);

  // First, try to find same or earlier stage
  for (let i = requestedIndex; i >= 0; i--) {
    const stage = VALID_STAGES[i];
    if (available.includes(stage)) return stage;
  }

  // Then, try next stages forward
  for (let i = requestedIndex + 1; i < VALID_STAGES.length; i++) {
    const stage = VALID_STAGES[i];
    if (available.includes(stage)) return stage;
  }

  return null;
}

/**
 * Resolve image with full details and fallback support
 */
export function resolveBuddyImage(
  species: SpeciesName,
  stage: EvolutionStageValue,
  isShiny = false,
  allowFallback = true,
): ImageResolutionResult {
  const speciesDir = join(BASE_IMAGE_DIR, species);
  const searched: string[] = [];

  // Validate stage
  if (!VALID_STAGES.includes(stage)) {
    return {
      path: null,
      found: false,
      species,
      stage,
      isShiny,
      fallbackStage: null,
      searched,
      error: `Invalid stage: ${stage}. Valid stages: ${VALID_STAGES.join(", ")}`,
    };
  }

  // Try requested stage first
  for (const ext of VALID_EXTENSIONS) {
    const path = join(speciesDir, `${stage}${ext}`);
    searched.push(path);

    if (existsSync(path)) {
      return {
        path,
        found: true,
        species,
        stage,
        isShiny,
        fallbackStage: null,
        searched,
      };
    }
  }

  // Try fallback if allowed
  if (allowFallback) {
    const fallbackStage = findFallbackStage(species, stage);

    if (fallbackStage) {
      for (const ext of VALID_EXTENSIONS) {
        const path = join(speciesDir, `${fallbackStage}${ext}`);
        searched.push(path);

        if (existsSync(path)) {
          return {
            path,
            found: true,
            species,
            stage, // Keep original requested stage
            isShiny,
            fallbackStage,
            searched,
          };
        }
      }
    }
  }

  // Not found
  return {
    path: null,
    found: false,
    species,
    stage,
    isShiny,
    fallbackStage: null,
    searched,
    error: `No image found for ${species}/${stage}. Checked: ${searched.length} paths`,
  };
}

/**
 * Get a batch of images for all stages of a species
 * Useful for evolution animations or selection previews
 */
export function getSpeciesImageSet(
  species: SpeciesName,
  isShiny = false,
): Record<EvolutionStageValue, ImageResolutionResult> {
  const results = {} as Record<EvolutionStageValue, ImageResolutionResult>;

  for (const stage of VALID_STAGES) {
    results[stage] = resolveBuddyImage(species, stage, isShiny, true);
  }

  return results;
}

/**
 * Get image for hatch selection display
 * Uses baby stage with optional shiny preview
 */
export function getHatchPreviewImage(
  species: SpeciesName,
  isShiny: boolean,
): ImageResolutionResult {
  return resolveBuddyImage(species, "baby", isShiny, true);
}

/**
 * Get debug report of all missing images
 */
export function generateMissingImageReport(): {
  totalNeeded: number;
  totalFound: number;
  missing: Array<{ species: SpeciesName; stage: EvolutionStageValue }>;
  speciesCoverage: Record<SpeciesName, number>; // percentage
} {
  // Import species list dynamically to avoid circular deps
  const { ALL_SPECIES } = require("../../src/hexagons/buddy/domain/species.value-object.js");

  const missing: Array<{ species: SpeciesName; stage: EvolutionStageValue }> = [];
  let totalFound = 0;
  const speciesCoverage: Record<string, number> = {};

  for (const species of ALL_SPECIES as SpeciesName[]) {
    let speciesFound = 0;

    for (const stage of VALID_STAGES) {
      const result = resolveBuddyImage(species, stage, false, false);
      if (result.found) {
        totalFound++;
        speciesFound++;
      } else {
        missing.push({ species, stage });
      }
    }

    speciesCoverage[species] = Math.round((speciesFound / VALID_STAGES.length) * 100);
  }

  const totalNeeded = (ALL_SPECIES as SpeciesName[]).length * VALID_STAGES.length;

  return {
    totalNeeded,
    totalFound,
    missing,
    speciesCoverage: speciesCoverage as Record<SpeciesName, number>,
  };
}

/**
 * Format resolution result for display
 */
export function formatImageResult(result: ImageResolutionResult): string {
  if (!result.found) {
    return `❌ ${result.species}/${result.stage} — not found`;
  }

  const shinyBadge = result.isShiny ? " ✨" : "";
  const fallbackBadge = result.fallbackStage ? ` (fallback: ${result.fallbackStage})` : "";

  return `✅ ${result.species}/${result.stage}${shinyBadge}${fallbackBadge} — ${result.path}`;
}
