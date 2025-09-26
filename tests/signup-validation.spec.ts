import { test, expect } from "@playwright/test";

test.describe("Signup form validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("a[href^='/events/']").first().click();
  });

  test("shows error on empty submit", async ({ page }) => {
    await page.click("button:has-text('Sign Up')");
    await expect(page.locator("text=Name is required")).toBeVisible();
    await expect(page.locator("text=Email is required")).toBeVisible();
  });

  test("shows error on invalid email", async ({ page }) => {
    await page.fill("input#name", "Test User");
    await page.fill("input#email", "not-an-email");
    await page.click("button:has-text('Sign Up')");
    await expect(page.locator("text=Invalid email")).toBeVisible();
  });
});
