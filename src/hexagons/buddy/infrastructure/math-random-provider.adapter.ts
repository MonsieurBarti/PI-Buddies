import type { RandomProvider } from "../domain/ports/random-provider.port.js";

/**
 * Mulberry32 PRNG implementation
 * Fast, seedable random number generator
 * Reference: https://github.com/bryc/code/blob/master/jshash/PRNGs.md#mulberry32
 */
export class Mulberry32Provider implements RandomProvider {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0; // Ensure unsigned 32-bit
  }

  /**
   * Generate next random number (0 to 1)
   */
  random(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generate random integer between min (inclusive) and max (exclusive)
   */
  randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min)) + min;
  }

  /**
   * Pick a random element from array
   */
  pick<T>(array: readonly T[]): T {
    return array[this.randomInt(0, array.length)];
  }

  /**
   * Get the original seed
   */
  getSeed(): number {
    return this.state - 0x6d2b79f5; // Reverse the initial addition
  }
}

/**
 * Hash a string to a 32-bit number
 * Uses FNV-1a algorithm for good distribution
 */
export function hashString(str: string): number {
  let hash = 2166136261; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619); // FNV prime
  }
  return hash >>> 0; // Ensure unsigned
}

/**
 * Create a deterministic random provider from a user ID
 */
export function createDeterministicProvider(userId: string): RandomProvider {
  const seed = hashString(userId);
  return new Mulberry32Provider(seed);
}
