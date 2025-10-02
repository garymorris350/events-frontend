// tests/events.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Events Platform", () => {
  test("user can sign up for an event and see calendar options", async ({ page }) => {
    // Go to homepage
    await page.goto("/");

    // Click first event link
    const firstEvent = page.locator("a[href^='/events/']").first();
    await firstEvent.click();

    // Fill signup form
    await page.fill("input#name", "Test User");
    await page.fill("input#email", "test@example.com");

    // Submit form
    await page.click("button:has-text('Sign Up')");

    // Expect success message
    await expect(page.locator("text=Thanks for signing up!")).toBeVisible();

    // Calendar buttons should be visible
    const googleCalBtn = page.locator("a:has-text('Google Calendar')");
    const icsBtn = page.locator("a:has-text('Download .ics')");
    await expect(googleCalBtn).toBeVisible();
    await expect(icsBtn).toBeVisible();

    // Validate Google Calendar link points to correct domain & template
    const href = await googleCalBtn.getAttribute("href");
    expect(href).toBeTruthy();
    expect(href).toContain("calendar.google.com/calendar");
    expect(href).toContain("action=TEMPLATE");
    expect(href).toContain("text="); // event title param
  });
});
