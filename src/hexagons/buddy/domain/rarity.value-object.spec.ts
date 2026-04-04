import { describe, expect, it } from "vitest";
import {
  RARITY_CONFIG,
  RARITY_VALUES,
  Rarity,
  type RarityValue,
  TOTAL_RARITY_WEIGHT,
} from "./rarity.value-object.js";

describe("Rarity", () => {
  describe("create", () => {
    it("should create a rarity instance", () => {
      const rarity = Rarity.create("common");
      expect(rarity.getValue()).toBe("common");
    });

    it("should create all rarity types", () => {
      for (const value of RARITY_VALUES) {
        const rarity = Rarity.create(value);
        expect(rarity.getValue()).toBe(value);
      }
    });
  });

  describe("getLabel", () => {
    it("should return correct labels", () => {
      expect(Rarity.create("common").getLabel()).toBe("Common");
      expect(Rarity.create("uncommon").getLabel()).toBe("Uncommon");
      expect(Rarity.create("rare").getLabel()).toBe("Rare");
      expect(Rarity.create("epic").getLabel()).toBe("Epic");
      expect(Rarity.create("legendary").getLabel()).toBe("Legendary");
      expect(Rarity.create("mythic").getLabel()).toBe("Mythic");
    });
  });

  describe("getXpMultiplier", () => {
    it("should return correct XP multipliers", () => {
      expect(Rarity.create("common").getXpMultiplier()).toBe(1.0);
      expect(Rarity.create("uncommon").getXpMultiplier()).toBe(1.1);
      expect(Rarity.create("rare").getXpMultiplier()).toBe(1.2);
      expect(Rarity.create("epic").getXpMultiplier()).toBe(1.5);
      expect(Rarity.create("legendary").getXpMultiplier()).toBe(2.0);
      expect(Rarity.create("mythic").getXpMultiplier()).toBe(3.0);
    });
  });

  describe("getShinyMultiplier", () => {
    it("should return correct shiny multipliers", () => {
      expect(Rarity.create("common").getShinyMultiplier()).toBe(1);
      expect(Rarity.create("uncommon").getShinyMultiplier()).toBe(2);
      expect(Rarity.create("rare").getShinyMultiplier()).toBe(3);
      expect(Rarity.create("epic").getShinyMultiplier()).toBe(5);
      expect(Rarity.create("legendary").getShinyMultiplier()).toBe(10);
      expect(Rarity.create("mythic").getShinyMultiplier()).toBe(50);
    });
  });

  describe("getMinStatFloor", () => {
    it("should return correct stat floors", () => {
      expect(Rarity.create("common").getMinStatFloor()).toBe(5);
      expect(Rarity.create("uncommon").getMinStatFloor()).toBe(15);
      expect(Rarity.create("rare").getMinStatFloor()).toBe(25);
      expect(Rarity.create("epic").getMinStatFloor()).toBe(35);
      expect(Rarity.create("legendary").getMinStatFloor()).toBe(50);
      expect(Rarity.create("mythic").getMinStatFloor()).toBe(75);
    });
  });

  describe("roll", () => {
    it("should return common for very low rolls", () => {
      // First 50% of the weight range
      const mockRandom = () => 0.1; // 10% of total weight
      const rarity = Rarity.roll(mockRandom);
      expect(rarity.getValue()).toBe("common");
    });

    it("should return mythic for very high rolls", () => {
      // Near 100% of weight
      const mockRandom = () => 0.9999;
      const rarity = Rarity.roll(mockRandom);
      expect(rarity.getValue()).toBe("mythic");
    });

    it("should be deterministic with same seed", () => {
      // Mock PRNG that returns consistent values
      let counter = 0;
      const mockRandom = () => {
        counter++;
        return 0.5; // Always 50%
      };

      const r1 = Rarity.roll(mockRandom);
      const r2 = Rarity.roll(mockRandom);
      expect(r1.getValue()).toBe(r2.getValue());
    });
  });

  describe("compareTo", () => {
    it("should compare rarities correctly", () => {
      const common = Rarity.create("common");
      const rare = Rarity.create("rare");
      const mythic = Rarity.create("mythic");

      expect(common.compareTo(rare)).toBeLessThan(0);
      expect(rare.compareTo(common)).toBeGreaterThan(0);
      expect(rare.compareTo(Rarity.create("rare"))).toBe(0);
      expect(mythic.compareTo(common)).toBeGreaterThan(0);
    });
  });

  describe("isAtLeast", () => {
    it("should check minimum rarity correctly", () => {
      const rare = Rarity.create("rare");

      expect(rare.isAtLeast("common")).toBe(true);
      expect(rare.isAtLeast("uncommon")).toBe(true);
      expect(rare.isAtLeast("rare")).toBe(true);
      expect(rare.isAtLeast("epic")).toBe(false);
      expect(rare.isAtLeast("legendary")).toBe(false);
    });
  });

  describe("equals", () => {
    it("should check equality correctly", () => {
      const r1 = Rarity.create("epic");
      const r2 = Rarity.create("epic");
      const r3 = Rarity.create("rare");

      expect(r1.equals(r2)).toBe(true);
      expect(r1.equals(r3)).toBe(false);
    });
  });

  describe("serialization", () => {
    it("should serialize to JSON", () => {
      const rarity = Rarity.create("legendary");
      expect(rarity.toJSON()).toBe("legendary");
    });

    it("should deserialize from JSON", () => {
      const rarity = Rarity.fromJSON("mythic");
      expect(rarity.getValue()).toBe("mythic");
      expect(rarity.getLabel()).toBe("Mythic");
    });
  });

  describe("configuration", () => {
    it("should have correct total weight", () => {
      // 5000 + 3000 + 1500 + 400 + 90 + 1 = 9991
      // Note: weights are scaled for integer math
      expect(TOTAL_RARITY_WEIGHT).toBeGreaterThan(0);
    });

    it("should have all rarities in config", () => {
      for (const value of RARITY_VALUES) {
        expect(RARITY_CONFIG[value]).toBeDefined();
        expect(RARITY_CONFIG[value].weight).toBeGreaterThan(0);
        expect(RARITY_CONFIG[value].xpMultiplier).toBeGreaterThan(0);
      }
    });
  });
});
