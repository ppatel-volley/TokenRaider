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

const headingStyle: React.CSSProperties = {
    fontSize: 48,
    fontWeight: 800,
    marginBottom: 16,
}

const scoreStyle: React.CSSProperties = {
    fontSize: 80,
    fontWeight: 800,
    marginBottom: 8,
    color: "#fbbf24",
}

const labelStyle: React.CSSProperties = {
    fontSize: 20,
    opacity: 0.6,
    marginBottom: 8,
}

const highScoreStyle: React.CSSProperties = {
    fontSize: 18,
    opacity: 0.5,
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
}

export function GameOverScene() {
    const state = useStateSync()
    const dispatchThunk = useDispatchThunk()
    const { isRemoteMode } = useInputMode()

    const handlePlayAgain = useCallback(() => {
        dispatchThunk("PLAY_AGAIN", {})
    }, [dispatchThunk])

    const { focusIndex, itemRefs } = useDPadNavigation({
        itemCount: 1,
        gridColumns: 1,
        enabled: isRemoteMode,
        onSelect: handlePlayAgain,
    })

    const finalScore = "score" in state ? state.score : 0
    const highScore = "highScore" in state ? state.highScore : 0
    const isFocused = isRemoteMode && focusIndex === 0

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>Game Over</h1>
            <p style={labelStyle}>Final Score</p>
            <p style={scoreStyle}>{finalScore}</p>
            <p style={highScoreStyle}>High Score: {highScore}</p>

            <button
                ref={(el) => {
                    itemRefs.current[0] = el
                }}
                tabIndex={0}
                onClick={handlePlayAgain}
                style={{
                    ...buttonBaseStyle,
                    background: isFocused
                        ? "#fbbf24"
                        : "rgba(251, 191, 36, 0.8)",
                    color: isFocused ? "#0a0a1a" : "#0a0a1a",
                    border: isFocused
                        ? "3px solid #ffffff"
                        : "3px solid transparent",
                    transform: isFocused ? "scale(1.05)" : "scale(1)",
                }}
            >
                Play Again
            </button>
        </div>
    )
}
