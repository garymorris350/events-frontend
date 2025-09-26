import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  webServer: {
    command: "npm run dev",                 // start Next.js
    cwd: ".",                               // frontend root
    url: "http://localhost:3000",           // Playwright waits for this
    timeout: 180 * 1000,                    // allow extra time for compile
    reuseExistingServer: !process.env.CI,   // don’t restart if already running
  },
});
