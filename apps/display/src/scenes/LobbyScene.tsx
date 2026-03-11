import { useCallback } from "react"
import { useDispatchThunk } from "../hooks/useVGFState"
import { useInputMode } from "../providers/InputModeProvider"
import { useDPadNavigation } from "../hooks/useDPadNavigation"

const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(180deg, #0a0a1a 0%, #1a0a2e 100%)",
    color: "#ffffff",
    fontFamily: "system-ui, sans-serif",
}

const titleStyle: React.CSSProperties = {
    fontSize: 80,
    fontWeight: 800,
    letterSpacing: 6,
    marginBottom: 16,
    background: "linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
}

const subtitleStyle: React.CSSProperties = {
    fontSize: 22,
    opacity: 0.6,
    marginBottom: 48,
}

const buttonBaseStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 600,
    padding: "16px 48px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.15s ease",
    color: "#0a0a1a",
}

export function LobbyScene() {
    const dispatchThunk = useDispatchThunk()
    const { isRemoteMode } = useInputMode()

    const handlePlay = useCallback(() => {
        // WGFServer doesn't send Socket.IO acks, so dispatchThunk will
        // throw DispatchTimeoutError after 10s. But the thunk DOES execute
        // on the server — the state update arrives via the normal state sync.
        // We catch the timeout silently.
        try {
            dispatchThunk("ACTIVATE_REMOTE_MODE")
        } catch {
            // DispatchTimeoutError — expected, thunk still executes server-side
        }
    }, [dispatchThunk])

    const { focusIndex, itemRefs } = useDPadNavigation({
        itemCount: 1,
        gridColumns: 1,
        enabled: isRemoteMode,
        onSelect: handlePlay,
    })

    const isFocused = isRemoteMode && focusIndex === 0

    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>TokenRaider</h1>
            <p style={subtitleStyle}>Collect tokens. Beat the clock.</p>
            <button
                ref={(el) => {
                    itemRefs.current[0] = el
                }}
                tabIndex={0}
                onClick={handlePlay}
                style={{
                    ...buttonBaseStyle,
                    background: isFocused
                        ? "#fbbf24"
                        : "rgba(251, 191, 36, 0.8)",
                    border: isFocused
                        ? "3px solid #ffffff"
                        : "3px solid transparent",
                    transform: isFocused ? "scale(1.05)" : "scale(1)",
                }}
            >
                Press Enter to Play
            </button>
        </div>
    )
}
