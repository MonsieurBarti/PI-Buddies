/**
 * XP Value Object
 * Manages XP values with validation and calculations
 */
export class Xp {
  private constructor(private readonly value: number) {
    if (value < 0) {
      throw new Error("XP cannot be negative");
    }
  }

  /**
   * Create a new XP instance
   */
  static create(value: number): Xp {
    return new Xp(Math.max(0, Math.floor(value)));
  }

  /**
   * Get the XP value
   */
  getValue(): number {
    return this.value;
  }

  /**
   * Add XP
   */
  add(amount: number): Xp {
    return Xp.create(this.value + amount);
  }

  /**
   * Apply rarity multiplier to base XP
   */
  static calculateGain(baseXp: number, multiplier: number): number {
    return Math.floor(baseXp * multiplier);
  }

  /**
   * Serialize to JSON
   */
  toJSON(): number {
    return this.value;
  }

  /**
   * Deserialize from JSON
   */
  static fromJSON(json: number): Xp {
    return Xp.create(json);
  }
}
