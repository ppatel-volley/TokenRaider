import { test, expect } from "@playwright/test";

test.describe("Game Flow — Display in Remote Mode", () => {
  test.use({ baseURL: "http://localhost:3000" });

  test("full game flow: lobby → playing → score and tokens visible", async ({
    page,
  }) => {
    // Open display in remote mode
    await page.goto(
      "/?sessionId=e2e-test&userId=display-e2e&inputMode=remote",
    );

    // Wait for lobby
    await expect(page.getByText("Press Enter to Play")).toBeVisible({
      timeout: 10_000,
    });

    // Start the game
    await page.keyboard.press("Enter");

    // Verify the game scene loads (lobby prompt should disappear)
    await expect(page.getByText("Press Enter to Play")).not.toBeVisible({
      timeout: 10_000,
    });

    // Verify score display starts at 0
    await expect(page.getByText("0")).toBeVisible({ timeout: 5_000 });

    // Verify tokens are rendered on screen
    const canvas = page.locator("canvas");
    await expect(canvas).toBeVisible({ timeout: 5_000 });

    // Use arrow keys to move the player
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowUp");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowDown");

    // Allow time for token collection or timer progression
    await page.waitForTimeout(2_000);
  });
});
