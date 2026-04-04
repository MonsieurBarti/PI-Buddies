import { EvolutionStage, type EvolutionStageValue } from "./evolution.value-object.js";
import type { RandomProvider } from "./ports/random-provider.port.js";
import { Rarity, type RarityValue } from "./rarity.value-object.js";
import { Shiny } from "./shiny.value-object.js";
import { Species, type SpeciesName } from "./species.value-object.js";
import { Stats } from "./stats.value-object.js";
import { Xp } from "./xp.value-object.js";

/**
 * Buddy Entity - The aggregate root for PI Buddy companions
 *
 * Design: "Bones" vs "Soul" separation
 * - Bones: Regenerated from deterministic PRNG (species, rarity, stats, shiny)
 * - Soul: Persisted user-defined data (name, personality)
 * - Dynamic: Mutable state (XP, stage, skills)
 */
export interface BuddyBones {
  species: Species;
  rarity: Rarity;
  shiny: Shiny;
  stats: Stats;
}

export interface BuddySoul {
  name: string;
  personality: string;
  hatchedAt: string;
  hatchedByUserId: string; // Used as PRNG seed
}

export interface BuddyDynamic {
  xp: Xp;
  stage: EvolutionStage;
  unlockedSkills: string[];
  lastActiveAt: string;
}

export class Buddy {
  private constructor(
    private readonly bones: BuddyBones,
    private readonly soul: BuddySoul,
    private dynamic: BuddyDynamic,
  ) {}

  /**
   * Create a new Buddy from generated bones + user soul
   */
  static create(bones: BuddyBones, soul: BuddySoul, dynamic?: Partial<BuddyDynamic>): Buddy {
    const defaultDynamic: BuddyDynamic = {
      xp: Xp.create(0),
      stage: EvolutionStage.create("baby"),
      unlockedSkills: [],
      lastActiveAt: new Date().toISOString(),
    };

    return new Buddy(bones, soul, { ...defaultDynamic, ...dynamic });
  }

  /**
   * Generate deterministic bones from a user ID
   * Same user ID always generates the same potential companion
   */
  static generateBones(userId: string, random: RandomProvider): BuddyBones {
    // Roll rarity first (determines available species pool)
    const rarity = Rarity.roll(() => random.random());

    // Roll species based on rarity
    const species = Species.rollForRarity(rarity, () => random.random());

    // Roll shiny status
    const shiny = Shiny.roll(rarity, () => random.random());

    // Generate stats based on rarity floor
    const stats = Stats.generate(rarity.getMinStatFloor(), () => random.random());

    return {
      species,
      rarity,
      shiny,
      stats,
    };
  }

  // === Getters ===

  getBones(): BuddyBones {
    return this.bones;
  }

  getSoul(): BuddySoul {
    return this.soul;
  }

  getDynamic(): BuddyDynamic {
    return this.dynamic;
  }

  getSpecies(): Species {
    return this.bones.species;
  }

  getRarity(): Rarity {
    return this.bones.rarity;
  }

  getShiny(): Shiny {
    return this.bones.shiny;
  }

  getStats(): Stats {
    return this.bones.stats;
  }

  getName(): string {
    return this.soul.name;
  }

  getXp(): number {
    return this.dynamic.xp.getValue();
  }

  getStage(): EvolutionStage {
    return this.dynamic.stage;
  }

  getPersonality(): string {
    return this.soul.personality;
  }

  // === Dynamic State Updates ===

  /**
   * Add XP to the buddy
   */
  gainXp(amount: number): void {
    this.dynamic.xp = this.dynamic.xp.add(amount);
    this.touch();
  }

  /**
   * Check if buddy should evolve and perform evolution
   */
  checkEvolution(): boolean {
    if (this.dynamic.stage.shouldEvolve(this.getXp())) {
      this.dynamic.stage = this.dynamic.stage.advance();
      this.touch();
      return true;
    }
    return false;
  }

  /**
   * Unlock a skill
   */
  unlockSkill(skillId: string): void {
    if (!this.dynamic.unlockedSkills.includes(skillId)) {
      this.dynamic.unlockedSkills.push(skillId);
      this.touch();
    }
  }

  /**
   * Update last active timestamp
   */
  private touch(): void {
    this.dynamic.lastActiveAt = new Date().toISOString();
  }

  /**
   * Rename the buddy (modifies soul)
   */
  rename(newName: string): void {
    this.soul.name = newName;
    this.touch();
  }

  // === Queries ===

  /**
   * Get XP needed for next evolution stage
   */
  getXpToNextStage(): number {
    return this.dynamic.stage.getXpToNextStage(this.getXp());
  }

  /**
   * Get progress percentage to next stage
   */
  getProgressToNext(): number {
    return this.dynamic.stage.getProgressToNext(this.getXp());
  }

  /**
   * Check if buddy is shiny
   */
  isShiny(): boolean {
    return this.bones.shiny.getIsShiny();
  }

  /**
   * Get display rarity with shiny indicator
   */
  getDisplayRarity(): string {
    const base = this.bones.rarity.getLabel();
    return this.isShiny() ? `✨ ${base}` : base;
  }

  // === Serialization ===

  toJSON(): {
    bones: {
      species: SpeciesName;
      rarity: RarityValue;
      shiny: { isShiny: boolean; rollValue: number };
      stats: Record<string, number>;
    };
    soul: BuddySoul;
    dynamic: {
      xp: number;
      stage: EvolutionStageValue;
      unlockedSkills: string[];
      lastActiveAt: string;
    };
  } {
    return {
      bones: {
        species: this.bones.species.getName(),
        rarity: this.bones.rarity.getValue(),
        shiny: this.bones.shiny.toJSON(),
        stats: this.bones.stats.toJSON(),
      },
      soul: this.soul,
      dynamic: {
        xp: this.dynamic.xp.getValue(),
        stage: this.dynamic.stage.getValue(),
        unlockedSkills: this.dynamic.unlockedSkills,
        lastActiveAt: this.dynamic.lastActiveAt,
      },
    };
  }

  /**
   * Deserialize from JSON (bones are regenerated from userId for security)
   */
  static fromJSON(
    json: {
      bones: {
        species: SpeciesName;
        rarity: RarityValue;
        shiny: { isShiny: boolean; rollValue: number };
        stats: Record<string, number>;
      };
      soul: BuddySoul;
      dynamic: {
        xp: number;
        stage: EvolutionStageValue;
        unlockedSkills: string[];
        lastActiveAt: string;
      };
    },
    random: RandomProvider,
  ): Buddy {
    // Regenerate bones from seed for security (can't manipulate via JSON editing)
    const regeneratedBones = Buddy.generateBones(json.soul.hatchedByUserId, random);

    // SECURITY: Validate saved species is allowed for the regenerated rarity
    // This prevents users from editing JSON to get ultra-rare species at low rarities
    const savedSpecies = Species.create(json.bones.species);
    const species = savedSpecies.isAvailableForRarity(regeneratedBones.rarity)
      ? savedSpecies // Use saved species if valid for this rarity
      : regeneratedBones.species; // Fall back to seed-generated species if spoofed

    const bones: BuddyBones = {
      species,
      rarity: regeneratedBones.rarity,
      shiny: regeneratedBones.shiny,
      stats: Stats.fromJSON(json.bones.stats),
    };

    const dynamic: BuddyDynamic = {
      xp: Xp.fromJSON(json.dynamic.xp),
      stage: EvolutionStage.fromJSON(json.dynamic.stage),
      unlockedSkills: json.dynamic.unlockedSkills,
      lastActiveAt: json.dynamic.lastActiveAt,
    };

    return new Buddy(bones, json.soul, dynamic);
  }
}
