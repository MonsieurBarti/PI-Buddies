import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { handleHatch } from "./commands/hatch.js";
import { handleStatus } from "./commands/status.js";
import { clearBuddyState, loadBuddyState, saveBuddyState } from "./state/buddy-storage.js";
import { type BuddyVisual, renderBuddyStatusWidget } from "./ui/buddy-renderer.js";

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
        `🐣 ${existingBuddy.buddyName} (${existingBuddy.species})`,
        `${existingBuddy.rarity} | ${existingBuddy.stage}`,
        `XP: ${existingBuddy.xp}`,
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
        // First run - start hatching flow
        const userId = ctx.sessionManager.getUserId?.() || `user-${Date.now()}`;
        const buddy = await handleHatch(ctx, userId);
        if (buddy) {
          currentBuddyName = buddy.getName();
        }
      } else {
        // Show existing buddy status
        handleStatus(ctx);
        currentBuddyName = existingBuddy.buddyName;
      }
    },
  });

  // Command: clear buddy
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
