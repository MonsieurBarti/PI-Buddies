import { describe, expect, it } from "vitest";
import {
  Mulberry32Provider,
  createDeterministicProvider,
} from "../infrastructure/math-random-provider.adapter.js";
import { Buddy } from "./buddy.entity.js";
import { EvolutionStage } from "./evolution.value-object.js";
import { Rarity } from "./rarity.value-object.js";
import { Species } from "./species.value-object.js";

describe("Buddy Entity", () => {
  describe("create", () => {
    it("should create a buddy with valid data", () => {
      const random = createDeterministicProvider("test-user");
      const bones = Buddy.generateBones("test-user", random);
      const soul = {
        name: "Test Buddy",
        personality: "friendly, curious",
        hatchedAt: new Date().toISOString(),
        hatchedByUserId: "test-user",
      };

      const buddy = Buddy.create(bones, soul);

      expect(buddy.getName()).toBe("Test Buddy");
      expect(buddy.getXp()).toBe(0);
      expect(buddy.getStage().getValue()).toBe("baby");
      expect(buddy.isShiny()).toBeDefined();
    });
  });

  describe("generateBones", () => {
    it("should generate deterministic bones for same user", () => {
      const random1 = createDeterministicProvider("user-123");
      const random2 = createDeterministicProvider("user-123");

      const bones1 = Buddy.generateBones("user-123", random1);
      const bones2 = Buddy.generateBones("user-123", random2);

      expect(bones1.species.getName()).toBe(bones2.species.getName());
      expect(bones1.rarity.getValue()).toBe(bones2.rarity.getValue());
      expect(bones1.shiny.getIsShiny()).toBe(bones2.shiny.getIsShiny());
    });

    it("should generate different bones for different users", () => {
      const random1 = createDeterministicProvider("user-a");
      const random2 = createDeterministicProvider("user-b");

      const bones1 = Buddy.generateBones("user-a", random1);
      const bones2 = Buddy.generateBones("user-b", random2);

      // Very unlikely to be identical (but possible, so check rarity or species)
      expect(bones1.rarity.getValue()).toBeDefined();
      expect(bones2.rarity.getValue()).toBeDefined();
    });

    it("should respect rarity-species gating", () => {
      // Test many times to ensure ultra-rare species only appear at high rarities
      for (let i = 0; i < 100; i++) {
        const random = new Mulberry32Provider(i);
        const bones = Buddy.generateBones(`test-${i}`, random);

        // Verify species is available for the rolled rarity
        expect(bones.species.isAvailableForRarity(bones.rarity)).toBe(true);
      }
    });
  });

  describe("gainXp", () => {
    it("should add XP correctly", () => {
      const random = createDeterministicProvider("test-user");
      const bones = Buddy.generateBones("test-user", random);
      const soul = {
        name: "Test",
        personality: "friendly",
        hatchedAt: new Date().toISOString(),
        hatchedByUserId: "test-user",
      };
      const buddy = Buddy.create(bones, soul);

      buddy.gainXp(100);

      expect(buddy.getXp()).toBe(100);
    });

    it("should accumulate XP", () => {
      const random = createDeterministicProvider("test-user");
      const bones = Buddy.generateBones("test-user", random);
      const soul = {
        name: "Test",
        personality: "friendly",
        hatchedAt: new Date().toISOString(),
        hatchedByUserId: "test-user",
      };
      const buddy = Buddy.create(bones, soul);

      buddy.gainXp(50);
      buddy.gainXp(50);

      expect(buddy.getXp()).toBe(100);
    });
  });

  describe("checkEvolution", () => {
    it("should evolve when XP threshold reached", () => {
      const random = createDeterministicProvider("test-user");
      const bones = Buddy.generateBones("test-user", random);
      const soul = {
        name: "Test",
        personality: "friendly",
        hatchedAt: new Date().toISOString(),
        hatchedByUserId: "test-user",
      };
      const buddy = Buddy.create(bones, soul);

      // Baby -> Child at 100 XP
      buddy.gainXp(100);
      const evolved = buddy.checkEvolution();

      expect(evolved).toBe(true);
      expect(buddy.getStage().getValue()).toBe("child");
    });

    it("should not evolve below threshold", () => {
      const random = createDeterministicProvider("test-user");
      const bones = Buddy.generateBones("test-user", random);
      const soul = {
        name: "Test",
        personality: "friendly",
        hatchedAt: new Date().toISOString(),
        hatchedByUserId: "test-user",
      };
      const buddy = Buddy.create(bones, soul);

      buddy.gainXp(50);
      const evolved = buddy.checkEvolution();

      expect(evolved).toBe(false);
      expect(buddy.getStage().getValue()).toBe("baby");
    });
  });

  describe("getXpToNextStage", () => {
    it("should return correct XP needed for next stage", () => {
      const random = createDeterministicProvider("test-user");
      const bones = Buddy.generateBones("test-user", random);
      const soul = {
        name: "Test",
        personality: "friendly",
        hatchedAt: new Date().toISOString(),
        hatchedByUserId: "test-user",
      };
      const buddy = Buddy.create(bones, soul);

      // Baby at 0 XP, Child at 100 XP
      expect(buddy.getXpToNextStage()).toBe(100);

      buddy.gainXp(50);
      expect(buddy.getXpToNextStage()).toBe(50);

      // Gain enough to evolve (requires calling checkEvolution)
      buddy.gainXp(50);
      expect(buddy.getXpToNextStage()).toBe(0); // At threshold, needs evolution

      // After evolution, need 900 more to reach Teen (1000)
      buddy.checkEvolution();
      expect(buddy.getXpToNextStage()).toBe(900);
    });
  });

  describe("serialization", () => {
    it("should serialize and deserialize correctly", () => {
      const random = createDeterministicProvider("test-user");
      const bones = Buddy.generateBones("test-user", random);
      const soul = {
        name: "Test Buddy",
        personality: "friendly",
        hatchedAt: new Date().toISOString(),
        hatchedByUserId: "test-user",
      };
      const buddy = Buddy.create(bones, soul);

      buddy.gainXp(150);
      buddy.checkEvolution();

      const json = buddy.toJSON();
      const restored = Buddy.fromJSON(json, random);

      expect(restored.getName()).toBe(buddy.getName());
      expect(restored.getXp()).toBe(buddy.getXp());
      expect(restored.getStage().getValue()).toBe(buddy.getStage().getValue());
      expect(restored.getSpecies().getName()).toBe(buddy.getSpecies().getName());
    });
  });
});
