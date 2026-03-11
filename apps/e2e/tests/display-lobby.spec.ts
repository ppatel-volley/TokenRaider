import { test, expect } from "@playwright/test";

test.describe("Display — Lobby", () => {
  test.use({ baseURL: "http://localhost:3000" });

  test("renders lobby scene with title and play prompt", async ({ page }) => {
    await page.goto(
      "/?sessionId=e2e-test&userId=display-e2e&inputMode=remote",
    );

    await expect(page.getByText("TokenRaider")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Press Enter to Play")).toBeVisible();
  });

  test("pressing Enter transitions away from the lobby", async ({ page }) => {
    await page.goto(
      "/?sessionId=e2e-test&userId=display-e2e&inputMode=remote",
    );

    await expect(page.getByText("Press Enter to Play")).toBeVisible({
      timeout: 10_000,
    });

    await page.keyboard.press("Enter");

    await expect(page.getByText("Press Enter to Play")).not.toBeVisible({
      timeout: 10_000,
    });
  });
});
