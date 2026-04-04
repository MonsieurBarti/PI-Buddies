import type { Rarity } from "./rarity.value-object.js";

/**
 * Shiny Value Object
 * Represents a companion's shiny status with probability calculations
 */
export class Shiny {
  private constructor(
    private readonly isShiny: boolean,
    private readonly rollValue: number,
  ) {}

  /**
   * Base shiny rate: 1/4096 (Pokemon-style rarity)
   */
  static readonly BASE_SHINY_RATE = 1 / 4096;
  static readonly BASE_DENOMINATOR = 4096;

  /**
   * Create a shiny status directly
   */
  static create(isShiny: boolean, rollValue: number): Shiny {
    return new Shiny(isShiny, rollValue);
  }

  /**
   * Roll for shiny status based on rarity multiplier
   */
  static roll(rarity: Rarity, random: () => number): Shiny {
    const multiplier = rarity.getShinyMultiplier();
    const threshold = Shiny.BASE_SHINY_RATE * multiplier;
    const roll = random();
    return new Shiny(roll < threshold, roll);
  }

  /**
   * Check if this companion is shiny
   */
  getIsShiny(): boolean {
    return this.isShiny;
  }

  /**
   * Get the raw roll value (for verification)
   */
  getRollValue(): number {
    return this.rollValue;
  }

  /**
   * Get the effective shiny rate for display
   */
  static getEffectiveRate(rarityMultiplier: number): string {
    const effectiveRate = Shiny.BASE_DENOMINATOR / rarityMultiplier;
    return `1/${Math.round(effectiveRate)}`;
  }

  /**
   * Serialize to JSON
   */
  toJSON(): { isShiny: boolean; rollValue: number } {
    return { isShiny: this.isShiny, rollValue: this.rollValue };
  }

  /**
   * Deserialize from JSON
   */
  static fromJSON(json: { isShiny: boolean; rollValue: number }): Shiny {
    return new Shiny(json.isShiny, json.rollValue);
  }
}
