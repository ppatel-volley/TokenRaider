import { test, expect } from "@playwright/test"

const DISPLAY_URL =
    "http://localhost:3000/?sessionId=dev-test&userId=display-dev&inputMode=remote"
const SERVER_URL = "http://127.0.0.1:8080"

test.describe("VGF Connection Debug", () => {
    test("server is reachable from browser", async ({ page }) => {
        // Test that the browser can reach the VGF server via fetch
        const response = await page.evaluate(async (url) => {
            const res = await fetch(
                `${url}/socket.io/?EIO=4&transport=polling`,
            )
            return { status: res.status, body: await res.text() }
        }, SERVER_URL)

        console.log("Server response:", response)
        expect(response.status).toBe(200)
        expect(response.body).toContain("sid")
    })

    test("display connects and shows lobby", async ({ page }) => {
        // Collect all console logs
        const logs: string[] = []
        page.on("console", (msg) => {
            const text = msg.text()
            logs.push(`[${msg.type()}] ${text}`)
            if (text.includes("[VGF]")) {
                console.log("BROWSER:", text)
            }
        })

        // Collect page errors
        const errors: string[] = []
        page.on("pageerror", (err) => {
            errors.push(err.message)
            console.log("PAGE ERROR:", err.message)
        })

        // Navigate
        await page.goto(DISPLAY_URL)

        // Wait up to 15 seconds for either lobby or error
        const result = await Promise.race([
            page
                .getByText("Press Enter to Play")
                .waitFor({ timeout: 15000 })
                .then(() => "lobby" as const),
            page
                .waitForTimeout(15000)
                .then(() => "timeout" as const),
        ])

        // Dump all VGF logs for debugging
        const vgfLogs = logs.filter((l) => l.includes("[VGF]"))
        console.log("\n=== VGF Logs ===")
        for (const log of vgfLogs) {
            console.log(log)
        }

        if (errors.length > 0) {
            console.log("\n=== Page Errors ===")
            for (const err of errors) {
                console.log(err)
            }
        }

        console.log("\n=== Result ===", result)

        expect(result).toBe("lobby")
    })

    test("display survives page refresh", async ({ page }) => {
        const logs: string[] = []
        page.on("console", (msg) => {
            const text = msg.text()
            logs.push(text)
            if (text.includes("[VGF]")) {
                console.log("BROWSER:", text)
            }
        })

        // First load
        await page.goto(DISPLAY_URL)
        await page
            .getByText("Press Enter to Play")
            .waitFor({ timeout: 15000 })
        console.log("First load: lobby visible")

        // Refresh
        await page.reload()

        // Should reconnect and show lobby again
        const visible = await page
            .getByText("Press Enter to Play")
            .waitFor({ timeout: 15000 })
            .then(() => true)
            .catch(() => false)

        const vgfLogs = logs.filter((l) => l.includes("[VGF]"))
        console.log("\n=== VGF Logs after refresh ===")
        for (const log of vgfLogs) {
            console.log(log)
        }

        expect(visible).toBe(true)
    })
})
