/// <reference types="node" />
/// <reference types="@playwright/test" />

import { test, expect } from "@playwright/test";

test.describe("Events Platform", () => {
  test("user can sign up for an event and see calendar options", async ({ page }) => {
    // Go to homepage where events list is rendered
    await page.goto("http://localhost:3000/");

    // Click first event link (any link to /events/[id])
    const firstEvent = page.locator("a[href^='/events/']").first();
    await firstEvent.click();

    // Fill signup form
    await page.fill("input#name", "Test User");
    await page.fill("input#email", "test@example.com");

    // Submit form
    await page.click("button:has-text('Sign Up')");

    // Expect success message
    await expect(page.locator("text=Thanks for signing up!")).toBeVisible();

    // Calendar buttons
    await expect(page.locator("text=Google Calendar")).toBeVisible();
    await expect(page.locator("text=Download .ics")).toBeVisible();
  });
});
