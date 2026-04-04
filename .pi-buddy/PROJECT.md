# PI Buddy Extension - Project Definition

## Vision
A persistent companion system for PI that hatches, grows, and evolves alongside the user through coding sessions. Inspired by virtual pets but designed for developer productivity and delight.

**The Product:** A PI extension (`pi-buddy`) that adds the `/buddy` command to PI — install it, run `/buddy`, and your companion appears.

**Core Philosophy:**
- Single command entry point: `/buddy` (hatch, status, skills, help)
- Deterministic generation (same PI user = same buddy potential)
- Growth through actual coding activity (tool call hooks)
- Utility unlocks at evolution stages (not just cosmetics)
- True rarity that feels special (Mythic at 0.001%)
- Prestige system for long-term engagement

## Key Metrics
- Target: 100k hatch simulation validates rarity distribution
- Performance: <1ms per tool call (XP award overhead)
- Coverage: 100% domain logic unit tested
- Visual: Graceful degradation from Unicode → ASCII

## Milestones Overview

| Milestone | Goal | Est. Time | Key Deliverable |
|-----------|------|-----------|-----------------|
| M01: Foundation | Solid domain layer | 1 week | `npm test` passes with simulation |
| M02: Hatching | `/buddy` command works | 1 week | Hatching overlay UI |
| M03: Growth | XP system active | 1 week | Buddy evolves, widget displays |
| M04: Skills | Buddy becomes useful | 1.5 weeks | `/buddy scent`, `/buddy recall` |
| M05: Polish | Production-ready | 1 week | Delightful experience |

**Total ETA:** ~5-6 weeks

## Architecture Principles

1. **Hexagonal Architecture**: Domain logic pure, adapters for PI integration
2. **Deterministic Generation**: User ID → hash → PRNG → buddy characteristics
3. **Separate Concerns**: "Bones" (regenerated) vs "Soul" (persisted) vs "Dynamic" (mutable)
4. **Event-Driven**: React to PI's `tool_call` events for XP
5. **Test-First**: All domain logic unit tested before PI integration

## State Management

**Location:** `~/.pi/agent/buddy/my-buddy.json`

```typescript
interface StoredBuddy {
  // SOUL - persisted, defines identity
  name: string;
  personality: string;
  hatchedAt: ISOString;
  hatchedByUserId: string;  // Hash seed
  
  // DYNAMIC - mutable, evolves over time
  xp: number;
  stage: EvolutionStage;
  prestigeCount: number;
  unlockedSkills: string[];
  lastActiveAt: ISOString;
}

// BONES - regenerated from hash(hatchedByUserId)
// species, rarity, shiny, stats, eyeStyle
```

## Extension Installation (End Goal)

The final product installs as a PI extension:

```bash
# Install globally
npm install -g pi-buddy

# Or copy to PI's extension directory
cp -r pi-extension/ ~/.pi/agent/extensions/pi-buddy/
```

**Usage:**
```
$ pi
> /buddy           # Hatch or show status
> /buddy scent     # Find TODOs in current file  
> /buddy recall    # Search session history
> /buddy help      # List available commands
```

## Directory Structure (Revised)

**Two-layer architecture:**

1. **Core Library** (`src/`) - Hexagonal, tested, PI-agnostic
2. **Extension** (`pi-extension/`) - Thin adapter, PI-specific

```
PI-Buddies/
├── pi-extension/           ⭐ SHIPPING PRODUCT
│   ├── buddy.extension.ts  # Entry point
│   ├── commands/           # /buddy handlers
│   ├── ui/                 # TUI components
│   ├── hooks/              # PI event integration
│   └── package.json
├── src/                    # Core library
│   └── hexagons/buddy/     # Domain, use-cases, infra
└── .pi-buddy/              # Planning docs
```

**Design principle:** Domain logic is pure TypeScript. Extension is just wiring.

## Technical Stack

- **Language:** TypeScript (strict mode)
- **Validation:** Zod 4.x
- **Testing:** Vitest (100% domain coverage target)
- **Formatting:** Biome
- **PI Integration:** `@mariozechner/pi-coding-agent`
- **TUI:** `@mariozechner/pi-tui`

## Git Workflow

**Branches:**
- `main`: Production-ready
- `develop`: Integration
- `milestone/M01-Foundation`, `milestone/M02-Hatching`, etc.
- `feature/M01-S01-project-setup`, `feature/M01-S02-domain-vos`, etc.

**Merge Strategy:**
1. Tasks → Slice branch
2. Slices → Milestone branch
3. Milestones → `develop`
4. `develop` → `main` (releases)

## Success Criteria

### M01
- [ ] `npm test` passes with 100% domain coverage
- [ ] 100k hatch simulation shows ~0.001% Mythic rate
- [ ] XP math verified for all rarity multipliers
- [ ] Ultra-rare gating works correctly

### M02
- [ ] `/buddy` command registered in PI
- [ ] Hatching overlay shows 3 buddies with selection
- [ ] Persistence to `~/.pi/agent/buddy/`
- [ ] Re-run shows existing buddy status

### M03
- [ ] Every tool call awards XP (visible in status)
- [ ] Evolution triggers at thresholds
- [ ] Widget displays current buddy above editor
- [ ] Evolution cutscene plays on stage change

### M04
- [ ] `/buddy scent` finds TODOs in current file
- [ ] `/buddy recall` searches session history
- [ ] Passive skills apply automatically (Lucky)
- [ ] Species-unique skills work (Chronling, etc.)

### M05
- [ ] No perceptible lag on tool calls
- [ ] Renders correctly on narrow terminals (≥80 cols)
- [ ] Shiny visual effects (sparkles)
- [ ] Graceful degradation (ASCII fallback)

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| PI `tool_call` event doesn't fire as expected | Medium | Early prototype in M02-S01 |
| Widget doesn't persist across sessions | Medium | Fallback to notification-only |
| Performance lag on XP calculation | Low | Async XP updates, debounced |
| TUI overlay conflicts with PI UI | Medium | Test with narrow terminals early |
| User tries to manipulate buddy JSON | Low | Hash verification on load |

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-04-04 | Exponential XP curve | Makes high evolution meaningful |
| 2025-04-04 | 0.001% Mythic rate | True rarity, prestige system enables progress |
| 2025-04-04 | Tool + Passive XP | Rewards active and long-term use |
| 2025-04-04 | Ultra-rare gating | Gives rarity meaning beyond multiplier |
| 2025-04-04 | Skills at evolution | Progression unlocks utility |
| 2025-04-04 | Hexagonal architecture | Testability, PI independence |
| 2025-04-04 | 25 species total | Clear rarity progression |
| 2025-04-04 | Deterministic generation | Prevents save-scumming, same user = same potential |
| 2025-04-04 | Prestige system | Long-term engagement, rarity upgrade path |
| 2025-04-04 | Ascended = Mythic-only | Makes Ascended truly special |
| 2025-04-04 | Multiplicative shiny bonus | Legendary/Mythic actually have better shiny odds |

## Related Documents

- [Research](./RESEARCH.md) - Claude buddy analysis, PI API docs
- [Roadmap](../docs/ROADMAP.md) - Full vision with species/rarity details
- [Architecture](../docs/ARCHITECTURE.md) - Hexagonal structure deep dive
- [Species](../docs/SPECIES.md) - All 25 species with ASCII art

---

*Project initialized: 2025-04-04*
*Framework: Forge Flow CC patterns adapted for PI Buddy*
