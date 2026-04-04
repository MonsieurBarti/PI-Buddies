import { z } from "zod";

/**
 * Rarity tiers for PI Buddy companions
 * Each tier has a weighted probability, XP multiplier, and shiny bonus
 */
export const RARITY_VALUES = ["common", "uncommon", "rare", "epic", "legendary", "mythic"] as const;

export type RarityValue = (typeof RARITY_VALUES)[number];

/**
 * Rarity configuration with weights and multipliers
 */
export interface RarityConfig {
  weight: number; // Probability weight (out of total)
  xpMultiplier: number; // XP gain multiplier
  shinyMultiplier: number; // Shiny chance multiplier
  minStatFloor: number; // Minimum stat value floor
  label: string; // Display label
}

export const RARITY_CONFIG: Record<RarityValue, RarityConfig> = {
  common: {
    weight: 5000, // 50.00%
    xpMultiplier: 1.0,
    shinyMultiplier: 1,
    minStatFloor: 5,
    label: "Common",
  },
  uncommon: {
    weight: 3000, // 30.00%
    xpMultiplier: 1.1,
    shinyMultiplier: 2,
    minStatFloor: 15,
    label: "Uncommon",
  },
  rare: {
    weight: 1500, // 15.00%
    xpMultiplier: 1.2,
    shinyMultiplier: 3,
    minStatFloor: 25,
    label: "Rare",
  },
  epic: {
    weight: 400, // 4.00%
    xpMultiplier: 1.5,
    shinyMultiplier: 5,
    minStatFloor: 35,
    label: "Epic",
  },
  legendary: {
    weight: 10, // 0.10% (was 0.90%)
    xpMultiplier: 2.0,
    shinyMultiplier: 10,
    minStatFloor: 50,
    label: "Legendary",
  },
  mythic: {
    weight: 1, // 0.01% (was marked as 0.001% but calculated as 0.01%)
    xpMultiplier: 3.0,
    shinyMultiplier: 50,
    minStatFloor: 75,
    label: "Mythic",
  },
};

// Total weight for probability calculations
export const TOTAL_RARITY_WEIGHT = Object.values(RARITY_CONFIG).reduce(
  (sum, config) => sum + config.weight,
  0,
);

/**
 * Zod schema for Rarity validation
 */
export const RaritySchema = z.enum(RARITY_VALUES);

/**
 * Rarity Value Object
 * Immutable representation of a companion's rarity tier
 */
export class Rarity {
  private constructor(private readonly value: RarityValue) {}

  /**
   * Create a new Rarity instance
   */
  static create(value: RarityValue): Rarity {
    return new Rarity(value);
  }

  /**
   * Get the raw rarity value
   */
  getValue(): RarityValue {
    return this.value;
  }

  /**
   * Get the display label
   */
  getLabel(): string {
    return RARITY_CONFIG[this.value].label;
  }

  /**
   * Get the XP multiplier for this rarity
   */
  getXpMultiplier(): number {
    return RARITY_CONFIG[this.value].xpMultiplier;
  }

  /**
   * Get the shiny chance multiplier
   */
  getShinyMultiplier(): number {
    return RARITY_CONFIG[this.value].shinyMultiplier;
  }

  /**
   * Get the minimum stat floor
   */
  getMinStatFloor(): number {
    return RARITY_CONFIG[this.value].minStatFloor;
  }

  /**
   * Get the probability weight
   */
  getWeight(): number {
    return RARITY_CONFIG[this.value].weight;
  }

  /**
   * Roll a random rarity based on weighted probabilities
   * Uses the provided random function (0-1) for determinism
   */
  static roll(random: () => number): Rarity {
    const roll = random() * TOTAL_RARITY_WEIGHT;
    let cumulative = 0;

    for (const [rarity, config] of Object.entries(RARITY_CONFIG)) {
      cumulative += config.weight;
      if (roll < cumulative) {
        return Rarity.create(rarity as RarityValue);
      }
    }

    // Fallback (shouldn't happen with correct weights)
    return Rarity.create("common");
  }

  /**
   * Compare two rarities
   * Returns: negative if this < other, 0 if equal, positive if this > other
   */
  compareTo(other: Rarity): number {
    const order: RarityValue[] = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];
    return order.indexOf(this.value) - order.indexOf(other.value);
  }

  /**
   * Check if this rarity is at least the specified tier
   */
  isAtLeast(minRarity: RarityValue): boolean {
    return this.compareTo(Rarity.create(minRarity)) >= 0;
  }

  /**
   * Check equality
   */
  equals(other: Rarity): boolean {
    return this.value === other.value;
  }

  /**
   * Serialize to JSON
   */
  toJSON(): RarityValue {
    return this.value;
  }

  /**
   * Deserialize from JSON
   */
  static fromJSON(json: RarityValue): Rarity {
    return Rarity.create(json);
  }
}
