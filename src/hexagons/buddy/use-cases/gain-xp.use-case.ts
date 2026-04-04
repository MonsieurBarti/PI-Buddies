import type { Buddy } from "../domain/buddy.entity.js";
import type { Xp } from "../domain/xp.value-object.js";

/**
 * Gain XP Use Case
 * Awards XP to a buddy with rarity multipliers and Lucky skill
 */

export interface GainXpInput {
  buddy: Buddy;
  baseXp: number;
  luckyActive?: boolean;
}

export interface GainXpOutput {
  buddy: Buddy;
  xpGained: number;
  wasLucky: boolean;
  totalXp: number;
  evolutionTriggered: boolean;
}

export class GainXpUseCase {
  execute(input: GainXpInput): GainXpOutput {
    const { buddy, baseXp, luckyActive = false } = input;

    // Calculate rarity multiplier
    const rarityMultiplier = buddy.getRarity().getXpMultiplier();

    // Check Lucky skill (5% chance at Baby stage)
    const isLucky = luckyActive && Math.random() < 0.05;
    const luckyMultiplier = isLucky ? 2 : 1;

    // Calculate final XP
    const xpGain = Math.floor(baseXp * rarityMultiplier * luckyMultiplier);

    // Apply XP
    const previousStage = buddy.getStage().getValue();
    buddy.gainXp(xpGain);

    // Check for evolution
    const evolutionTriggered = buddy.checkEvolution();
    const newStage = buddy.getStage().getValue();

    return {
      buddy,
      xpGained: xpGain,
      wasLucky: isLucky,
      totalXp: buddy.getXp(),
      evolutionTriggered,
    };
  }
}
