/**
 * Random Provider Port
 * Abstract interface for random number generation
 * Allows deterministic generation via seeding
 */
export interface RandomProvider {
  /**
   * Generate a random number between 0 and 1
   */
  random(): number;

  /**
   * Generate a random integer between min (inclusive) and max (exclusive)
   */
  randomInt(min: number, max: number): number;

  /**
   * Pick a random element from an array
   */
  pick<T>(array: readonly T[]): T;

  /**
   * Get the seed used to initialize this provider
   */
  getSeed(): number;
}
