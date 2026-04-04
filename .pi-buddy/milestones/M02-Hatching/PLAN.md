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
**Goal:** Buddy state saved to and loaded from disk

**Tasks:**
- T01: Create FS repository adapter (`~/.pi/agent/buddy/`)
- T02: Implement buddy serialization/deserialization
- T03: Handle corrupted/missing state gracefully
- T04: Test persistence round-trip

**Deliverables:**
- `src/hexagons/buddy/infrastructure/fs-buddy-repository.adapter.ts`
- Directory creation and file I/O
- JSON schema validation for stored state

**Branch:** `feature/M02-S02-state-persistence`

---

### S03: Hatching UI
**Goal:** Visual hatching overlay with 3-card selection

**Tasks:**
- T01: Research PI TUI overlay capabilities
- T02: Create 3-card buddy preview component
- T03: Implement selection interaction (arrow keys + enter)
- T04: Show species ASCII art preview
- T05: Display rarity indicators and shiny markers

**Deliverables:**
- `pi-extension/ui/hatch-overlay.ts` — TUI overlay component
- `pi-extension/ui/ascii-art.ts` — ASCII art rendering helpers
- 3-card selection interface with keyboard navigation

**Branch:** `feature/M02-S03-hatching-ui`

---

### S04: Selection & Status
**Goal:** Complete hatching flow and status display

**Tasks:**
- T01: Wire up hatching use case to UI
- T02: Save selected buddy to persistence
- T03: Show buddy status on subsequent `/buddy` calls
- T04: Display XP, stage, and evolution progress
- T05: Show available skills based on evolution stage

**Deliverables:**
- `pi-extension/commands/hatch.ts` — hatch command handler
- `pi-extension/commands/status.ts` — status command handler
- `pi-extension/ui/buddy-status.ts` — status display component

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

## Technical Considerations

### PI Extension Architecture
Based on research, PI extensions:
- Register via manifest file
- Hook into `tool_call` events for XP
- Use `ctx.ui.custom()` for TUI overlays
- Use `ctx.ui.setWidget()` for persistent display
- Store state via `pi.appendEntry()` or direct FS

### State Location
```
~/.pi/agent/buddy/
├── buddies/
│   └── {user-id}.json
└── config.json
```

### TUI Overlay Design
```
┌─────────────────────────────────────────────────────┐
│  🐣 Choose Your Companion (1/3)                      │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │    ~~~      │  │    ===      │  │    ***      ││
│  │   (o_o)     │  │   [o_o]     │  │   {o_o}     ││
│  │    /|\      │  │    /|\      │  │    /|\      ││
│  │              │  │              │  │              ││
│  │  Blob       │  │  Spark      │  │  Glimmeron  ││
│  │  Common     │  │  Common     │  │  Rare ✨    ││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│       [↑]              [ ]              [ ]         │
│                                                      │
│  Arrow keys to select, Enter to hatch               │
└─────────────────────────────────────────────────────┘
```

### XP Hook (for M03 prep)
```typescript
pi.on("tool_call", async (event, ctx) => {
  // Award XP based on tool type and execution success
  // This will be fully implemented in M03
});
```

## Open Questions

1. **PI Extension API**: Need to verify exact API surface for:
   - TUI overlay persistence (does it survive across commands?)
   - Widget placement (can we show above editor?)
   - Event hooks (can we intercept all tool calls?)

2. **ASCII Art**: Need to create actual ASCII art for 25 species × 5 evolution stages = 125 art pieces. Start with Baby stage for hatching?

3. **State Sync**: What happens if user opens multiple PI sessions? (One session should be "primary")

## Definition of Done

- [ ] All slices merged to `milestone/M02-Hatching`
- [ ] `milestone/M02-Hatching` merged to `develop`
- [ ] `/buddy` command works in PI
- [ ] Hatching flow completes end-to-end
- [ ] State persists across PI restarts
- [ ] CI passes on all 3 checks

## Related

- [M01 Plan](../M01-Foundation/PLAN.md) — Completed foundation
- [PI Research](../RESEARCH.md) — PI API analysis
- [Architecture](../../docs/ARCHITECTURE.md) — Hexagonal structure

---

*Milestone plan created: 2025-04-04*
*Based on research and M01 completion*
