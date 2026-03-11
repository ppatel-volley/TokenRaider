import type { ReactNode } from "react"
import { detectPlatform, isTV } from "../utils/detectPlatform"

/**
 * Conditionally wraps children in PlatformProvider.
 *
 * PlatformProvider crashes without volley_hub_session_id (only present on
 * real TV hardware). On web/dev we skip it entirely.
 */
export function MaybePlatformProvider({
    children,
}: {
    children: ReactNode
}) {
    if (!isTV(detectPlatform())) return <>{children}</>

    // NOTE: require() is used intentionally here, not import().
    // This is a synchronous conditional load that avoids bundling the SDK
    // in web builds. Vite handles this correctly in production builds.
    // Do NOT refactor to dynamic import() -- it changes the rendering semantics.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PlatformProvider } = require("@volley/platform-sdk/react")

    return (
        <PlatformProvider
            options={{
                gameId: "token-raider",
                appVersion: "0.1.0",
                stage: "staging",
                screensaverPrevention: { autoStart: true },
            }}
        >
            {children}
        </PlatformProvider>
    )
}
