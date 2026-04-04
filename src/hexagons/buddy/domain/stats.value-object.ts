/**
 * Stat categories for PI Buddy companions
 */
export const STAT_NAMES = ["debugging", "patience", "chaos", "wisdom", "snark"] as const;

export type StatName = (typeof STAT_NAMES)[number];

/**
 * Stat Value Object
 * Represents a single stat value with validation
 */
export class Stat {
  private constructor(
    private readonly name: StatName,
    private readonly value: number,
  ) {
    if (value < 0 || value > 100) {
      throw new Error(`Stat value must be between 0 and 100, got ${value}`);
    }
  }

  /**
   * Create a new Stat instance
   */
  static create(name: StatName, value: number): Stat {
    return new Stat(name, Math.max(0, Math.min(100, Math.floor(value))));
  }

  /**
   * Get the stat name
   */
  getName(): StatName {
    return this.name;
  }

  /**
   * Get the stat value
   */
  getValue(): number {
    return this.value;
  }

  /**
   * Get display label for stat
   */
  getLabel(): string {
    const labels: Record<StatName, string> = {
      debugging: "Debugging",
      patience: "Patience",
      chaos: "Chaos",
      wisdom: "Wisdom",
      snark: "Snark",
    };
    return labels[this.name];
  }

  /**
   * Serialize to JSON
   */
  toJSON(): { name: StatName; value: number } {
    return { name: this.name, value: this.value };
  }

  /**
   * Deserialize from JSON
   */
  static fromJSON(json: { name: StatName; value: number }): Stat {
    return Stat.create(json.name, json.value);
  }
}

/**
 * Stats collection for a companion
 */
export class Stats {
  private constructor(private readonly stats: Map<StatName, Stat>) {}

  /**
   * Create a new Stats collection
   */
  static create(stats: Record<StatName, number>): Stats {
    const map = new Map<StatName, Stat>();
    for (const name of STAT_NAMES) {
      map.set(name, Stat.create(name, stats[name] ?? 50));
    }
    return new Stats(map);
  }

  /**
   * Generate random stats based on rarity floor
   * One peak stat, one dump stat, rest scattered
   */
  static generate(minFloor: number, random: () => number): Stats {
    // Assign random values between floor and 100
    const baseValues: Record<StatName, number> = {
      debugging: minFloor + random() * (100 - minFloor),
      patience: minFloor + random() * (100 - minFloor),
      chaos: minFloor + random() * (100 - minFloor),
      wisdom: minFloor + random() * (100 - minFloor),
      snark: minFloor + random() * (100 - minFloor),
    };

    // Pick one peak and one dump
    const shuffled = [...STAT_NAMES].sort(() => random() - 0.5);
    const peak = shuffled[0];
    const dump = shuffled[1];

    // Boost peak, lower dump
    baseValues[peak] = Math.min(100, baseValues[peak] + 20);
    baseValues[dump] = Math.max(minFloor, baseValues[dump] - 20);

    return Stats.create(baseValues);
  }

  /**
   * Get a specific stat
   */
  getStat(name: StatName): Stat {
    const stat = this.stats.get(name);
    if (!stat) {
      throw new Error(`Stat ${name} not found`);
    }
    return stat;
  }

  /**
   * Get all stats
   */
  getAllStats(): Stat[] {
    return STAT_NAMES.map((name) => this.getStat(name));
  }

  /**
   * Get the peak (highest) stat
   */
  getPeakStat(): Stat {
    return this.getAllStats().reduce((peak, stat) =>
      stat.getValue() > peak.getValue() ? stat : peak,
    );
  }

  /**
   * Get the dump (lowest) stat
   */
  getDumpStat(): Stat {
    return this.getAllStats().reduce((dump, stat) =>
      stat.getValue() < dump.getValue() ? stat : dump,
    );
  }

  /**
   * Calculate total stats
   */
  getTotal(): number {
    return this.getAllStats().reduce((sum, stat) => sum + stat.getValue(), 0);
  }

  /**
   * Calculate average stat
   */
  getAverage(): number {
    return this.getTotal() / STAT_NAMES.length;
  }

  /**
   * Serialize to JSON
   */
  toJSON(): Record<StatName, number> {
    const result = {} as Record<StatName, number>;
    for (const name of STAT_NAMES) {
      result[name] = this.getStat(name).getValue();
    }
    return result;
  }

  /**
   * Deserialize from JSON
   */
  static fromJSON(json: Record<StatName, number>): Stats {
    return Stats.create(json);
  }
}
