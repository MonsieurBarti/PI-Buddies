import type { ExtensionAPI, ExtensionContext } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";

/**
 * PI Buddy Extension
 * A persistent companion system for PI coding sessions
 */

export default function (pi: ExtensionAPI) {
  // Track buddy state (will be loaded from session entries in S02)
  let hasBuddy = false;
  const buddyName: string | null = null;

  // Check for existing buddy on session start
  pi.on("session_start", async (event, ctx) => {
    // TODO: Load buddy from session entries (S02)
    // For now, assume no buddy exists
    hasBuddy = false;

    if (hasBuddy && buddyName) {
      ctx.ui.setWidget("buddy", [`🐣 ${buddyName} is here!`, "Type /buddy to check on them."]);
    }
  });

  // Register /buddy command
  pi.registerCommand("buddy", {
    description: "Hatch or check on your PI Buddy companion",
    handler: async (args, ctx) => {
      if (!hasBuddy) {
        // First run - show hatching UI (S03)
        ctx.ui.notify("🐣 Time to hatch your buddy! (Coming in S03)", "info");

        // TODO: Show 3-card selection overlay
        // For now, just acknowledge the command works
        ctx.ui.notify("Buddy hatching system coming soon...", "info");
      } else {
        // Show buddy status (S04)
        ctx.ui.notify(`🐣 ${buddyName} is doing great!`, "success");

        // TODO: Show detailed status widget
        ctx.ui.setWidget("buddy-status", [
          `✨ ${buddyName}`,
          "Stage: Baby | XP: 0/100",
          "Skills: None yet",
        ]);
      }
    },
  });

  // Placeholder for XP system (M03)
  pi.on("tool_call", async (event, ctx) => {
    // TODO: Award XP for tool usage (M03)
    // This will be implemented in the Growth milestone
  });
}
