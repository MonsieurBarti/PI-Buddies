# PI Buddy - Project Status

**Last Updated:** 2025-04-04  
**Clarified Scope:** End product is a PI extension (`pi-extension/`) that adds `/buddy` command — the `src/` core library is tested infrastructure that powers it.

## Current Status

### ✅ Research Phase Complete
- [x] Analyzed Claude's Buddy System architecture
- [x] Documented PI Extension API capabilities  
- [x] Reviewed Forge Flow workflow patterns
- [x] Created research summary with architecture decisions

### ✅ Planning Complete
- [x] Updated ROADMAP with revised decisions
- [x] Created `.pi-buddy/PROJECT.md` with full project definition
- [x] Defined milestone structure (M01-M05)
- [x] Created M01-Foundation milestone plan
- [x] Created S01-Project-Setup slice plan
- [x] Created T01-Initialize-Project task

### ✅ M01-S01-T01 COMPLETE
- [x] Project scaffolding with TypeScript, Vitest, Biome
- [x] `npm install` works (56 packages)
- [x] `npm test` passes (2 tests)
- [x] `npm run check` passes (no biome errors)
- [x] `npm run build` compiles successfully
- [x] Hexagonal directory structure created
- [x] Branch: `feature/M01-S01-T01-init-project`

### 🔄 Ready for Next
- [ ] Merge T01 to slice branch / Continue to S02
- [ ] M01-S02: Domain Value Objects

## Key Decisions Made

| Decision | Value | Rationale |
|----------|-------|-----------|
| **Ascended Evolution** | Mythic-only | Makes it truly special (0.001% chance) |
| **Prestige System** | Rarity upgrade path | Common→Uncommon→Rare→Epic→Legendary→Mythic |
| **Shiny Rate** | 1/4096 base + multiplicative bonus | Pokemon-style rarity |
| **Deterministic Generation** | User ID hash → PRNG | Prevents save-scumming, same user = same potential |
| **Bones vs Soul** | Only soul persists | Can't manipulate rarity via JSON editing |
| **Skill Timing** | Lucky at Baby | Immediate feedback, faster gratification |
| **Architecture** | Hexagonal | Testability, PI independence |
| **State Storage** | `~/.pi/agent/buddy/` | PI-native location |

## Milestones Overview

| Milestone | Status | ETA | Key Deliverable |
|-----------|--------|-----|-----------------|
| M01: Foundation | 🔄 In Progress (T01 done) | Week 1 | `npm test` passes |
| M02: Hatching | ⏳ Planned | Week 2 | `/buddy` command |
| M03: Growth | ⏳ Planned | Week 3 | XP system active |
| M04: Skills | ⏳ Planned | Week 4-5 | Useful abilities |
| M05: Polish | ⏳ Planned | Week 6 | Production-ready |

## Current Branch Structure

```
main
  └── develop
        └── milestone/M01-Foundation (to be created)
              └── feature/M01-S01-project-setup (to be created)
                    └── feature/M01-S01-T01-init-project ✅ DONE
```

## Next Actions

1. **Merge T01 to S01 branch** (if creating)
2. **Start M01-S02:** Domain Value Objects
   - Rarity VO with weighted distribution
   - Species VO with ultra-rare gating
   - XP VO with exponential curve
   - Evolution VO with stage thresholds
   - Shiny VO with probability calculation
   - Stat VO (5 stat categories)

## Open Questions

1. ✅ **Resolved:** Claude uses deterministic generation
2. ✅ **Resolved:** PI has `tool_call` event for XP
3. ✅ **Resolved:** Widget system exists via `ctx.ui.setWidget()`
4. 🔄 **Pending:** Test widget persistence across sessions (M02)
5. 🔄 **Pending:** Verify TUI overlay performance with animations (M03)

## Resources

- [Research](./RESEARCH.md) - Full analysis
- [Project Definition](./PROJECT.md) - Complete spec
- [M01 Plan](./milestones/M01-Foundation/PLAN.md) - First milestone
- [Original Roadmap](../docs/ROADMAP.md) - Vision document

---

*Status tracking for PI Buddy project*