import { test, expect } from "@playwright/test";

test.describe("Events listing", () => {
  test("homepage shows events and links work", async ({ page }) => {
    await page.goto("/");

    // At least one event visible
    const cards = page.locator("a[href^='/events/']");
    await expect(cards.first()).toBeVisible();

    // Each card should display key info
    const firstCard = cards.first();
    await expect(firstCard).toContainText(/.+/);

    // Clicking should navigate to detail page
    await firstCard.click();
    await expect(page.locator("h1")).toBeVisible();
  });
});
