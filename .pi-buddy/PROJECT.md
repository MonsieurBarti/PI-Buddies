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
- **Visual progression: 7 evolution stages with pixel art (168 images total)**

## Key Metrics
- Target: 100k hatch simulation validates rarity distribution
- Performance: <1ms per tool call (XP award overhead)
- Coverage: 100% domain logic unit tested
- Visual: 32×32 pixel art per species per stage, runtime shiny effects

## Image System Architecture

### File Structure
```
~/Downloads/pi-buddies/
├── Blob/
│   ├── egg.png      # 32×32, contained potential
│   ├── baby.png     # 32×32, chibi proportions
│   ├── child.png    # 32×32, developing features
│   ├── teen.png     # 32×32, confident stance
│   ├── adult.png    # 32×32, majestic form
│   ├── elder.png    # 32×32, weathered wisdom
│   └── ascended.png # 32×32, transcendent glow
├── Puff/
│   └── ...
└── ... (24 species)
```

### Total Images
- **168 base images** (24 species × 7 stages)
- **0 shiny variants** — effects applied at runtime
- Shiny = gold tint + sparkles + glow (programmatic, not separate assets)

### Stage Specifications
| Stage | Head Ratio | Visual Traits | Shiny Effect |
|-------|-----------|---------------|--------------|
| Egg | 100% | Smooth sphere, inner glow | Stronger pulse |
| Baby | 50% | Oversized eyes, nubby limbs | Star pupils |
| Child | 40% | Wing buds, playful | Playful sparkles |
| Teen | 30% | Full accessories, dynamic | Confident aura |
| Adult | 25% | Refined, commanding | Crown glow |
| Elder | 25% | Weathered, wise | Deep gold tones |
| Ascended | 25% | Ethereal, semi-transparent | Cosmic sparkles |

### Fallback System
If `{stage}.png` missing:
1. Try nearest stage (same or earlier)
2. Then try next stage forward
3. Finally fallback to ASCII + ANSI colors

## Species & Rarity Distribution

### 24 Total Species

| Rarity | Count | Rate | Species |
|--------|-------|------|---------|
| **Common** | 8 | 50% | Blob, Puff, Wisp, Pebble, Mote, Sprout, Droplet, Spark |
| **Uncommon** | 6 | 30% | Fuzzle, Drifter, Lumo, Shellbie, Bitling, Whisk |
| **Rare** | 4 | 15% | Glimmeron, Barkle, Circuit, Aetheroot |
| **Epic** | 2 | 4% | Chronling, Voidlet |
| **Legendary** | 3 | 0.9% | Solara, Abysswyrm, Neuralink |
| **Mythic** | 1 | 0.1% | Primordial |

### Shiny System
- **Base rate:** 1/4096 (0.024%)
- **Rarity multipliers:**
  - Common: 1× (0.024%)
  - Uncommon: 2× (0.048%)
  - Rare: 3× (0.072%)
  - Epic: 5× (0.12%)
  - Legendary: 10× (0.24%)
  - Mythic: 50× (1.2%)

**Runtime shiny effects (no extra images):**
- Gold tint overlay (25-50% opacity depending on stage)
- Sparkle particles (frequency varies by stage)
- Glow bloom (Adult+ stages)
- Star-shaped pupils (Baby/Child)
- Pulsing aura animation

## Evolution & XP

### 7 Evolution Stages
| Stage | XP Required | Unlock |
|-------|-------------|--------|
| Egg | 0 | Hatch (initial) |
| Baby | 0 | Hatched |
| Child | 100 | First growth |
| Teen | 1,000 | Skills emerging |
| Adult | 10,000 | Full power |
| Elder | 100,000 | Wisdom mastery |
| Ascended | 1,000,000 | Mythic-only transcendence |

### XP Sources
- **Tool calls:** 5 XP per tool execution (× rarity multiplier)
- **Lucky bonus:** 5% chance for 2× XP (Baby stage+)
- **Passive:** 1 XP per minute while PI active

### Rarity XP Multipliers
| Rarity | Multiplier |
|--------|-----------|
| Common | 1.0× |
| Uncommon | 1.2× |
| Rare | 1.5× |
| Epic | 2.0× |
| Legendary | 3.0× |
| Mythic | 5.0× |

### Prestige System
At Elder stage, can prestige to upgrade rarity:
- Common → Uncommon (keep 20% XP)
- Uncommon → Rare (keep 15% XP)
- Rare → Epic (keep 10% XP)
- Epic → Legendary (keep 5% XP)
- Legendary → Mythic (keep 1% XP)
- Each prestige: visual aura upgrade, +0.5× XP multiplier

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
6. **Visual-First**: 7 evolution stages with 32×32 pixel art, runtime effects

## State Management

**PI-Native Storage:** `pi.appendEntry("buddy", data)`

- Survives PI restarts
- Stored in session format
- Retrieve via `ctx.sessionManager.getEntries()`

```typescript
interface StoredBuddy {
  // SOUL - persisted, defines identity
  name: string;
  personality: string;
  hatchedAt: ISOString;
  hatchedByUserId: string;  // Hash seed
  
  // DYNAMIC - mutable, evolves over time
  xp: number;
  stage: EvolutionStage;  // egg | baby | child | teen | adult | elder | ascended
  prestigeCount: number;
  unlockedSkills: string[];
  lastActiveAt: ISOString;
}

// BONES - regenerated from hash(hatchedByUserId)
// species, rarity, shiny, stats, visual stage
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
│   ├── ui/                 # TUI components, image resolver
│   ├── hooks/              # PI event integration
│   ├── state/              # PI-native storage
│   └── package.json
├── src/                    # Core library
│   └── hexagons/buddy/     # Domain, use-cases, infra
└── .pi-buddy/              # Planning docs
```

**Design principle:** Domain logic is pure TypeScript. Extension is thin wiring. Images stored separately in `~/Downloads/pi-buddies/`.

## Technical Stack

- **Language:** TypeScript (strict mode, ESM, NodeNext)
- **Validation:** Zod 4.x
- **Testing:** Vitest (100% domain coverage target)
- **Formatting:** Biome
- **PI Integration:** `@mariozechner/pi-coding-agent`
- **TUI:** `@mariozechner/pi-tui` (when properly documented)
- **Images:** 32×32 PNG with alpha, stored in `~/Downloads/pi-buddies/`

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

**Important:** Never commit directly to `main`. Always create feature branches.

## Success Criteria

### M01
- [x] `npm test` passes with 100% domain coverage
- [x] 100k hatch simulation shows ~0.001% Mythic rate
- [x] XP math verified for all rarity multipliers
- [x] Ultra-rare gating works correctly

### M02
- [x] `/buddy` command registered in PI
- [x] Hatching shows 3 buddies (notification-based, batched)
- [x] Persistence via `pi.appendEntry()`
- [x] Re-run shows existing buddy status
- [ ] Full TUI overlay (pending PI API confirmation)

### M03
- [ ] Every tool call awards XP (debounced)
- [ ] Evolution triggers at thresholds (7 stages)
- [ ] Widget displays current buddy above editor
- [ ] Evolution notification on stage change

### M04
- [ ] `/buddy scent` finds TODOs in current file
- [ ] `/buddy recall` searches session history
- [ ] Passive skills apply automatically (Lucky)
- [ ] Species-unique skills work (Chronling time hints, etc.)

### M05
- [ ] <1ms overhead on tool calls
- [ ] Renders correctly on narrow terminals (≥80 cols)
- [ ] Shiny visual effects (gold tint, sparkles)
- [ ] Graceful degradation (ASCII fallback when no images)

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| PI `tool_call` event doesn't fire as expected | Medium | Early prototype in M02-S01 |
| Widget doesn't persist across sessions | Medium | Fallback to notification-only |
| Performance lag on XP calculation | Low | Async XP updates, debounced |
| TUI overlay conflicts with PI UI | Medium | Test with narrow terminals early |
| User tries to manipulate buddy JSON | Low | Hash verification on load |
| Image assets too many (168) | Low | Fallback system, generate incrementally |
| `ctx.ui.notify()` overflow | **Fixed** | Batch notifications, single multi-line call |

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
| 2025-04-04 | 7 evolution stages | Better progression granularity (was 5) |
| 2025-04-04 | 168 images (24×7) | Complete visual progression per species |
| 2025-04-04 | Runtime shiny effects | Maintainable — no 336 images needed |
| 2025-04-04 | Batched notifications | PI swallows rapid-fire `ctx.ui.notify()` calls |

## Current Status (2025-04-04)

**M01:** ✅ COMPLETE — Foundation with deterministic generation, 24 species, full test coverage  
**M02:** ✅ COMPLETE — PI extension with `/buddy` command, hatch flow, state persistence  
**M03:** 🔄 IN PROGRESS — XP hooks implemented, needs testing with actual PI sessions  

**Recent Decisions:**
- Images: 168 total (24 species × 7 stages), no shiny variants (runtime effects)
- Storage: PI-native `appendEntry()` instead of filesystem
- UI: Batched notifications (rapid-fire causes overflow in PI)
- Evolution: 7 stages (added Egg, Elder, Ascended to original 5)

## Open Questions

1. **TUI Overlay:** What's the correct way to display a `SelectList` component? `ctx.ui.custom()` expects a factory, not a component instance.
2. **Image Rendering:** Does PI support inline images (Kitty/iTerm2 protocols) or only via `ctx.ui.custom()`?
3. **Widget Persistence:** Can `ctx.ui.setWidget()` survive across PI commands?
4. **Session Handling:** What happens if user opens multiple PI sessions?

## Related Documents

- [Research](./RESEARCH.md) - Claude buddy analysis, PI API docs
- [Roadmap](../docs/ROADMAP.md) - Full vision with species/rarity details
- [Architecture](../docs/ARCHITECTURE.md) - Hexagonal structure deep dive
- [Species](../docs/SPECIES.md) - All 25 species with ASCII art
- [Image Prompts](../pi-extension/assets/PROMPTS.md) - 168 image generation prompts

---

*Project initialized: 2025-04-04*  
*Framework: Forge Flow CC patterns adapted for PI Buddy*  
*Last updated: 2025-04-04 (M02 complete, image system defined)*
