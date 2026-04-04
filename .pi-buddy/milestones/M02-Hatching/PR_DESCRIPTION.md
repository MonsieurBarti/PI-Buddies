## M02: Hatching - Complete PI Integration

This PR implements the full M02 milestone, integrating PI Buddy with the PI coding agent.

### What's Included

**S01: Extension Skeleton**
- Extension manifest and entry point
- `/buddy` slash command registration
- First-run vs returning user handling

**S02: State Persistence**
- PI-native storage via `pi.appendEntry("buddy", data)`
- State reconstruction from session entries
- Graceful handling of missing/corrupted state

**S03: Hatching UI**
- Hybrid image/Unicode renderer with terminal auto-detection
- Styled Unicode blocks for species silhouettes (░▒▓█)
- Species-specific shapes (Blob=rounded, Spark=spiky, Glimmeron=radiant)
- Emoji icons for all 25 species
- Pixel art generation prompts for 125 images (25 species × 5 stages)

**S04: Selection & Status**
- `handleHatch()` — Generates 3 real buddies via `HatchBuddiesUseCase`
- `handleStatus()` — Shows buddy info with XP progress
- Full domain integration (deterministic RNG, anti-tampering validation)
- Selection flow complete end-to-end

### Features

**User Flow:**
1. First `/buddy` → 3 buddies generated → Select one → Saved to state
2. Subsequent `/buddy` → Status widget with XP, stage, skills
3. State persists across PI restarts

**Visual System:**
- **Kitty/iTerm2:** Full pixel art images (when assets added)
- **Other terminals:** Unicode block silhouettes (graceful fallback)
- **Auto-detection:** Terminal capability detection on startup

### Files Added

```
pi-extension/
├── buddy.extension.ts      # Main entry (updated)
├── package.json            # Extension manifest
├── commands/
│   ├── hatch.ts           # Generate & save buddy
│   └── status.ts          # Show buddy status
├── state/
│   └── buddy-storage.ts   # PI-native persistence
└── ui/
    ├── buddy-renderer.ts   # Hybrid image/Unicode
    ├── hatch-overlay.ts    # 3-card selection
    ├── block-renderer.ts   # Unicode fallback
    └── PROMPTS.md          # 125 pixel art prompts
```

### Test It

```bash
pi -e ./pi-extension/buddy.extension.ts

# In PI:
/buddy              # Hatch your first buddy
/buddy              # Check status  
/buddy-clear        # Reset for testing
```

### Security

- Deterministic generation from userId (same user = same potential)
- Anti-tampering: Bones regenerate from seed on load
- Species validation: Ultra-rare species checked against rarity

### Next: M03 (Growth)

- XP system via `pi.on("tool_call")`
- Evolution triggers at XP thresholds
- Passive/active skills unlock

---

**All 4 slices complete. M02 milestone ready for merge.**