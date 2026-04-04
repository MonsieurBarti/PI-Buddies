import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import type { StoredBuddyState } from "./state/buddy-storage.js";
import { clearBuddyState, loadBuddyState, saveBuddyState } from "./state/buddy-storage.js";

/**
 * PI Buddy Extension
 * A persistent companion system for PI coding sessions
 */

export default function (pi: ExtensionAPI) {
  // Track buddy state in memory for current session
  let currentBuddyName: string | null = null;

  // Check for existing buddy on session start
  pi.on("session_start", async (event, ctx) => {
    const existingBuddy = loadBuddyState(ctx.sessionManager);

    if (existingBuddy) {
      currentBuddyName = existingBuddy.buddyName;
      ctx.ui.setWidget("buddy", [
        `🐣 ${currentBuddyName} (${existingBuddy.species})`,
        `Stage: ${existingBuddy.stage} | XP: ${existingBuddy.xp}`,
        "Type /buddy to check on them.",
      ]);
      ctx.ui.notify(`🐣 Welcome back! ${currentBuddyName} missed you.`, "info");
    } else {
      currentBuddyName = null;
      ctx.ui.notify("🐣 No buddy yet. Type /buddy to hatch one!", "info");
    }
  });

  // Register /buddy command
  pi.registerCommand("buddy", {
    description: "Hatch or check on your PI Buddy companion",
    handler: async (args, ctx) => {
      const existingBuddy = loadBuddyState(ctx.sessionManager);

      if (!existingBuddy) {
        // First run - show hatching UI (S03)
        ctx.ui.notify("🐣 Time to hatch your buddy! (S03 coming soon)", "info");
        ctx.ui.notify("For now, use /buddy-hatch-demo to create a test buddy", "info");
      } else {
        // Show buddy status
        currentBuddyName = existingBuddy.buddyName;
        ctx.ui.setWidget("buddy-status", [
          `✨ ${existingBuddy.buddyName} (${existingBuddy.species})`,
          `Rarity: ${existingBuddy.rarity}${existingBuddy.shiny ? " ✨" : ""}`,
          `Stage: ${existingBuddy.stage} | XP: ${existingBuddy.xp}`,
          `Skills: ${existingBuddy.unlockedSkills.join(", ") || "None yet"}`,
        ]);
        ctx.ui.notify(`🐣 ${existingBuddy.buddyName} is doing great!`, "success");
      }
    },
  });

  // Demo command: hatch a test buddy
  pi.registerCommand("buddy-hatch-demo", {
    description: "Create a test buddy (demo for S03)",
    handler: async (args, ctx) => {
      // Create a mock buddy state
      const demoBuddy = {
        version: 1,
        hatchedAt: new Date().toISOString(),
        hatchedByUserId: "demo-user",
        buddyName: args || "Blobby",
        species: "Blob",
        rarity: "Common",
        shiny: false,
        xp: 0,
        stage: "baby",
        unlockedSkills: [],
      };

      saveBuddyState(pi, demoBuddy as StoredBuddyState);
      currentBuddyName = demoBuddy.buddyName;

      ctx.ui.notify(`🐣 Hatched ${demoBuddy.buddyName}!`, "success");
      ctx.ui.setWidget("buddy", [
        `🐣 ${demoBuddy.buddyName} (${demoBuddy.species})`,
        `Stage: ${demoBuddy.stage} | XP: ${demoBuddy.xp}`,
        "Type /buddy to check on them.",
      ]);
    },
  });

  // Demo command: clear buddy
  pi.registerCommand("buddy-clear", {
    description: "Clear your buddy (for testing)",
    handler: async (args, ctx) => {
      clearBuddyState(pi);
      currentBuddyName = null;
      ctx.ui.notify("Buddy cleared. Type /buddy to hatch a new one!", "info");
    },
  });

  // Placeholder for XP system (M03)
  pi.on("tool_call", async (event, ctx) => {
    // TODO: Award XP for tool usage (M03)
    // This will be implemented in the Growth milestone
  });
}
