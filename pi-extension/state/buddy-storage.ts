import type { Buddy } from "../../src/hexagons/buddy/domain/buddy.entity.js";

/**
 * Buddy storage using PI's native appendEntry system
 * State persists across PI sessions via session entries
 */

const BUDDY_ENTRY_TYPE = "pi-buddy";

export interface StoredBuddyState {
  version: number;
  hatchedAt: string;
  hatchedByUserId: string;
  buddyName: string;
  species: string;
  rarity: string;
  shiny: boolean;
  xp: number;
  stage: string;
  unlockedSkills: string[];
}

/**
 * Save buddy state to PI session
 */
export function saveBuddyState(
  pi: { appendEntry: (type: string, data: unknown) => void },
  buddy: Buddy,
): void {
  const json = buddy.toJSON();
  const state: StoredBuddyState = {
    version: 1,
    hatchedAt: json.soul.hatchedAt,
    hatchedByUserId: json.soul.hatchedByUserId,
    buddyName: json.soul.name,
    species: json.bones.species,
    rarity: json.bones.rarity,
    shiny: json.bones.shiny.isShiny,
    xp: json.dynamic.xp,
    stage: json.dynamic.stage,
    unlockedSkills: json.dynamic.unlockedSkills,
  };

  pi.appendEntry(BUDDY_ENTRY_TYPE, state);
}

/**
 * Load buddy state from PI session entries
 * Returns the most recent buddy state or null if none exists
 */
export function loadBuddyState(sessionManager: {
  getEntries: () => Array<{ type: string; customType?: string; data?: unknown }>;
}): StoredBuddyState | null {
  const entries = sessionManager.getEntries();

  // Find most recent buddy entry
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i];
    if (entry.type === "custom" && entry.customType === BUDDY_ENTRY_TYPE) {
      const state = entry.data as StoredBuddyState;

      // Validate state structure
      if (isValidBuddyState(state)) {
        return state;
      }
    }
  }

  return null;
}

/**
 * Check if user has a buddy in this session
 */
export function hasBuddy(sessionManager: {
  getEntries: () => Array<{ type: string; customType?: string }>;
}): boolean {
  const entries = sessionManager.getEntries();
  return entries.some((e) => e.type === "custom" && e.customType === BUDDY_ENTRY_TYPE);
}

/**
 * Validate stored buddy state structure
 */
function isValidBuddyState(state: unknown): state is StoredBuddyState {
  if (!state || typeof state !== "object") return false;

  const s = state as Record<string, unknown>;

  return (
    typeof s.version === "number" &&
    typeof s.hatchedAt === "string" &&
    typeof s.hatchedByUserId === "string" &&
    typeof s.buddyName === "string" &&
    typeof s.species === "string" &&
    typeof s.rarity === "string" &&
    typeof s.shiny === "boolean" &&
    typeof s.xp === "number" &&
    typeof s.stage === "string" &&
    Array.isArray(s.unlockedSkills)
  );
}

/**
 * Clear buddy state (for testing/reset)
 */
export function clearBuddyState(pi: { appendEntry: (type: string, data: unknown) => void }): void {
  pi.appendEntry(BUDDY_ENTRY_TYPE, { cleared: true, clearedAt: new Date().toISOString() });
}
