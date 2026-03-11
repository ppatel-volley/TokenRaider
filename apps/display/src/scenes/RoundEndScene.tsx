import { useCallback } from "react"
import { useStateSync, useDispatchThunk } from "../hooks/useVGFState"
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

const scoreStyle: React.CSSProperties = {
    fontSize: 72,
    fontWeight: 800,
    marginBottom: 8,
    color: "#fbbf24",
}

const labelStyle: React.CSSProperties = {
    fontSize: 22,
    opacity: 0.6,
    marginBottom: 32,
}

const highScoreStyle: React.CSSProperties = {
    fontSize: 18,
    opacity: 0.5,
    marginBottom: 48,
}

const buttonRowStyle: React.CSSProperties = {
    display: "flex",
    gap: 24,
}

const buttonBaseStyle: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 600,
    padding: "14px 40px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.15s ease",
}

export function RoundEndScene() {
    const state = useStateSync()
    const dispatchThunk = useDispatchThunk()
    const { isRemoteMode } = useInputMode()

    const handleNextRound = useCallback(() => {
        dispatchThunk("NEXT_ROUND", {})
    }, [dispatchThunk])

    const handleQuit = useCallback(() => {
        dispatchThunk("QUIT_GAME", {})
    }, [dispatchThunk])

    const handleSelect = useCallback(
        (index: number) => {
            if (index === 0) handleNextRound()
            if (index === 1) handleQuit()
        },
        [handleNextRound, handleQuit],
    )

    const { focusIndex, itemRefs } = useDPadNavigation({
        itemCount: 2,
        gridColumns: 2,
        enabled: isRemoteMode,
        onSelect: handleSelect,
    })

    const roundScore =
        "lastRoundScore" in state ? (state.lastRoundScore ?? 0) : 0
    const highScore = "highScore" in state ? state.highScore : 0

    return (
        <div style={containerStyle}>
            <p style={labelStyle}>Round Complete</p>
            <p style={scoreStyle}>{roundScore}</p>
            <p style={highScoreStyle}>High Score: {highScore}</p>

            <div style={buttonRowStyle}>
                {["Next Round", "Quit"].map((label, index) => {
                    const isFocused = isRemoteMode && focusIndex === index
                    return (
                        <button
                            key={label}
                            ref={(el) => {
                                itemRefs.current[index] = el
                            }}
                            tabIndex={isFocused ? 0 : -1}
                            onClick={() => handleSelect(index)}
                            style={{
                                ...buttonBaseStyle,
                                background: isFocused
                                    ? "#fbbf24"
                                    : "rgba(255, 255, 255, 0.1)",
                                color: isFocused ? "#0a0a1a" : "#ffffff",
                                border: isFocused
                                    ? "3px solid #ffffff"
                                    : "3px solid transparent",
                                transform: isFocused
                                    ? "scale(1.05)"
                                    : "scale(1)",
                            }}
                        >
                            {label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
