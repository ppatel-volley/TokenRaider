import { useState, useEffect } from "react"
import { getVGFHooks } from "@volley/vgf/client"
import type { TokenRaiderState } from "@token-raider/shared"
import { createInitialGameState } from "@token-raider/shared"
import { useRawSocket } from "../providers/VGFDisplayProvider"

const {
    useStateSync,
    useStateSyncSelector,
    useDispatch,
    useDispatchThunk: useDispatchThunkInternal,
    useConnectionStatus,
} = getVGFHooks<any, TokenRaiderState, string>()

/**
 * Wrapper around VGF's useDispatchThunk that accepts optional extra args.
 *
 * The raw VGF hook defaults the extra-args generic to `never[]`, which
 * makes it impossible to pass payloads without adjusting the generic at
 * the call-site. This thin wrapper relaxes the signature so callers can
 * pass `(thunkName, payload)` without casting.
 */
function useDispatchThunk(): (thunkName: string, ...args: unknown[]) => void {
    const dt = useDispatchThunkInternal()
    return dt as (thunkName: string, ...args: unknown[]) => void
}

/**
 * Provides game state from VGF with a fallback for the browser Socket.IO
 * "message" event bug.
 *
 * In browser environments, socket.on("message") does not fire for
 * server-broadcasted STATE_UPDATE messages, but socket.onAny() does.
 * This hook uses the raw socket's onAny listener (exposed via
 * RawSocketContext in VGFDisplayProvider) to reliably receive state
 * updates.
 */
function useGameStateWithFallback(): TokenRaiderState {
    const [directState, setDirectState] = useState<TokenRaiderState | null>(
        null,
    )
    const rawSocket = useRawSocket()

    // Standard VGF hook
    let syncState: TokenRaiderState | null
    try {
        syncState = useStateSync()
    } catch {
        syncState = null
    }

    // Use onAny on raw Socket.IO socket to catch STATE_UPDATE events
    useEffect(() => {
        if (!rawSocket?.onAny) return

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handler = (eventName: string, ...args: any[]) => {
            if (eventName === "message" && args[0]?.type === "STATE_UPDATE") {
                const state = args[0]?.session?.state
                if (state && "phase" in state) {
                    setDirectState(state as TokenRaiderState)
                }
            }
        }

        rawSocket.onAny(handler)
        return () => rawSocket.offAny(handler)
    }, [rawSocket])

    if (syncState && "phase" in syncState) {
        return syncState
    }
    if (directState) {
        return directState
    }
    return createInitialGameState()
}

export {
    useStateSync,
    useStateSyncSelector,
    useDispatch,
    useDispatchThunk,
    useConnectionStatus,
    useGameStateWithFallback,
}
