import { test, expect } from "@playwright/test"

const DISPLAY_URL =
    "http://localhost:3000/?sessionId=dev-test&userId=display-dev&inputMode=remote"

test("clicking Play transitions to game scene", async ({ page }) => {
    const logs: string[] = []
    page.on("console", (msg) => {
        logs.push(`[${msg.type()}] ${msg.text()}`)
    })
    page.on("pageerror", (err) => {
        logs.push(`[pageerror] ${err.message}`)
    })

    await page.goto(DISPLAY_URL)
    await page.getByText("Press Enter to Play").waitFor({ timeout: 10000 })
    console.log("Lobby visible")

    // Click the play button
    await page.getByText("Press Enter to Play").click()
    console.log("Button clicked")

    // Wait for either game scene (canvas) or timeout
    const result = await Promise.race([
        page.locator("canvas").waitFor({ timeout: 15000 }).then(() => "game-scene" as const),
        page.waitForTimeout(15000).then(() => "timeout" as const),
    ])

    // Dump relevant logs
    const relevantLogs = logs.filter(
        (l) =>
            l.includes("[VGF]") ||
            l.includes("Dispatch") ||
            l.includes("error") ||
            l.includes("Error") ||
            l.includes("phase"),
    )
    console.log("\n=== Relevant logs ===")
    for (const log of relevantLogs) {
        console.log(log)
    }

    console.log("\nResult:", result)
    expect(result).toBe("game-scene")
})
