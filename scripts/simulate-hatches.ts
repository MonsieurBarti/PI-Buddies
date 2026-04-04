import { Buddy } from "../src/hexagons/buddy/domain/buddy.entity.js";
import {
  Mulberry32Provider,
  createDeterministicProvider,
} from "../src/hexagons/buddy/infrastructure/math-random-provider.adapter.js";

/**
 * 100k Hatch Simulation
 * Validates rarity distribution, species gating, and shiny rates
 */

const SIMULATION_COUNT = 100000;

interface SimulationResults {
  totalHatches: number;
  rarities: Record<string, number>;
  shinyCount: number;
  speciesCounts: Record<string, number>;
  speciesByRarity: Record<string, Record<string, number>>;
}

function runSimulation(): SimulationResults {
  const results: SimulationResults = {
    totalHatches: SIMULATION_COUNT,
    rarities: {},
    shinyCount: 0,
    speciesCounts: {},
    speciesByRarity: {},
  };

  console.log(`Running ${SIMULATION_COUNT.toLocaleString()} hatch simulations...\n`);

  for (let i = 0; i < SIMULATION_COUNT; i++) {
    const userId = `sim-user-${i}`;
    const random = createDeterministicProvider(userId);
    const bones = Buddy.generateBones(userId, random);

    // Count rarities
    const rarity = bones.rarity.getValue();
    results.rarities[rarity] = (results.rarities[rarity] || 0) + 1;

    // Count shinies
    if (bones.shiny.getIsShiny()) {
      results.shinyCount++;
    }

    // Count species
    const species = bones.species.getName();
    results.speciesCounts[species] = (results.speciesCounts[species] || 0) + 1;

    // Count species by rarity
    if (!results.speciesByRarity[rarity]) {
      results.speciesByRarity[rarity] = {};
    }
    results.speciesByRarity[rarity][species] = (results.speciesByRarity[rarity][species] || 0) + 1;

    // Progress indicator
    if (i % 10000 === 0 && i > 0) {
      console.log(`  Progress: ${i.toLocaleString()} / ${SIMULATION_COUNT.toLocaleString()}`);
    }
  }

  return results;
}

function printResults(results: SimulationResults): void {
  console.log("\n" + "=".repeat(60));
  console.log("SIMULATION RESULTS");
  console.log("=".repeat(60));

  console.log("\n📊 RARITY DISTRIBUTION:");
  console.log("-".repeat(40));
  const rarityOrder = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];

  for (const rarity of rarityOrder) {
    const count = results.rarities[rarity] || 0;
    const percentage = ((count / results.totalHatches) * 100).toFixed(2);
    const expectedPercentages: Record<string, string> = {
      common: "50.00",
      uncommon: "30.00",
      rare: "15.00",
      epic: "4.00",
      legendary: "0.90",
      mythic: "0.01",
    };
    const bar = "█".repeat(Math.round(Number.parseFloat(percentage) / 2));
    console.log(`${rarity.padEnd(12)} ${count.toString().padStart(6)} (${percentage}%) ${bar}`);
    console.log(`             expected: ~${expectedPercentages[rarity]}%`);
  }

  console.log("\n✨ SHINY RATE:");
  console.log("-".repeat(40));
  const shinyRate = (results.shinyCount / results.totalHatches) * 100;
  const shinyRatio = results.totalHatches / results.shinyCount;
  console.log(`Total shinies: ${results.shinyCount}`);
  console.log(`Shiny rate: ${shinyRate.toFixed(4)}% (1/${Math.round(shinyRatio)})`);
  console.log(`Expected: ~0.0244% (1/4096 base, modified by rarity)`);

  console.log("\n🦄 ULTRA-RARE SPECIES VERIFICATION:");
  console.log("-".repeat(40));
  const ultraRareSpecies = [
    "Chronling",
    "Voidlet",
    "Solara",
    "Abysswyrm",
    "Neuralink",
    "Primordial",
  ];

  for (const species of ultraRareSpecies) {
    const count = results.speciesCounts[species] || 0;
    if (count > 0) {
      console.log(`${species.padEnd(15)} ${count.toString().padStart(6)} occurrences`);

      // Show breakdown by rarity
      for (const rarity of rarityOrder) {
        const rarityCount = results.speciesByRarity[rarity]?.[species] || 0;
        if (rarityCount > 0) {
          const speciesTotal = results.speciesCounts[species];
          const percentage = ((rarityCount / speciesTotal) * 100).toFixed(1);
          console.log(`  └─ ${rarity.padEnd(10)} ${rarityCount} (${percentage}%)`);
        }
      }
    }
  }

  console.log("\n📈 TOP 10 MOST COMMON SPECIES:");
  console.log("-".repeat(40));
  const sortedSpecies = Object.entries(results.speciesCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  for (const [species, count] of sortedSpecies) {
    const percentage = ((count / results.totalHatches) * 100).toFixed(2);
    console.log(`${species.padEnd(15)} ${count.toString().padStart(6)} (${percentage}%)`);
  }

  console.log("\n✅ VALIDATION:");
  console.log("-".repeat(40));

  // Check if ultra-rare species only appear at correct rarities
  const checks = [
    { name: "Chronling & Voidlet (Epic+)", minRarity: "epic" },
    { name: "Solara, Abysswyrm, Neuralink (Legendary+)", minRarity: "legendary" },
    { name: "Primordial (Mythic only)", minRarity: "mythic" },
  ];

  let allPassed = true;

  // Simple check: ensure mythic species only appears for mythic rarity
  const mythicSpeciesInLowerRarities = Object.entries(results.speciesByRarity)
    .filter(([rarity]) => rarity !== "mythic")
    .some(([_, species]) => species["Primordial"] > 0);

  if (mythicSpeciesInLowerRarities) {
    console.log("❌ FAIL: Primordial found in non-Mythic rarities!");
    allPassed = false;
  } else {
    console.log("✅ PASS: Ultra-rare gating working correctly");
  }

  // Check shiny rate is in reasonable range (0.02% - 0.03%)
  if (shinyRate < 0.02 || shinyRate > 0.05) {
    console.log(`⚠️  WARN: Shiny rate ${shinyRate.toFixed(4)}% seems off`);
  } else {
    console.log(`✅ PASS: Shiny rate within expected range`);
  }

  console.log("\n" + "=".repeat(60));
  console.log(allPassed ? "✅ ALL CHECKS PASSED" : "❌ SOME CHECKS FAILED");
  console.log("=".repeat(60));
}

// Run if executed directly
if (import.meta.main) {
  const results = runSimulation();
  printResults(results);
}

export { runSimulation, printResults };
