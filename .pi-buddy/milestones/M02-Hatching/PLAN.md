# M02: Hatching - Milestone Plan

## Goal
Integrate PI Buddy with the PI coding agent. Enable the `/buddy` command, hatching UI overlay, and state persistence. This is where the virtual companion becomes real in the user's terminal.

## Success Criteria
- [ ] `/buddy` command registered in PI and responds
- [ ] First-time hatching shows 3 buddies with selection UI
- [ ] Buddy state persists across PI sessions (`~/.pi/agent/buddy/`)
- [ ] Re-running `/buddy` shows existing buddy status (not re-hatch)
- [ ] All PI event hooks (tool calls) award XP to buddy
- [ ] Widget displays current buddy above editor when active

## Slices

### S01: PI Extension Skeleton
**Goal:** Basic PI extension registration and command handling

**Tasks:**
- T01: Create extension manifest and entry point
- T02: Register `/buddy` slash command
- T03: Handle first-run (no buddy exists) vs subsequent runs
- T04: Test command responds in PI

**Deliverables:**
- `pi-extension/buddy.extension.ts` — main entry point
- `pi-extension/manifest.json` — PI extension manifest
- Command handler for `/buddy` with basic response

**Branch:** `feature/M02-S01-extension-skeleton`

---

### S02: State Persistence
**Goal:** Buddy state saved to and loaded from PI's native storage

**Tasks:**
- T01: Use `pi.appendEntry("buddy", data)` for persistence
- T02: Implement buddy reconstruction from session entries
- T03: Handle corrupted/missing state gracefully
- T04: Test persistence round-trip

**Deliverables:**
- `pi-extension/state/buddy-storage.ts` — PI-native storage adapter
- State reconstruction from `ctx.sessionManager.getEntries()`

**Branch:** `feature/M02-S02-state-persistence`

---

### S03: Hatching UI
**Goal:** Visual hatching overlay with 3-card selection using styled Unicode blocks

**Tasks:**
- T01: Create 3-card buddy preview component using `ctx.ui.custom()`
- T02: Implement selection interaction (arrow keys + enter)
- T03: Design styled Unicode block visuals for species silhouettes
- T04: Add rarity-based color borders via PI themes
- T05: Display shiny indicators and evolution stage

**Visual Design — Styled Unicode Blocks**

Instead of 125 ASCII art pieces, use **styled Unicode block combinations** for a "pixel art" feel without maintenance burden:

```
┌─────────────────────────┐
│    ░░▓▓▓▓▓▓░░          │  ← Species silhouette in blocks
│   ░▓▓██████▓▓░         │
│  ░▓██░░░░░░██▓░        │  ← Eyes/patterns with contrast
│  ░▓██░░██░░██▓░        │
│   ░▓████████▓░         │
│    ░░▓▓▓▓▓▓░░          │
│                         │
│  ✨ Glimmeron ✨        │  ← Shiny indicator
│     Rare               │  ← Rarity with color
└─────────────────────────┘
```

**Color Strategy:**
- Use PI's theme system for colored output
- Rarity-based borders (white=Common, green=Uncommon, blue=Rare, purple=Epic, gold=Legendary, rainbow=Shiny)
- Evolution-stage sizing (Baby=small blocks, Adult=full size, Elder=ornate frame)

**Benefits:**
- No 125 art assets to maintain
- Scalable across all 25 species × 5 stages
- Still feels "graphical" in terminal
- Theme-aware (works in light/dark mode)

**Deliverables:**
- `pi-extension/ui/hatch-overlay.ts` — TUI overlay component
- `pi-extension/ui/block-renderer.ts` — Unicode block styling helpers
- 3-card selection interface with keyboard navigation

**Branch:** `feature/M02-S03-hatching-ui`

---

### S04: Selection & Status
**Goal:** Complete hatching flow and status display

**Tasks:**
- T01: Wire up hatching use case to UI
- T02: Save selected buddy to PI state via `pi.appendEntry()`
- T03: Show buddy status on subsequent `/buddy` calls
- T04: Display XP, stage, and evolution progress
- T05: Show available skills based on evolution stage

**Deliverables:**
- `pi-extension/commands/hatch.ts` — hatch command handler
- `pi-extension/commands/status.ts` — status command handler
- `pi-extension/ui/buddy-status.ts` — status widget using `ctx.ui.setWidget()`

**Branch:** `feature/M02-S04-selection-status`

---

## Dependencies

```
S01 (Extension Skeleton)
  └── S02 (State Persistence)
        └── S03 (Hatching UI)
              └── S04 (Selection & Status)
```

## Timeline

| Slice | Est. Time | Cumulative |
|-------|-----------|------------|
| S01 | 1 day | Day 1 |
| S02 | 1 day | Day 2 |
| S03 | 2 days | Day 4 |
| S04 | 2 days | Day 6 |

**Total: ~6 days** (1 week)

## Technical Considerations (Verified from PI docs)

### PI Extension API
Based on https://github.com/badlogic/pi-mono research:

**State Persistence:**
```typescript
pi.appendEntry("buddy", buddyData)  // PI-native, survives restarts
```
- Stored in PI's session format
- Survives PI updates
- Retrieve via `ctx.sessionManager.getEntries()`

**UI Components:**
```typescript
ctx.ui.custom()      // Full TUI overlay with keyboard input (for 3-card selection)
ctx.ui.setWidget()   // Persistent widget above editor (for buddy status)
ctx.ui.notify()      // Toast notifications (for evolution alerts)
```

**Commands:**
```typescript
pi.registerCommand("buddy", handler)  // /buddy command
```

**XP Hook (M03 prep):**
```typescript
pi.on("tool_call", async (event, ctx) => {
  // Award XP for every tool execution
})
```

### Extension Location
- `~/.pi/agent/extensions/` (global — all projects)
- `.pi/extensions/` (project-local)

### Mode Behavior
- **Interactive mode:** Full TUI overlays work
- **Print mode:** Widgets no-op, use text output
- **RPC mode:** UI methods emit requests to client

## Open Questions

1. **TUI Overlay Persistence:** Does `ctx.ui.custom()` survive across commands or reset each time? (Need to test)

2. **Widget Placement:** Can `setWidget()` show above editor or only in specific positions?

3. **State Sync:** What happens if user opens multiple PI sessions? (Need to handle "primary" session)

## Definition of Done

- [ ] All slices merged to `milestone/M02-Hatching`
- [ ] `/buddy` command works in PI
- [ ] Hatching flow completes end-to-end with styled Unicode blocks
- [ ] State persists across PI restarts via `pi.appendEntry()`
- [ ] CI passes on all 3 checks

## Related

- [M01 Plan](../M01-Foundation/PLAN.md) — Completed foundation
- [PI Research](../RESEARCH.md) — PI API analysis  
- [Security Model](../../docs/SECURITY.md) — Anti-tampering details
- [Architecture](../../docs/ARCHITECTURE.md) — Hexagonal structure

---

*Milestone plan updated: 2025-04-04*
*Visuals: Styled Unicode blocks (Option B)*
*State: PI-native `appendEntry()`*
