# PI Buddy Extension - Roadmap

## Vision
A persistent companion system for PI that hatches, grows, and evolves alongside the user through coding sessions. Inspired by virtual pets but designed for developer productivity and delight.

## Core Concepts

### Rarity System
| Rarity | Weight | Species Available | Shiny Bonus | XP Multiplier | Visual Treatment |
|--------|--------|-------------------|-------------|---------------|------------------|
| Common | 50% | 8 basic species | +0% | 1.0x | Gray border, dim |
| Uncommon | 30% | 6 species | +0.5% | 1.1x | Green accent |
| Rare | 15% | 4 species | +1% | 1.2x | Blue accent |
| Epic | 4% | 2 species + 2 ultra-rare | +2% | 1.5x | Purple + glow effect |
| Legendary | 0.10% | 1 species + 3 ultra-rare | +5% | 2.0x | Gold border + shimmer |
| Mythic | 0.01% | 1 exclusive species | +10% | 3.0x | Rainbow animated border |

**Ultra-Rare Gating:**
- Epic+ lock: 2 species (Chronling, Voidlet) - only available at Epic or higher
- Legendary+ lock: 3 species (Solara, Abysswyrm, Neuralink) - only at Legendary or higher
- Mythic exclusive: 1 species (Primordial) - only at Mythic rarity

**Shiny System:**
- Base shiny rate: 1/4096 (0.024%)
- Independent roll per buddy hatched
- Rarity adds bonus to shiny chance (Legendary +5%, Mythic +10%)
- Visual: Sparkle overlay, palette shift, special ASCII art variant

### Species (25 Total)

**Common Pool (8):**
- Blob, Puff, Wisp, Pebble, Mote, Sprout, Droplet, Spark

**Uncommon Pool (6):**
- Fuzzle, Drifter, Lumo, Shellbie, Bitling, Whisk

**Rare Pool (4):**
- Glimmeron, Barkle, Circuit, Aetheroot

**Epic+ Ultra-Rare (2):**
- Chronling (time-themed)
- Voidlet (dark matter)

**Legendary+ Ultra-Rare (3):**
- Solara (sun phoenix)
- Abysswyrm (deep sea dragon)
- Neuralink (AI-themed)

**Mythic Exclusive (1):**
- Primordial (cosmic entity)

Each species has 5 evolution stages with unique ASCII art.

### Evolution & XP System

**Exponential XP Curve:**
Formula: `XP = 100 × 10^(stage-1)` for stages beyond Baby

| Stage | XP Required | Cumulative | Time Est. (Common, 10 XP/hr active) |
|-------|-------------|------------|--------------------------------------|
| Baby | 0 | 0 | Start |
| Child | 100 | 100 | ~10 hours |
| Teen | 1,000 | 1,100 | ~4 days |
| Adult | 10,000 | 11,100 | ~6 weeks |
| Elder | 100,000 | 111,100 | ~1 year |
| Ascended | 1,000,000 | 1,111,100 | ~11 years (Mythic-only accessible?) |

**XP Sources:**
1. **Tool Execution**: +XP per PI tool call (scaled by rarity multiplier)
2. **Passive Growth**: +1 XP per minute while PI is running

**Visual Progression:**
Each species evolves through 5 ASCII art stages (Egg → Baby → Child → Teen → Adult → Elder/Ascended)

### Skills System

**Skill Types:**
1. **Passive**: Always active (XP bonuses, auto-triggers)
2. **Active**: `/buddy <skill>` commands
3. **Contextual**: Buddy occasionally reacts to coding activity

**Skill Unlock Table:**
| Skill | Type | Unlocked At | Description |
|-------|------|-------------|---------------|
| Lucky | Passive | Child | 5% chance for 2x XP on tool calls |
| Scent | Active | Teen | `/buddy scent` - finds TODOs/FIXMEs in current file |
| Insight | Contextual | Adult | Occasionally comments on code patterns |
| Recall | Active | Elder | `/buddy recall` - semantic search session history |
| Synthesis | Active | Ascended | `/buddy synthesis` - scaffold features from description |

**Species-Unique Skills:**
- Chronling: "Rewind" - show file state 10 minutes ago
- Voidlet: "Void Gaze" - detect unused code
- Solara: "Illuminate" - highlight complex logic paths
- Abysswyrm: "Deep Dive" - analyze dependency chains
- Neuralink: "Predict" - suggest next line of code
- Primordial: "Genesis" - full feature scaffolding

### Architecture

**Hexagonal Architecture (Ports & Adapters):**
```
src/hexagons/buddy/
├── domain/                    # Business logic, pure functions
│   ├── buddy.entity.ts        # Aggregate root
│   ├── species.value-object.ts
│   ├── rarity.value-object.ts
│   ├── xp.value-object.ts
│   ├── evolution.value-object.ts
│   ├── skills.value-object.ts
│   ├── buddy.schemas.ts       # Zod schemas
│   └── errors/
├── domain/ports/              # Interfaces for infrastructure
│   ├── buddy-repository.port.ts
│   ├── random-provider.port.ts
│   ├── time-provider.port.ts
│   └── session-analyzer.port.ts
├── use-cases/                 # Application logic
│   ├── hatch-buddies.use-case.ts
│   ├── select-buddy.use-case.ts
│   ├── gain-xp.use-case.ts
│   ├── tick-passive-xp.use-case.ts
│   ├── check-evolution.use-case.ts
│   ├── use-skill.use-case.ts
│   └── get-buddy-status.use-case.ts
├── infrastructure/            # Adapters
│   ├── fs-buddy-repository.adapter.ts
│   ├── math-random-provider.adapter.ts
│   ├── system-time-provider.adapter.ts
│   └── gsd-session-analyzer.adapter.ts
└── index.ts                   # Public API

pi-extension/
└── buddy.extension.ts         # PI integration
```

**Tech Stack:**
- TypeScript (strict mode)
- Zod 4.x for schema validation
- Vitest for testing
- PI Extension API (`@mariozechner/pi-coding-agent`)
- PI TUI components (`@mariozechner/pi-tui`)

**Testing Strategy:**
- Unit tests for all domain logic (in-memory adapters)
- Use case integration tests
- Property-based tests for rarity distribution
- Full flow tests with temp file persistence

---

## Milestones

### Milestone 1: Foundation (Core Domain)
**Goal:** Solid domain layer with complete business logic, thoroughly tested

**Deliverables:**
1. Project scaffolding (package.json, tsconfig, vitest config, biome)
2. Zod schemas for all domain concepts
3. Value Objects:
   - Rarity with weighted probability distribution
   - Species with ultra-rare gating logic
   - XP with exponential curve calculation
   - Evolution with stage progression
   - Shiny calculation
4. Buddy Entity (aggregate root)
5. In-memory adapters for testing
6. Unit tests (100% domain coverage)

**Success Criteria:**
- `npm test` passes with 100% domain coverage
- Hatch 100k buddies in simulation, verify Mythic rate ~**0.01%**
- XP math verified for all rarity multipliers
- Ultra-rare gating works correctly

---

### Milestone 2: Hatching Flow (Use Cases + PI UI)
**Goal:** `/buddy` command works, hatching UI complete

**Deliverables:**
1. Hatch buddies use case (generate 3 with RNG)
2. Select buddy use case (persist chosen one)
3. FS repository adapter (persist to `~/.gsd/agent/buddy/`)
4. PI Extension registration
5. `/buddy` slash command
6. Hatching overlay UI:
   - 3 buddy cards with ASCII art
   - Rarity indicators with theme colors
   - Shiny sparkle effects
   - SelectList for choosing
7. First-time vs. existing buddy detection

**Success Criteria:**
- Run `/buddy` → see hatching animation → pick buddy → saved to disk
- Re-run `/buddy` → see existing buddy status
- All UI stays within terminal width bounds
- Theme integration works (colors change with theme)

---

### Milestone 3: Growth & Evolution
**Goal:** XP system active, evolution triggers, visual progression

**Deliverables:**
1. Tool call hook (intercept all PI tool executions)
2. XP gain use case (+XP per tool call, scaled by rarity)
3. Passive XP ticker (background growth)
4. Check evolution use case (threshold detection)
5. Evolution overlay UI (cutscene animation)
6. ASCII art progression (5 stages per species)
7. Buddy status widget (persistent display above editor)

**Success Criteria:**
- Every tool call adds XP to buddy
- Buddy evolves when thresholds crossed
- Visual changes at each evolution stage
- Widget shows current status continuously

---

### Milestone 4: Skills System
**Goal:** Buddy becomes useful, not just decorative

**Deliverables:**
1. Skill value objects (passive, active, contextual)
2. Skill unlock on evolution
3. `/buddy <skill>` subcommand system
4. Passive skill effects (Lucky, etc.)
5. Active skills:
   - `scent` (find TODOs)
   - `recall` (semantic search)
   - `synthesis` (feature scaffolding)
6. Contextual skills (occasional code commentary)
7. Species-unique skills

**Success Criteria:**
- `/buddy scent` finds TODOs in current file
- Passive skills apply automatically
- Contextual skills trigger occasionally
- Skills respect evolution unlock requirements

---

### Milestone 5: Polish & Release
**Goal:** Production-ready, delightful experience

**Deliverables:**
1. Shiny visual effects (sparkle animation)
2. Evolution cutscene animations
3. Buddy personality variations (species-specific dialogue)
4. Achievement system (first evolution, first shiny, etc.)
5. Configuration options (XP rates, notifications)
6. Documentation (`/help buddy`)
7. Error handling & recovery
8. Performance optimization (don't slow down PI)

**Success Criteria:**
- Extension loads without errors
- No perceptible lag on tool calls
- UI renders correctly on narrow terminals
- Graceful degradation (ASCII vs Unicode)
- Users want to keep their buddy active

---

## Future Ideas (Post-Milestone 5)

**Social Features:**
- Buddy battles (friendly competition)
- Buddy trading
- Buddy breeding (combine traits)

**Advanced Skills:**
- Code review assistance
- Refactoring suggestions
- Test generation help

**Cosmetics:**
- Accessories for buddies
- Custom ASCII art imports
- Seasonal variants

**Multi-Buddy:**
- Collection system
- Buddy teams
- Ranch mode (idle progression)

---

## Technical Constraints

1. **ASCII/Unicode Tiers:**
   - Tier 1: Universal ASCII (safe everywhere)
   - Tier 2: Modern Unicode (default)
   - Tier 3: Emoji/Extended (optional)

2. **State Persistence:**
   - Single JSON file per buddy
   - Location: `~/.gsd/agent/buddy/my-buddy.json`
   - Must handle PI session restarts gracefully

3. **Performance:**
   - Tool hook must not block execution
   - XP updates async
   - UI renders within 16ms

4. **Testing:**
   - All domain logic unit tested
   - Use cases integration tested
   - PI extension smoke tested

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-04-04 | Exponential XP curve | Makes high evolution meaningful, 1+ year for Elder |
| 2025-04-04 | **0.01%** Mythic rate | True rarity, hunt mechanics, 1 in 10k |
| 2025-04-04 | Tool + Passive XP | Rewards active use and long-term presence |
| 2025-04-04 | Ultra-rare gating | Gives rarity meaning beyond multiplier |
| 2025-04-04 | Skills at evolution | Progression unlocks utility, not just visuals |
| 2025-04-04 | Hexagonal architecture | Testability, PI independence, clean boundaries |
| 2025-04-04 | 25 species total | Enough variety, clear rarity progression |

---

## Related

- [Requirements](./REQUIREMENTS.md) - Detailed PRD with R1-R4
- [Architecture](./ARCHITECTURE.md) - Hexagonal structure deep dive
- [Species Guide](./SPECIES.md) - All 25 species with ASCII art
