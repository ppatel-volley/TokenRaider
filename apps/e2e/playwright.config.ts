import { defineConfig, devices } from "@playwright/test";

const CI = !!process.env.CI;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  workers: CI ? 1 : undefined,
  timeout: 30_000,

  reporter: [["html", { open: CI ? "never" : "on-failure" }]],

  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "display",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://localhost:3000",
        launchOptions: {
          args: [
            "--use-gl=egl",
            "--enable-webgl",
            "--ignore-gpu-blocklist",
          ],
        },
      },
    },
    {
      name: "controller-mobile",
      use: {
        ...devices["Pixel 7"],
        baseURL: "http://localhost:5173",
      },
    },
  ],

  webServer: [
    {
      command: "pnpm --filter @token-raider/server dev",
      cwd: "../..",
      url: "http://localhost:8080",
      reuseExistingServer: !CI,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @token-raider/display dev",
      cwd: "../..",
      url: "http://localhost:3000",
      reuseExistingServer: !CI,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @token-raider/controller dev",
      cwd: "../..",
      url: "http://localhost:5173",
      reuseExistingServer: !CI,
      timeout: 120_000,
    },
  ],
});
