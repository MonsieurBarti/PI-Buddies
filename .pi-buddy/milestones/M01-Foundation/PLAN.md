# M01: Foundation - Milestone Plan

## Goal
Solid domain layer with complete business logic, thoroughly tested. No PI integration yet — pure TypeScript with hexagonal architecture.

## Success Criteria
- [ ] `npm test` passes with 100% domain coverage
- [ ] Hatch 100k buddies in simulation, verify Mythic rate ~**0.01%**
- [ ] XP math verified for all rarity multipliers
- [ ] Ultra-rare gating works correctly

## Slices

### S01: Project Setup
**Goal:** Project scaffolding, configs, tooling ready

**Tasks:**
- T01: Initialize project (package.json, tsconfig, vitest, biome)
- T02: Directory structure (hexagonal folders)
- T03: Test harness setup

**Deliverables:**
- `package.json` with scripts
- `tsconfig.json` (strict mode)
- `vitest.config.ts`
- `biome.json`
- `src/` directory structure

**Branch:** `feature/M01-S01-project-setup`

---

### S02: Domain Value Objects
**Goal:** All primitive value objects with validation

**Tasks:**
- T01: Rarity VO with weighted distribution
- T02: Species VO with ultra-rare gating
- T03: XP VO with exponential curve
- T04: Evolution VO with stage thresholds
- T05: Shiny VO with probability calculation
- T06: Stat VO (5 stat categories)

**Deliverables:**
- `src/hexagons/buddy/domain/rarity.value-object.ts`
- `src/hexagons/buddy/domain/species.value-object.ts`
- `src/hexagons/buddy/domain/xp.value-object.ts`
- `src/hexagons/buddy/domain/evolution.value-object.ts`
- `src/hexagons/buddy/domain/shiny.value-object.ts`
- `src/hexagons/buddy/domain/stats.value-object.ts`
- Unit tests for each VO

**Branch:** `feature/M01-S02-domain-vos`

---

### S03: Buddy Entity
**Goal:** Aggregate root with deterministic generation

**Tasks:**
- T01: Buddy entity (aggregate root)
- T02: Deterministic PRNG (Mulberry32)
- T03: Hash-based generation from userId
- T04: "Bones" vs "Soul" separation
- T05: Hatch use case (generate 3 buddies)

**Deliverables:**
- `src/hexagons/buddy/domain/buddy.entity.ts`
- `src/hexagons/buddy/domain/ports/random-provider.port.ts`
- `src/hexagons/buddy/infrastructure/math-random-provider.adapter.ts`
- `src/hexagons/buddy/use-cases/hatch-buddies.use-case.ts`
- Unit tests for generation logic

**Branch:** `feature/M01-S03-buddy-entity`

---

### S04: Testing & Simulation
**Goal:** Comprehensive tests and hatch simulation

**Tasks:**
- T01: Unit test coverage (100% domain)
- T02: 100k hatch simulation
- T03: Rarity distribution validation
- T04: Ultra-rare gating verification
- T05: XP curve verification

**Deliverables:**
- All domain files tested
- `scripts/simulate-hatches.ts`
- Distribution report

**Branch:** `feature/M01-S04-testing`

---

## Dependencies

```
S01 (Project Setup)
  └── S02 (Domain VOs)
        └── S03 (Buddy Entity)
              └── S04 (Testing)
```

## Timeline

| Slice | Est. Time | Cumulative |
|-------|-----------|------------|
| S01 | 1 day | Day 1 |
| S02 | 2 days | Day 3 |
| S03 | 2 days | Day 5 |
| S04 | 1 day | Day 6 |

**Total: ~1 week**

---

## Definition of Done

- [ ] All slices merged to `milestone/M01-Foundation`
- [ ] `milestone/M01-Foundation` merged to `develop`
- [ ] CI passes (typecheck, lint, test)
- [ ] `npm test` shows 100% domain coverage
- [ ] Simulation script run, results documented

---

*Milestone plan created: 2025-04-04*
