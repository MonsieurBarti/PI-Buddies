# PI Buddy - Research Summary & Architecture Decisions

## Research Findings

### 1. Claude's Buddy System (Reference Implementation)

**Architecture:**
- **Deterministic Generation**: Uses Mulberry32 PRNG seeded from `hash(userId + SALT)`
- **Storage Strategy**: Only "soul" persists (name, personality, hatchedAt); "bones" regenerate
  - Prevents user manipulation (can't edit config for legendary)
  - Species renames don't break stored companions
- **Rarity System**: 5 tiers with weighted distribution
  - Common 60%, Uncommon 25%, Rare 10%, Epic 4%, Legendary 1%
  - Shiny: 1% base rate (independent roll)
- **Stats**: 5 categories (DEBUGGING, PATIENCE, CHAOS, WISDOM, SNARK)
  - One peak stat, one dump stat based on rarity floor
- **Animation**: 3-frame idle animation, 500ms tick rate
- **UI**: ASCII art (5 lines), speech bubbles (20 ticks), pet effects

**Key Takeaways for PI Buddy:**
- Deterministic generation prevents save-scumming
- Separate "bones" (visuals/rarity) from "soul" (personality/name)
- Stats give personality beyond just visuals
- Terminal width adaptation (compact face mode for narrow)

---

### 2. PI Extension API (`@mariozechner/pi-coding-agent`)

**Key Capabilities:**
```typescript
// Event interception (critical for XP system)
pi.on("tool_call", async (event, ctx) => {
  // Can intercept ALL tool calls to award XP
});

// Session persistence
pi.appendEntry("buddy", buddyData); // Survives restarts

// Custom commands
pi.registerCommand("buddy", {
  description: "Manage your PI Buddy",
  handler: async (args, ctx) => { ... }
});

// Custom TUI components
ctx.ui.custom({
  render: (props) => { /* return React-like component */ }
});

// Widgets (persistent display)
ctx.ui.setWidget("buddy", ["Line 1", "Line 2"]);

// Notifications
ctx.ui.notify("Buddy evolved!", "success");
```

**Extension Locations:**
- Global: `~/.pi/agent/extensions/`
- Project-local: `.pi/extensions/`

**Critical Event for XP:**
```typescript
pi.on("tool_call", async (event, ctx) => {
  // This fires on EVERY tool execution
  // Award XP based on tool type, rarity multiplier
});
```

---

### 3. PI TUI (`@mariozechner/pi-tui`)

**Capabilities:**
- Differential rendering for flicker-free updates
- Component-based (similar to React)
- Keyboard input handling
- Synchronized output

**Key for Buddy:**
- Custom overlay UI for hatching animation
- Widget system for persistent buddy display
- SelectList component for choosing from 3 buddies

---

### 4. Forge Flow Patterns (The-Forge-Flow-CC)

**Workflow Structure:**
```
Milestone M01 (branch: milestone/M01)
├── Slice S01: Auth flow
│   ├── T01: User entity
│   ├── T02: Password service
│   └── T03: Signup endpoint
├── Slice S02: Team CRUD
└── Slice S03: Permissions
```

**Key Patterns:**
- **SQLite state**: Zero-dependency persistence
- **Wave-based execution**: Parallel tasks grouped by dependencies
- **Fresh reviewer enforcement**: Different agent reviews code than wrote it
- **Checkpoint/resumability**: Pause and resume across sessions
- **Complexity tiers**: S (quick), F-lite (feature), F-full (complex)

**Artifacts Structure:**
```
.tff/
├── PROJECT.md              # Project definition
├── milestones/
│   └── M01/
│       ├── PLAN.md         # Milestone plan
│       ├── slices/
│       │   └── M01-S01/
│       │       ├── RESEARCH.md
│       │       ├── PLAN.md
│       │       └── tasks/
│       │           ├── T01/
│       │           │   ├── TASK.md
│       │           │   └── ARTIFACTS/  # Code, tests, docs
```

---

## Updated Architecture Decisions

### 1. Ascended Evolution + Prestige System

**Problem:** 11 years for Ascended is unrealistic

**Solution:**
- **Ascended**: Only accessible to Mythic rarity (0.001% chance)
- **Prestige System**: At Elder stage, can "prestige" to become rarer
  - Common → Uncommon (keep 20% of XP)
  - Uncommon → Rare (keep 15% of XP)
  - Rare → Epic (keep 10% of XP)
  - Epic → Legendary (keep 5% of XP)
  - Legendary → Mythic (keep 1% of XP)
  - Each prestige: visual "aura" upgrade, +0.5x XP multiplier

### 2. Shiny Rate Adjustments

**Claude's**: 1% base (too common for true specialness)
**PI Buddy Proposal:**
- Base shiny: 1/4096 (0.024%) - Pokemon-style rarity
- Rarity multiplicative bonus:
  - Common: 1x (0.024%)
  - Uncommon: 2x (0.048%)
  - Rare: 3x (0.072%)
  - Epic: 5x (0.12%)
  - Legendary: 10x (0.24%)
  - Mythic: 50x (1.2%)

### 3. Skill Timing Adjustments

**Original:**
- Lucky (passive) at Child (~10 hours)
- Scent (active) at Teen (~4 days)

**Adjusted for faster feedback:**
- **Lucky** (passive): Baby stage (immediate, 5% 2x XP chance)
- **Scent** (active): Child stage (~10 hours)
- **Recall** (active): Teen stage (~4 days) - semantic search
- **Synthesis** (active): Adult stage (~6 weeks) - feature scaffolding

### 4. State Persistence Strategy

**Claude's approach (adapted):**
```typescript
// Stored at ~/.pi/agent/buddy/my-buddy.json
interface StoredBuddy {
  // SOUL - persisted
  name: string;
  personality: string;
  hatchedAt: string;
  hatchedByUserId: string;
  
  // BONES - regenerated from hash(hatchedByUserId)
  // species, rarity, shiny, stats, etc.
  
  // DYNAMIC - mutable
  xp: number;
  stage: EvolutionStage;
  prestigeCount: number;
  unlockedSkills: Skill[];
}
```

**Why this approach:**
- User can't manipulate rarity by editing JSON
- Same user always gets same companion (deterministic)
- Can safely store in `~/.pi/agent/buddy/`

---

## Project Structure (Forge Flow Style)

```
PI-Buddies/
├── .pi-buddy/                      # State & artifacts
│   ├── PROJECT.md                  # This project definition
│   ├── milestones/
│   │   ├── M01-Foundation/
│   │   │   ├── PLAN.md
│   │   │   ├── STATUS.md           # Current progress
│   │   │   └── slices/
│   │   │       ├── M01-S01-Project-Setup/
│   │   │       │   ├── PLAN.md
│   │   │       │   └── tasks/
│   │   │       │       └── T01-Initialize-Project/
│   │   │       │           ├── TASK.md
│   │   │       │           └── ARTIFACTS/
│   │   │       │               ├── package.json
│   │   │       │               ├── tsconfig.json
│   │   │       │               └── biome.json
│   │   │       ├── M01-S02-Domain-Value-Objects/
│   │   │       └── M01-S03-Buddy-Entity/
│   │   ├── M02-Hatching/
│   │   ├── M03-Growth/
│   │   ├── M04-Skills/
│   │   └── M05-Polish/
│   └── research/                   # Research notes
│       └── CLAUDE-BUDDY-ANALYSIS.md
├── docs/
│   ├── ROADMAP.md                  # Original vision
│   ├── SPECIES.md                  # 25 species with ASCII art
│   ├── ARCHITECTURE.md             # Hexagonal deep dive
│   └── REQUIREMENTS.md             # PRD
├── src/
│   └── (hexagonal structure per ROADMAP)
├── pi-extension/
│   └── buddy.extension.ts
└── package.json
```

---

## Git Branching Strategy

**Main Branches:**
- `main`: Production-ready code
- `develop`: Integration branch
- `milestone/M01-Foundation`, `milestone/M02-Hatching`, etc.

**Slice Branches:**
- `feature/M01-S01-project-setup`
- `feature/M01-S02-domain-vos`
- Merge to milestone branch when complete
- Merge milestone to `develop` when all slices done

---

## Milestones (Revised)

### M01: Foundation (Current)
**Slices:**
1. **S01-Project-Setup**: Scaffold, configs, tooling
2. **S02-Domain-Value-Objects**: Rarity, Species, XP, Evolution, Shiny
3. **S03-Buddy-Entity**: Aggregate root, deterministic generation
4. **S04-Testing**: Unit tests, simulation (100k hatches)

### M02: Hatching
**Slices:**
1. **S01-Use-Cases**: Hatch, Select, GetStatus
2. **S02-FS-Adapter**: Persistence to `~/.pi/agent/buddy/`
3. **S03-Extension-Skeleton**: PI extension registration
4. **S04-Hatching-UI**: 3-card overlay, selection

### M03: Growth
**Slices:**
1. **S01-XP-System**: Tool call hook, passive growth
2. **S02-Evolution**: Stage detection, visual progression
3. **S03-Widget**: Persistent buddy status display
4. **S04-Evolution-UI**: Cutscene animation

### M04: Skills
**Slices:**
1. **S01-Skill-System**: Passive/active/contextual framework
2. **S02-Basic-Skills**: Lucky, Scent, Recall
3. **S03-Species-Skills**: Unique abilities per ultra-rare
4. **S04-Synthesis**: Feature scaffolding (Adult+)

### M05: Polish
**Slices:**
1. **S01-Shiny-Effects**: Sparkle animation
2. **S02-Personality**: Dialogue variations
3. **S03-Achievements**: Firsts tracking
4. **S04-Performance**: No lag on tool calls

---

## Key Technical Decisions

### Deterministic Generation
```typescript
// Mulberry32 PRNG seeded from hashed userId
function mulberry32(seed: number): () => number {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

// Hash function (FNV-1a fallback)
function hashString(str: string): number {
  // ... implementation
}
```

### XP Formula
```typescript
// Stage thresholds
const XP_THRESHOLDS = {
  Baby: 0,
  Child: 100,
  Teen: 1_000,
  Adult: 10_000,
  Elder: 100_000,
  Ascended: 1_000_000,  // Mythic only
};

// XP gain per tool call
const BASE_XP = 5;
const xpGain = BASE_XP * rarityMultiplier * (luckyDouble ? 2 : 1);

// Passive XP (per minute while PI running)
const PASSIVE_XP_PER_MINUTE = 1;
```

### Species Unlocking via Prestige
```typescript
// First hatch: based on pure RNG
// Prestige unlocks: higher rarity pools

// Prestige 0: Normal rarity distribution
// Prestige 1 (was Common→Uncommon): +5% Uncommon weight
// Prestige 2: +5% Rare weight, etc.
```

---

## Open Questions

1. **Tool call hook timing**: Verify `tool_call` event fires after successful execution (so XP is only awarded for successful actions)
2. **Widget persistence**: Test if `ctx.ui.setWidget()` survives across PI sessions
3. **Animation performance**: 500ms tick rate for idle animation - test for CPU impact
4. **Session restart handling**: If PI crashes, does buddy state persist correctly?

---

## Next Steps

1. ✅ Research complete
2. 🔄 Create `.pi-buddy/PROJECT.md` with this structure
3. 🔄 Update ROADMAP.md with revised decisions
4. ⏳ Start M01-S01: Project scaffolding

---

*Research completed: 2025-04-04*
*Sources: Claude Code buddy system, PI-mono docs, Forge Flow CC patterns*
