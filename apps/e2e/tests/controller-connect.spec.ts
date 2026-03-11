import { test, expect } from "@playwright/test";

test.describe("Controller — Connect", () => {
  test.use({ baseURL: "http://localhost:5173" });

  test("loads the controller UI", async ({ page }) => {
    await page.goto("/?sessionId=e2e-test");

    // The controller app should render its root UI
    await expect(page.locator("body")).not.toBeEmpty();
    await expect(page.locator("#root, #app, [data-testid='controller']"))
      .toBeAttached({ timeout: 10_000 });
  });

  test("shows waiting state in the lobby phase", async ({ page }) => {
    await page.goto("/?sessionId=e2e-test");

    await expect(page.getByText(/waiting/i)).toBeVisible({ timeout: 10_000 });
  });
});
