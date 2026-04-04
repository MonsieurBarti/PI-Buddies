# M03: Growth - Milestone Plan

## Status: 📋 PLANNING

## Goal
Transform PI Buddy from a hatched companion into an evolving coding assistant that grows stronger as you code. Every tool call, file read, and command execution feeds your buddy's growth.

## Vision
Your buddy should feel **alive** — gaining XP as you work, evolving through stages, unlocking useful skills that actually help you code better. By Elder stage, your buddy is a genuine productivity tool, not just a cute pet.

---

## Key Decisions to Make

### 1. XP Economy — How Fast Should Growth Feel?

**Option A: Fast (Casual)**
- Base XP: 10 per tool call
- Passive: 5 XP/minute while PI active
- Evolution: ~1 hour Baby→Child, ~1 day to Teen
- **Feel:** Buddy evolves quickly, frequent dopamine hits

**Option B: Moderate (Balanced)** ⭐ Recommended
- Base XP: 5 per tool call (already in domain)
- Passive: 1 XP/minute while PI active
- Evolution: ~10 hours Baby→Child, ~4 days to Teen
- **Feel:** Meaningful milestones, each evolution feels earned

**Option C: Slow (Hardcore)**
- Base XP: 2 per tool call
- Passive: 1 XP/5 minutes
- Evolution: Days between stages
- **Feel:** Legendary rarity matters, each stage is achievement

**Decision needed:** What's the target "time to Teen" for a casual user? 4 days? 1 day?

---

### 2. XP Calculation — Performance Critical

**Challenge:** XP award happens on EVERY tool call. Must be <1ms overhead.

**Current Domain Logic:**
```typescript
const BASE_XP = 5;
const xpGain = BASE_XP * rarityMultiplier * (luckyDouble ? 2 : 1);
```

**Rarity Multipliers:**
| Rarity | Multiplier | XP per call |
|--------|-----------|-------------|
| Common | 1.0x | 5 |
| Uncommon | 1.1x | 5-6 |
| Rare | 1.2x | 6 |
| Epic | 1.5x | 7-8 |
| Legendary | 2.0x | 10 |
| Mythic | 3.0x | 15 |

**Implementation Strategy:**
- Async XP updates (don't block tool execution)
- Debounced widget updates (every 5 seconds, not every call)
- Batch XP saves (every minute, not every call)

---

### 3. Widget Design — Real-time Updates

**Current:** Static widget shows current state
**Needed:** Live updating widget with progress animation

**Design Options:**

**A) Minimal (Text-only)**
```
🐣 Blobby (Child) | XP: 1,234 / 10,000 [▓▓░░░░░░░] 12%
```
- Updates every 5 seconds
- Low CPU usage
- Works everywhere

**B) Animated (Progress bar)**
- Smooth XP bar animation
- Sparkle effects on XP gain
- Evolution celebration animation
- **Risk:** May not render smoothly in all terminals

**C) Hybrid (Smart fallback)**
- Detect terminal capabilities
- Animation for Kitty/iTerm2
- Static for others

**Decision needed:** Start simple (Option A) or go animated (Option B)?

---

### 4. Evolution Experience — The Moment of Growth

**What happens when buddy evolves?**

**Option A: Notification Only**
- Toast: "🎉 Blobby evolved to Child!"
- Simple, non-intrusive
- User checks `/buddy` for details

**Option B: Celebration Cutscene**
- Brief animation (3-5 seconds)
- Visual evolution (Egg→Baby shown)
- New skill unlocked message
- **Risk:** Interrupts workflow

**Option C: Deferred (User Chooses When)**
- Notification: "Blobby is ready to evolve!"
- User runs `/buddy evolve` when convenient
- Evolution happens on user schedule

**Decision needed:** Interrupt immediately or let user control timing?

---

### 5. Skills Implementation — Scope Question

**Child Skill: Scent** — Find TODOs/FIXMEs in current file
- Simple regex: `/TODO|FIXME|XXX|HACK/gi`
- Easy to implement
- Actually useful

**Teen Skill: Recall** — Semantic search session history
- Requires: Session history access + search
- More complex: Need to index/chat history
- **Question:** Does PI expose session history to extensions?

**Adult Skill: Synthesis** — Feature scaffolding from description
- Requires: AI generation (PI's LLM or external)
- Complex: Need to scaffold files, tests, structure
- **Question:** Can we call PI's LLM from extension?

**Decision needed:** 
- Implement all 3 skills in M03?
- Start with Scent only, defer Recall/Synthesis to M04?
- What PI APIs are available?

---

### 6. Lucky Skill — Already Implemented!

**Domain has:** `luckyDouble` chance (5% at Baby)

**Implementation:**
```typescript
if (Math.random() < 0.05) {
  xpGain *= 2;
  ctx.ui.notify("🍀 Lucky! Double XP!", "success");
}
```

**Passive, automatic, no user action needed.** ✅

---

### 7. Passive XP — While User Codes

**Challenge:** Award XP even when no tool calls (user reading/thinking)

**Implementation:**
```typescript
// In extension
setInterval(() => {
  const timeSinceLastCall = Date.now() - lastToolCallTime;
  if (timeSinceLastCall < 60000) { // PI active in last minute
    buddy.gainXp(1); // 1 XP per minute
  }
}, 60000);
```

**Decision needed:** Is this worth implementing? Or stick to tool-call-only XP?

---

## Technical Architecture

### Slices

#### S01: XP Hook Integration
**Goal:** Wire up `pi.on("tool_call")` to award XP

**Tasks:**
- T01: Add XP award on every tool call
- T02: Apply rarity multiplier
- T03: Implement Lucky skill (5% double XP)
- T04: Debounce widget updates (5 second batch)
- T05: Performance test (<1ms overhead)

**Deliverables:**
- `pi-extension/hooks/xp-on-tool-call.ts`
- Performance benchmark

**Branch:** `feature/M03-S01-xp-hook`

---

#### S02: Evolution System
**Goal:** Detect XP thresholds, trigger evolution, update stage

**Tasks:**
- T01: Check evolution after each XP gain
- T02: Evolution notification/cutscene
- T03: Update buddy stage in state
- T04: Unlock skills for new stage
- T05: Widget stage indicator update

**Deliverables:**
- `pi-extension/hooks/check-evolution.ts`
- Evolution celebration UI

**Branch:** `feature/M03-S02-evolution`

---

#### S03: Widget Real-time Updates
**Goal:** Live XP display with progress bar

**Tasks:**
- T01: Redesign widget with progress bar
- T02: Implement batched updates
- T03: XP gain animation (sparkle)
- T04: Terminal capability detection
- T05: Fallback for basic terminals

**Deliverables:**
- Updated `pi-extension/ui/buddy-status.ts`
- Real-time widget component

**Branch:** `feature/M03-S03-live-widget`

---

#### S04: Skills — Scent (Child)
**Goal:** `/buddy scent` finds TODOs/FIXMEs

**Tasks:**
- T01: Register `/buddy scent` command
- T02: Scan current file for TODO/FIXME/XXX/HACK
- T03: Display results with line numbers
- T04: Gate behind Child stage
- T05: Test with various file types

**Deliverables:**
- `pi-extension/commands/scent.ts`

**Branch:** `feature/M03-S04-skill-scent`

---

#### S05: Skills — Recall (Teen) — OPTIONAL
**Goal:** `/buddy recall` searches session history

**Tasks:**
- T01: Research PI session history API
- T02: Implement semantic search or keyword search
- T03: Display search results
- T04: Gate behind Teen stage

**Deliverables:**
- `pi-extension/commands/recall.ts`

**Branch:** `feature/M03-S05-skill-recall` (optional)

---

#### S06: Skills — Synthesis (Adult) — OPTIONAL
**Goal:** `/buddy synthesis <description>` scaffolds feature

**Tasks:**
- T01: Research PI LLM API access
- T02: Parse feature description
- T03: Generate file structure
- T04: Create scaffolded files
- T05: Gate behind Adult stage

**Deliverables:**
- `pi-extension/commands/synthesis.ts`

**Branch:** `feature/M03-S06-skill-synthesis` (optional)

---

## Dependencies

```
S01 (XP Hook)
  └── S02 (Evolution)
        └── S03 (Live Widget)
              └── S04 (Scent Skill)
                    └── S05 (Recall - optional)
                          └── S06 (Synthesis - optional)
```

## Timeline

| Slice | Est. Time | Cumulative |
|-------|-----------|------------|
| S01 | 1 day | Day 1 |
| S02 | 1 day | Day 2 |
| S03 | 2 days | Day 4 |
| S04 | 1 day | Day 5 |
| S05 | 2 days | Day 7 (optional) |
| S06 | 2 days | Day 9 (optional) |

**Core M03 (S01-S04): ~5 days** (1 week)
**Full M03 (+S05-S06): ~9 days** (1.5-2 weeks)

---

## Decisions Made

| # | Decision | Choice |
|---|----------|--------|
| 1 | **XP Speed** | Moderate (4 days to Teen) — feels earned, not grindy |
| 2 | **Evolution Moment** | Deferred — user chooses when via `/buddy evolve` |
| 3 | **Skills Scope** | Scent + Recall (Synthesis deferred to M04) |
| 4 | **Passive XP** | +1 XP/minute while PI active |
| 5 | **Widget Style** | Progress bar with batched updates |

---

## Definition of Done

- [ ] Every tool call awards XP (<1ms overhead)
- [ ] Widget updates showing XP progress in real-time
- [ ] Evolution triggers at thresholds with celebration
- [ ] Scent skill works: `/buddy scent` finds TODOs
- [ ] Lucky skill applies 5% double XP chance
- [ ] All gated by evolution stage
- [ ] CI passes on all 3 checks

---

## Related

- [M02 Plan](../M02-Hatching/PLAN.md) — Completed foundation
- [Architecture](../../../docs/ARCHITECTURE.md) — Hexagonal structure
- Domain: `src/hexagons/buddy/domain/skills.value-object.ts` — Skill definitions

---

*Milestone plan created: 2025-04-04*
*Status: Awaiting decisions on scope*
