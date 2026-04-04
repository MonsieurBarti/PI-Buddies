import type { Buddy } from "../../src/hexagons/buddy/domain/buddy.entity.js";
import { GainXpUseCase } from "../../src/hexagons/buddy/use-cases/gain-xp.use-case.js";
import { saveBuddyState, loadBuddyState } from "../state/buddy-storage.js";
import { createDeterministicProvider } from "../../src/hexagons/buddy/infrastructure/math-random-provider.adapter.js";

/**
 * XP Hook Configuration
 */
const BASE_XP = 5; // XP per tool call
const PASSIVE_XP_INTERVAL = 60000; // 1 minute in ms
const WIDGET_UPDATE_DEBOUNCE = 5000; // 5 seconds in ms

/**
 * XP Award tracking for performance
 */
interface XpHookState {
  lastToolCallTime: number;
  pendingXpGain: number;
  lastWidgetUpdate: number;
  lastSaveTime: number;
}

const hookState: XpHookState = {
  lastToolCallTime: Date.now(),
  pendingXpGain: 0,
  lastWidgetUpdate: 0,
  lastSaveTime: 0,
};

/**
 * Setup XP on tool call hook
 * Awards XP for every tool execution with debounced updates
 */
export function setupXpOnToolCall(
  pi: {
    on: (event: string, handler: (event: unknown, ctx: {
      sessionManager: { getEntries: () => unknown[] };
      ui: { notify: (msg: string, type: string) => void; setWidget: (id: string, lines: string[]) => void };
    }) => void) => void;
  },
  getUserId: () => string
): void {
  // Tool call handler
  pi.on("tool_call", async (event, ctx) => {
    const userId = getUserId();
    const buddyData = loadBuddyState(ctx.sessionManager);

    if (!buddyData) {
      // No buddy yet - don't award XP
      return;
    }

    // Reconstruct buddy from state
    const random = createDeterministicProvider(userId);
    const buddy = reconstructBuddy(buddyData, random);

    // Award XP
    const useCase = new GainXpUseCase();
    const result = useCase.execute({
      buddy,
      baseXp: BASE_XP,
      luckyActive: buddy.getStage().isSkillUnlocked("baby"), // Lucky at Baby+
    });

    // Track state
    hookState.lastToolCallTime = Date.now();
    hookState.pendingXpGain += result.xpGained;

    // Debounced widget update
    const now = Date.now();
    if (now - hookState.lastWidgetUpdate > WIDGET_UPDATE_DEBOUNCE) {
      updateWidget(ctx, buddy, result);
      hookState.lastWidgetUpdate = now;
      hookState.pendingXpGain = 0;
    }

    // Debounced save (every minute)
    if (now - hookState.lastSaveTime > 60000) {
      saveBuddyState(pi, buddy);
      hookState.lastSaveTime = now;
    }

    // Handle evolution immediately (rare event)
    if (result.evolutionTriggered) {
      ctx.ui.notify(
        `🎉 ${buddy.getName()} evolved to ${buddy.getStage().getLabel()}!`,
        "success"
      );
      saveBuddyState(pi, buddy);
    }

    // Show Lucky notification
    if (result.wasLucky) {
      ctx.ui.notify(`🍀 Lucky! ${buddy.getName()} gained ${result.xpGained} XP!`, "info");
    }
  });

  // Passive XP timer (1 XP per minute while active)
  setInterval(() => {
    const timeSinceLastCall = Date.now() - hookState.lastToolCallTime;
    if (timeSinceLastCall < 120000) { // PI active in last 2 minutes
      const userId = getUserId();
      const buddyData = loadBuddyState({ getEntries: () => [] } as any);
      if (buddyData) {
        const random = createDeterministicProvider(userId);
        const buddy = reconstructBuddy(buddyData, random);
        buddy.gainXp(1); // 1 passive XP
        // Don't save every minute - batch with tool call saves
      }
    }
  }, PASSIVE_XP_INTERVAL);
}

/**
 * Update the buddy status widget
 */
function updateWidget(
  ctx: {
    ui: { setWidget: (id: string, lines: string[]) => void };
  },
  buddy: Buddy,
  result: { xpGained: number; totalXp: number }
): void {
  const stage = buddy.getStage();
  const xpToNext = stage.getXpToNext(buddy.getXp());
  const progress = xpToNext > 0 
    ? Math.round((buddy.getXp() / (buddy.getXp() + xpToNext)) * 100)
    : 100;

  const progressBar = "▓".repeat(progress / 10) + "░".repeat(10 - progress / 10);

  ctx.ui.setWidget("buddy-status", [
    `🐣 ${buddy.getName()} (${buddy.getSpecies().getName()})`,
    `${buddy.getRarity().getLabel()}${buddy.isShiny() ? " ✨" : ""} | ${stage.getLabel()}`,
    `XP: ${result.totalXp} / ${result.totalXp + xpToNext} [${progressBar}] ${progress}%`,
    result.xpGained > 0 ? `+${result.xpGained} XP` : "",
  ].filter(Boolean));
}

/**
 * Reconstruct buddy from stored data
 */
function reconstructBuddy(
  data: ReturnType<typeof loadBuddyState>,
  random: ReturnType<typeof createDeterministicProvider>
): Buddy {
  if (!data) throw new Error("No buddy data");

  // Use Buddy.fromJSON or reconstruct manually
  // For now, simplified reconstruction
  const { Buddy } = require("../../src/hexagons/buddy/domain/buddy.entity.js");
  return Buddy.fromJSON(
    {
      bones: {
        species: data.species,
        rarity: data.rarity,
        shiny: { isShiny: data.shiny, rollValue: 0 },
        stats: { debugging: 50, patience: 50, chaos: 50, wisdom: 50, snark: 50 },
      },
      soul: {
        name: data.buddyName,
        personality: "friendly",
        hatchedAt: data.hatchedAt,
        hatchedByUserId: data.hatchedByUserId,
      },
      dynamic: {
        xp: data.xp,
        stage: data.stage,
        unlockedSkills: data.unlockedSkills,
        lastActiveAt: new Date().toISOString(),
      },
    },
    random
  );
}
