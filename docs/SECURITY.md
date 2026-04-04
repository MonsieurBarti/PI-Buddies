# PI Buddy Security Model

## Overview

PI Buddy uses a **deterministic generation model** that prevents users from manipulating their companion's rarity through save file editing.

## Security Mechanisms

### 1. Deterministic PRNG (Mulberry32)

All buddy characteristics (species, rarity, shiny, stats) are generated from a **cryptographic hash of the user's PI identity**:

```
userId → FNV-1a hash → Mulberry32 seed → deterministic rolls
```

**Key property:** Same userId always produces the same potential companion.

### 2. "Bones vs Soul" Separation

**Bones** (regenerated from seed on every load):
- Species
- Rarity
- Shiny status
- Stats

**Soul** (persisted user data):
- Name (user can rename)
- Personality description
- Hatched timestamp
- User ID (the seed)

**Dynamic** (mutable state):
- XP
- Evolution stage
- Unlocked skills
- Last active timestamp

### 3. Anti-Tampering Validation

When loading from JSON:

1. **Regenerate bones from userId** — Ignore saved rarity/shiny/stats
2. **Validate species against rarity** — Ensure ultra-rare species only appear at valid rarities
3. **Fall back to seed species if invalid** — If JSON was edited to spoof a Mythic species at Common rarity

### 4. What Users CAN'T Manipulate

❌ Editing `~/.pi/agent/buddy/{userId}.json` cannot:
- Change rarity (Common → Legendary)
- Change shiny status
- Change stats
- Get ultra-rare species below their minimum rarity
- Change the seed (would break determinism)

### 5. What Users CAN Edit

✅ Safe to edit:
- Buddy name
- Personality description
- (Species names are validated against rarity gating)

## Attack Scenarios & Mitigations

### Attack: Edit JSON to get Mythic rarity

```json
{
  "bones": {
    "rarity": "mythic"  // Attack: edit to mythic
  }
}
```

**Mitigation:** Rarity is regenerated from seed on every load. The saved rarity is ignored.

### Attack: Edit JSON to get Primordial species

```json
{
  "bones": {
    "species": "Primordial"  // Attack: edit to mythic-exclusive species
  }
}
```

**Mitigation:** Species is validated against regenerated rarity. If seed generates Common but JSON has Primordial (Mythic-only), it falls back to seed-generated species.

### Attack: Change userId to get different buddy

```json
{
  "soul": {
    "hatchedByUserId": "other-user"  // Attack: steal someone else's legendary
  }
}
```

**Mitigation:** UserId is part of the soul and tied to PI's identity. Changing it would:
1. Generate different bones (other user's companion)
2. Break ownership (buddy thinks it belongs to someone else)
3. Be obvious on inspection

### Attack: Backup/restore to reroll

**Scenario:** Hatch, don't like result, restore backup, hatch again.

**Mitigation:** Deterministic generation means same userId always gives same result. Backup/restore doesn't change the outcome.

## Threat Model

| Threat | Severity | Mitigation |
|--------|----------|------------|
| Rarity spoofing | High | Regenerate from seed |
| Species spoofing | High | Validate against rarity |
| Shiny spoofing | Medium | Regenerate from seed |
| Stat manipulation | Low | Regenerate from seed |
| UserId theft | Low | Tied to PI identity |
| Backup rerolling | None | Deterministic generation |

## Verification

To verify security:

```bash
# 1. Hatch a buddy
npm run simulate

# 2. Edit ~/.pi/agent/buddy/{userId}.json to change rarity to "mythic"

# 3. Reload — rarity will revert to seed-generated value
```

## References

- Mulberry32 PRNG: https://github.com/bryc/code/blob/master/jshash/PRNGs.md#mulberry32
- FNV-1a hash: https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function

---

*Security model implemented in M01: Foundation*
*Last updated: 2025-04-04*
