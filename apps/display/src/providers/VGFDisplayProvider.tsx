/**
 * VGF provider wrapper for the DISPLAY client.
 *
 * Follows the same pattern as the working emoji-multiplatform reference:
 * - useMemo creates the transport once per mount
 * - VGFProvider (with default autoConnect: true) manages connect/close lifecycle
 * - No module-level singletons, no eager connect()
 *
 * Additionally exposes the raw Socket.IO socket via RawSocketContext so that
 * hooks can use socket.onAny() as a fallback for state updates.  In browser
 * environments socket.on("message") does not fire for server-broadcasted
 * STATE_UPDATE messages, but socket.onAny() does (a known Socket.IO quirk).
 */
import { createContext, useContext, useMemo, type ReactNode } from "react"
import {
    VGFProvider,
    SocketIOClientTransport,
    ClientType,
} from "@volley/vgf/client"
import { useInputMode } from "./InputModeProvider"

function getQueryParam(name: string, fallback: string): string {
    const params = new URLSearchParams(window.location.search)
    return params.get(name) ?? fallback
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RawSocketContext = createContext<any>(null)

export function useRawSocket() {
    return useContext(RawSocketContext)
}

export function VGFDisplayProvider({
    children,
}: {
    children: ReactNode
}) {
    const { isRemoteMode } = useInputMode()

    const { transport, rawSocket } = useMemo(() => {
        const url = import.meta.env.DEV
            ? "http://127.0.0.1:8080"
            : window.location.origin

        const sessionId = getQueryParam("sessionId", "")
        const userId = getQueryParam("userId", import.meta.env.DEV ? "display-dev" : "")

        console.log("[VGF] Creating transport", { url, sessionId, userId })

        const t = new SocketIOClientTransport({
            url,
            query: {
                sessionId,
                userId,
                clientType: ClientType.Display,
                ...(isRemoteMode ? { inputMode: "remote" } : {}),
            },
            socketOptions: {
                transports: ["polling", "websocket"],
                reconnectionAttempts: 10,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
            },
        } as ConstructorParameters<typeof SocketIOClientTransport>[0])

        // Extract the raw Socket.IO socket for the onAny workaround
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const socket = (t as any).socket ?? null

        return { transport: t, rawSocket: socket }
    }, [isRemoteMode])

    return (
        <RawSocketContext.Provider value={rawSocket}>
            <VGFProvider transport={transport}>{children}</VGFProvider>
        </RawSocketContext.Provider>
    )
}
