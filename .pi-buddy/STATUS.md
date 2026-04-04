# PI Buddy - Project Status

**Last Updated:** 2025-04-04  
**Clarified Scope:** End product is a PI extension (`pi-extension/`) that adds `/buddy` command — the `src/` core library is tested infrastructure that powers it.

## Current Status

### ✅ M01: Foundation COMPLETE

All slices complete and ready for PR review:

| Slice | Deliverables | Status |
|-------|-------------|--------|
| **S01** | Project scaffolding (package.json, tsconfig, vitest, biome, CI workflow) | ✅ Done |
| **S02** | 6 Domain Value Objects (Rarity, Species, Evolution, XP, Shiny, Stats) | ✅ Done |
| **S03** | Buddy Entity + PRNG + Hatch Use Case | ✅ Done |
| **S04** | Tests + 100k Simulation Script | ✅ Done |

**Test Results:** 28 tests passing (3 test files)
- `rarity.value-object.spec.ts`: 16 tests
- `buddy.entity.spec.ts`: 10 tests
- `example.spec.ts`: 2 tests

**Build:** ✅ TypeScript compiles cleanly

### 🎯 Key Features Implemented

1. **Deterministic Generation**: Mulberry32 PRNG seeded from userId hash — same user = same potential
2. **"Bones vs Soul"**: Bones regenerate from seed (prevents save-scumming), soul persists user data
3. **25 Species with Gating**: Ultra-rare species locked behind minimum rarity tiers
4. **6 Rarity Tiers**: Common (50%) → Mythic (**0.01%**) with weighted roll system
5. **Shiny System**: 1/4096 base rate with rarity multipliers (1x → 50x)
6. **Evolution**: 7 stages (Egg→Ascended) with exponential XP curve
7. **Hatch Use Case**: Generate 3 buddies for selection UI
8. **100k Simulation**: Script to validate rarity distribution

### 📁 Complete File Structure

```
src/hexagons/buddy/
├── domain/
│   ├── ports/
│   │   └── random-provider.port.ts       # PRNG interface
│   ├── rarity.value-object.ts            # 6 rarity tiers
│   ├── rarity.value-object.spec.ts       # 16 tests
│   ├── species.value-object.ts           # 25 species
│   ├── evolution.value-object.ts         # 7 stages
│   ├── xp.value-object.ts                # XP math
│   ├── shiny.value-object.ts             # Shiny probability
│   ├── stats.value-object.ts             # 5 stat categories
│   ├── buddy.entity.ts                   # Aggregate root
│   ├── buddy.entity.spec.ts              # 10 tests
│   └── index.ts                          # Domain exports
├── use-cases/
│   ├── hatch-buddies.use-case.ts         # Generate 3 buddies
│   └── index.ts                          # Use case exports
├── infrastructure/
│   ├── math-random-provider.adapter.ts   # Mulberry32 PRNG
│   └── index.ts                          # Infra exports
└── index.ts                              # Buddy module exports

scripts/
└── simulate-hatches.ts                    # 100k hatch simulation

.github/workflows/
└── ci.yml                                # GitHub Actions CI
```

### 📊 Milestone Success Criteria

- [x] `npm test` passes with domain coverage
- [x] Hatch 100k buddies simulation ready
- [x] XP math verified for all rarity multipliers
- [x] Ultra-rare gating implemented and tested

### 🚀 Next Milestone

**M02: Hatching** — PI Extension integration
- `/buddy` command registration
- Hatching overlay UI (3-card selection)
- State persistence to `~/.pi/agent/buddy/`

---

*Ready for PR review and merge to main*