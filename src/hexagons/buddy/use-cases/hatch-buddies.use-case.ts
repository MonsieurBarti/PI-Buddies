import { Buddy } from "../domain/buddy.entity.js";
import type { RandomProvider } from "../domain/ports/random-provider.port.js";
import { createDeterministicProvider } from "../infrastructure/math-random-provider.adapter.js";

/**
 * Input for hatching buddies
 */
export interface HatchBuddiesInput {
  userId: string;
  count: number; // Typically 3 for selection UI
  randomProvider?: RandomProvider; // Optional, will create if not provided
}

/**
 * A generated buddy option for hatching
 */
export interface BuddyOption {
  index: number;
  buddy: Buddy;
  preview: {
    species: string;
    rarity: string;
    shiny: boolean;
    description: string;
    personalityTraits: string[];
  };
}

/**
 * Output from hatching
 */
export interface HatchBuddiesOutput {
  options: BuddyOption[];
  userId: string;
}

/**
 * Hatch Buddies Use Case
 * Generates multiple buddy options for the user to choose from
 * Each option is deterministically generated from the userId + index
 */
export class HatchBuddiesUseCase {
  execute(input: HatchBuddiesInput): HatchBuddiesOutput {
    const { userId, count } = input;

    const options: BuddyOption[] = [];

    for (let i = 0; i < count; i++) {
      // Each option gets a slightly different seed based on index
      // This ensures 3 different buddies from same userId
      const optionSeed = `${userId}:option:${i}`;
      const optionRandom = createDeterministicProvider(optionSeed);

      // Generate bones deterministically
      const bones = Buddy.generateBones(optionSeed, optionRandom);

      // Create soul with default values (user can rename later)
      const soul = {
        name: `${bones.species.getName()} ${i + 1}`, // Default name
        personality: this.generatePersonality(bones.species.getPersonalityTraits()),
        hatchedAt: new Date().toISOString(),
        hatchedByUserId: userId,
      };

      const buddy = Buddy.create(bones, soul);

      options.push({
        index: i,
        buddy,
        preview: {
          species: bones.species.getName(),
          rarity: bones.rarity.getLabel(),
          shiny: bones.shiny.getIsShiny(),
          description: bones.species.getDescription(),
          personalityTraits: bones.species.getPersonalityTraits(),
        },
      });
    }

    return {
      options,
      userId,
    };
  }

  private generatePersonality(traits: string[]): string {
    if (traits.length === 0) return "friendly";
    return traits.join(", ");
  }
}
