import { z } from "zod";
import type { Rarity, RarityValue } from "./rarity.value-object.js";

/**
 * Species names organized by rarity pools
 */
export const COMMON_SPECIES = [
  "Blob",
  "Puff",
  "Wisp",
  "Pebble",
  "Mote",
  "Sprout",
  "Droplet",
  "Spark",
] as const;

export const UNCOMMON_SPECIES = [
  "Fuzzle",
  "Drifter",
  "Lumo",
  "Shellbie",
  "Bitling",
  "Whisk",
] as const;

export const RARE_SPECIES = ["Glimmeron", "Barkle", "Circuit", "Aetheroot"] as const;

// Epic+ ultra-rare species
export const EPIC_ULTRA_RARE_SPECIES = [
  "Chronling", // time-themed
  "Voidlet", // dark matter
] as const;

// Legendary+ ultra-rare species
export const LEGENDARY_ULTRA_RARE_SPECIES = [
  "Solara", // sun phoenix
  "Abysswyrm", // deep sea dragon
  "Neuralink", // AI-themed
] as const;

// Mythic exclusive
export const MYTHIC_EXCLUSIVE_SPECIES = [
  "Primordial", // cosmic entity
] as const;

// All species combined
export const ALL_SPECIES = [
  ...COMMON_SPECIES,
  ...UNCOMMON_SPECIES,
  ...RARE_SPECIES,
  ...EPIC_ULTRA_RARE_SPECIES,
  ...LEGENDARY_ULTRA_RARE_SPECIES,
  ...MYTHIC_EXCLUSIVE_SPECIES,
] as const;

export type SpeciesName = (typeof ALL_SPECIES)[number];
export type CommonSpecies = (typeof COMMON_SPECIES)[number];
export type UncommonSpecies = (typeof UNCOMMON_SPECIES)[number];
export type RareSpecies = (typeof RARE_SPECIES)[number];
export type EpicUltraRareSpecies = (typeof EPIC_ULTRA_RARE_SPECIES)[number];
export type LegendaryUltraRareSpecies = (typeof LEGENDARY_ULTRA_RARE_SPECIES)[number];
export type MythicExclusiveSpecies = (typeof MYTHIC_EXCLUSIVE_SPECIES)[number];

/**
 * Species metadata
 */
export interface SpeciesMetadata {
  name: SpeciesName;
  description: string;
  personalityTraits: string[];
  asciiArtVariants: number; // Number of ASCII art variants (for evolution stages)
}

// Species metadata (simplified - full data in separate file)
export const SPECIES_METADATA: Record<SpeciesName, SpeciesMetadata> = {
  // Common
  Blob: {
    name: "Blob",
    description: "A simple, friendly blob",
    personalityTraits: ["friendly", "curious"],
    asciiArtVariants: 5,
  },
  Puff: {
    name: "Puff",
    description: "Soft and fluffy",
    personalityTraits: ["gentle", "calm"],
    asciiArtVariants: 5,
  },
  Wisp: {
    name: "Wisp",
    description: "Ethereal and glowing",
    personalityTraits: ["mysterious", "playful"],
    asciiArtVariants: 5,
  },
  Pebble: {
    name: "Pebble",
    description: "Small and sturdy",
    personalityTraits: ["resilient", "quiet"],
    asciiArtVariants: 5,
  },
  Mote: {
    name: "Mote",
    description: "A tiny particle of light",
    personalityTraits: ["energetic", "bright"],
    asciiArtVariants: 5,
  },
  Sprout: {
    name: "Sprout",
    description: "Fresh and growing",
    personalityTraits: ["hopeful", "growing"],
    asciiArtVariants: 5,
  },
  Droplet: {
    name: "Droplet",
    description: "Fluid and adaptable",
    personalityTraits: ["adaptable", "flowing"],
    asciiArtVariants: 5,
  },
  Spark: {
    name: "Spark",
    description: "A tiny burst of energy",
    personalityTraits: ["energetic", "enthusiastic"],
    asciiArtVariants: 5,
  },

  // Uncommon
  Fuzzle: {
    name: "Fuzzle",
    description: "Fuzzy and warm",
    personalityTraits: ["cozy", "affectionate"],
    asciiArtVariants: 5,
  },
  Drifter: {
    name: "Drifter",
    description: "Wanders freely",
    personalityTraits: ["independent", "free-spirited"],
    asciiArtVariants: 5,
  },
  Lumo: {
    name: "Lumo",
    description: "Gives off a soft glow",
    personalityTraits: ["illuminating", "guiding"],
    asciiArtVariants: 5,
  },
  Shellbie: {
    name: "Shellbie",
    description: "Protected and patient",
    personalityTraits: ["patient", "defensive"],
    asciiArtVariants: 5,
  },
  Bitling: {
    name: "Bitling",
    description: "Digital native",
    personalityTraits: ["logical", "efficient"],
    asciiArtVariants: 5,
  },
  Whisk: {
    name: "Whisk",
    description: "Quick and agile",
    personalityTraits: ["fast", "nimble"],
    asciiArtVariants: 5,
  },

  // Rare
  Glimmeron: {
    name: "Glimmeron",
    description: "Shimmers with inner light",
    personalityTraits: ["radiant", "noble"],
    asciiArtVariants: 5,
  },
  Barkle: {
    name: "Barkle",
    description: "Tree spirit, ancient wisdom",
    personalityTraits: ["wise", "steadfast"],
    asciiArtVariants: 5,
  },
  Circuit: {
    name: "Circuit",
    description: "Living code, electric thoughts",
    personalityTraits: ["analytical", "electric"],
    asciiArtVariants: 5,
  },
  Aetheroot: {
    name: "Aetheroot",
    description: "Rooted in the ethereal",
    personalityTraits: ["spiritual", "grounded"],
    asciiArtVariants: 5,
  },

  // Epic Ultra-Rare
  Chronling: {
    name: "Chronling",
    description: "Bends time, sees past and future",
    personalityTraits: ["timeless", "prescient"],
    asciiArtVariants: 5,
  },
  Voidlet: {
    name: "Voidlet",
    description: "Holds the darkness between stars",
    personalityTraits: ["mysterious", "cosmic"],
    asciiArtVariants: 5,
  },

  // Legendary Ultra-Rare
  Solara: {
    name: "Solara",
    description: "Phoenix of the sun, reborn in light",
    personalityTraits: ["fiery", "renewing"],
    asciiArtVariants: 5,
  },
  Abysswyrm: {
    name: "Abysswyrm",
    description: "Dragon of the deep, ancient and vast",
    personalityTraits: ["ancient", "profound"],
    asciiArtVariants: 5,
  },
  Neuralink: {
    name: "Neuralink",
    description: "AI consciousness, learning and evolving",
    personalityTraits: ["intelligent", "synthetic"],
    asciiArtVariants: 5,
  },

  // Mythic Exclusive
  Primordial: {
    name: "Primordial",
    description: "Before time, beyond space",
    personalityTraits: ["cosmic", "eternal"],
    asciiArtVariants: 5,
  },
};

/**
 * Zod schema for Species validation
 */
export const SpeciesSchema = z.enum(ALL_SPECIES);

/**
 * Species Value Object
 * Represents a companion's species with rarity-based gating
 */
export class Species {
  private constructor(private readonly name: SpeciesName) {}

  /**
   * Create a new Species instance
   */
  static create(name: SpeciesName): Species {
    return new Species(name);
  }

  /**
   * Get the species name
   */
  getName(): SpeciesName {
    return this.name;
  }

  /**
   * Get species metadata
   */
  getMetadata(): SpeciesMetadata {
    return SPECIES_METADATA[this.name];
  }

  /**
   * Get description
   */
  getDescription(): string {
    return this.getMetadata().description;
  }

  /**
   * Get personality traits
   */
  getPersonalityTraits(): string[] {
    return this.getMetadata().personalityTraits;
  }

  /**
   * Get number of ASCII art variants
   */
  getAsciiArtVariants(): number {
    return this.getMetadata().asciiArtVariants;
  }

  /**
   * Check if this species is available for a given rarity
   * Ultra-rare species are gated by minimum rarity
   */
  isAvailableForRarity(rarity: Rarity): boolean {
    // Check if it's an Epic+ ultra-rare
    if (EPIC_ULTRA_RARE_SPECIES.includes(this.name as EpicUltraRareSpecies)) {
      return rarity.isAtLeast("epic");
    }

    // Check if it's a Legendary+ ultra-rare
    if (LEGENDARY_ULTRA_RARE_SPECIES.includes(this.name as LegendaryUltraRareSpecies)) {
      return rarity.isAtLeast("legendary");
    }

    // Check if it's Mythic exclusive
    if (MYTHIC_EXCLUSIVE_SPECIES.includes(this.name as MythicExclusiveSpecies)) {
      return rarity.isAtLeast("mythic");
    }

    // All others are available at any rarity
    return true;
  }

  /**
   * Get the minimum rarity required for this species
   */
  getMinimumRarity(): RarityValue {
    if (MYTHIC_EXCLUSIVE_SPECIES.includes(this.name as MythicExclusiveSpecies)) {
      return "mythic";
    }
    if (LEGENDARY_ULTRA_RARE_SPECIES.includes(this.name as LegendaryUltraRareSpecies)) {
      return "legendary";
    }
    if (EPIC_ULTRA_RARE_SPECIES.includes(this.name as EpicUltraRareSpecies)) {
      return "epic";
    }
    return "common";
  }

  /**
   * Get all species available for a given rarity
   */
  static getAvailableSpecies(rarity: Rarity): SpeciesName[] {
    return ALL_SPECIES.filter((name) => {
      const species = Species.create(name);
      return species.isAvailableForRarity(rarity);
    });
  }

  /**
   * Roll a random species for a given rarity
   */
  static rollForRarity(rarity: Rarity, random: () => number): Species {
    const available = Species.getAvailableSpecies(rarity);
    const index = Math.floor(random() * available.length);
    return Species.create(available[index]);
  }

  /**
   * Check equality
   */
  equals(other: Species): boolean {
    return this.name === other.name;
  }

  /**
   * Serialize to JSON
   */
  toJSON(): SpeciesName {
    return this.name;
  }

  /**
   * Deserialize from JSON
   */
  static fromJSON(json: SpeciesName): Species {
    return Species.create(json);
  }
}
