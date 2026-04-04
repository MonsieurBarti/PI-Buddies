# M01-S01: Project Setup - Slice Plan

## Goal
Project scaffolding, configs, tooling ready for development.

## Parent Milestone
[M01: Foundation](../PLAN.md)

## Tasks

### T01: Initialize Project
Create `package.json`, `tsconfig.json`, `vitest.config.ts`, `biome.json`, directory structure.

**Status:** ⏳ Ready to start

**Acceptance Criteria:**
- [ ] `npm install` works
- [ ] `npm test` runs vitest
- [ ] `npm run build` compiles TypeScript
- [ ] `npm run check` runs biome lint+format
- [ ] `src/` has hexagonal folder structure

**Artifacts:**
- `package.json`
- `tsconfig.json`
- `vitest.config.ts`
- `biome.json`
- `src/hexagons/buddy/` structure

**Branch:** `feature/M01-S01-T01-init-project`

---

### T02: Directory Structure
Create full hexagonal architecture folder structure.

**Status:** ⏳ Blocked on T01

**Acceptance Criteria:**
- [ ] `src/hexagons/buddy/domain/` exists
- [ ] `src/hexagons/buddy/domain/ports/` exists
- [ ] `src/hexagons/buddy/use-cases/` exists
- [ ] `src/hexagons/buddy/infrastructure/` exists
- [ ] All folders have `.gitkeep` or README

**Artifacts:**
- Directory structure
- `src/index.ts` (entry point)

---

### T03: Test Harness Setup
Configure vitest with coverage, test utilities.

**Status:** ⏳ Blocked on T01

**Acceptance Criteria:**
- [ ] `npm run test:coverage` works
- [ ] Coverage report generated
- [ ] Test utilities/helpers set up
- [ ] Example test passes

**Artifacts:**
- `vitest.config.ts` with coverage
- `src/test/` utilities
- `src/test/example.spec.ts` (sample)

---

## Definition of Done

- [ ] All tasks complete
- [ ] Slice merged to `feature/M01-S01-project-setup`
- [ ] CI passes
- [ ] Can import from `@pi-buddy/core` (or similar)

## Notes

- Keep dependencies minimal
- TypeScript strict mode required
- Biome instead of ESLint+Prettier (faster, unified)
- Vitest for native TS support (no ts-node needed)

---

*Slice plan created: 2025-04-04*
