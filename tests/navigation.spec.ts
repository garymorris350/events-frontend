// tests/navigation.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("unknown route shows not found", async ({ page }) => {
    await page.goto("/events/does-not-exist");
    await expect(page.locator("h1")).toHaveText("404 – Page Not Found");
  });
});
