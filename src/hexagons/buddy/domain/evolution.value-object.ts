import { z } from "zod";

/**
 * Evolution stages for PI Buddy companions
 */
export const EVOLUTION_STAGES = [
  "egg",
  "baby",
  "child",
  "teen",
  "adult",
  "elder",
  "ascended",
] as const;

export type EvolutionStageValue = (typeof EVOLUTION_STAGES)[number];

/**
 * XP thresholds for each evolution stage
 * Uses exponential curve: XP = 100 × 10^(stage-1) for stages beyond baby
 */
export const EVOLUTION_XP_THRESHOLDS: Record<EvolutionStageValue, number> = {
  egg: 0,
  baby: 0,
  child: 100,
  teen: 1_000,
  adult: 10_000,
  elder: 100_000,
  ascended: 1_000_000,
};

/**
 * Display labels for stages
 */
export const STAGE_LABELS: Record<EvolutionStageValue, string> = {
  egg: "Egg",
  baby: "Baby",
  child: "Child",
  teen: "Teen",
  adult: "Adult",
  elder: "Elder",
  ascended: "Ascended",
};

/**
 * Zod schema for EvolutionStage validation
 */
export const EvolutionStageSchema = z.enum(EVOLUTION_STAGES);

/**
 * EvolutionStage Value Object
 * Represents a companion's current evolution stage
 */
export class EvolutionStage {
  private constructor(private readonly stage: EvolutionStageValue) {}

  /**
   * Create a new EvolutionStage instance
   */
  static create(stage: EvolutionStageValue): EvolutionStage {
    return new EvolutionStage(stage);
  }

  /**
   * Get the stage value
   */
  getValue(): EvolutionStageValue {
    return this.stage;
  }

  /**
   * Get the display label
   */
  getLabel(): string {
    return STAGE_LABELS[this.stage];
  }

  /**
   * Get XP required to reach this stage
   */
  getXpThreshold(): number {
    return EVOLUTION_XP_THRESHOLDS[this.stage];
  }

  /**
   * Get the next evolution stage (if any)
   */
  getNextStage(): EvolutionStageValue | null {
    const currentIndex = EVOLUTION_STAGES.indexOf(this.stage);
    const nextStage = EVOLUTION_STAGES[currentIndex + 1];
    return nextStage || null;
  }

  /**
   * Advance to the next stage
   */
  advance(): EvolutionStage {
    const next = this.getNextStage();
    if (!next) {
      return this; // Already at max stage
    }
    return EvolutionStage.create(next);
  }

  /**
   * Check if this stage can evolve further
   */
  canEvolve(): boolean {
    return this.getNextStage() !== null;
  }

  /**
   * Check if at maximum stage
   */
  isMaxStage(): boolean {
    return this.stage === "ascended";
  }

  /**
   * Get XP needed to reach next stage
   */
  getXpToNextStage(currentXp: number): number {
    const next = this.getNextStage();
    if (!next) return 0;
    const nextThreshold = EVOLUTION_XP_THRESHOLDS[next];
    return Math.max(0, nextThreshold - currentXp);
  }

  /**
   * Check if given XP is enough to evolve from this stage
   */
  shouldEvolve(xp: number): boolean {
    const next = this.getNextStage();
    if (!next) return false;
    return xp >= EVOLUTION_XP_THRESHOLDS[next];
  }

  /**
   * Calculate progress percentage to next stage
   */
  getProgressToNext(currentXp: number): number {
    const currentThreshold = this.getXpThreshold();
    const next = this.getNextStage();
    if (!next) return 100;

    const nextThreshold = EVOLUTION_XP_THRESHOLDS[next];
    const stageXp = currentXp - currentThreshold;
    const stageTotal = nextThreshold - currentThreshold;
    return Math.min(100, Math.max(0, (stageXp / stageTotal) * 100));
  }

  /**
   * Check if a skill is unlocked at this stage
   */
  isSkillUnlocked(skillUnlockStage: EvolutionStageValue): boolean {
    const currentIndex = EVOLUTION_STAGES.indexOf(this.stage);
    const requiredIndex = EVOLUTION_STAGES.indexOf(skillUnlockStage);
    return currentIndex >= requiredIndex;
  }

  /**
   * Compare two stages
   * Returns: negative if this < other, 0 if equal, positive if this > other
   */
  compareTo(other: EvolutionStage): number {
    return EVOLUTION_STAGES.indexOf(this.stage) - EVOLUTION_STAGES.indexOf(other.stage);
  }

  /**
   * Check if this stage is at least the specified stage
   */
  isAtLeast(minStage: EvolutionStageValue): boolean {
    return this.compareTo(EvolutionStage.create(minStage)) >= 0;
  }

  /**
   * Check equality
   */
  equals(other: EvolutionStage): boolean {
    return this.stage === other.stage;
  }

  /**
   * Serialize to JSON
   */
  toJSON(): EvolutionStageValue {
    return this.stage;
  }

  /**
   * Deserialize from JSON
   */
  static fromJSON(json: EvolutionStageValue): EvolutionStage {
    return EvolutionStage.create(json);
  }
}
