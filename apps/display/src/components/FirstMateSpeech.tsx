import { useEffect, useState } from "react"
import { useGameStateWithFallback } from "../hooks/useVGFState"
import { FIRST_MATE_SPEECH_DURATION_MS } from "@token-raider/shared"

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const BUBBLE_CONTAINER: React.CSSProperties = {
    position: "absolute",
    top: 80,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 10,
    pointerEvents: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}

const BUBBLE: React.CSSProperties = {
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(8px)",
    border: "2px solid rgba(255,215,0,0.6)",
    borderRadius: 16,
    padding: "10px 20px",
    maxWidth: 340,
    textAlign: "center",
    fontFamily: "system-ui, sans-serif",
    position: "relative",
}

const MESSAGE: React.CSSProperties = {
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.4,
}

const LABEL: React.CSSProperties = {
    color: "#fbbf24",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 4,
}

const TAIL: React.CSSProperties = {
    width: 0,
    height: 0,
    borderLeft: "8px solid transparent",
    borderRight: "8px solid transparent",
    borderTop: "10px solid rgba(255,215,0,0.6)",
    marginTop: -1,
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function FirstMateSpeech() {
    const state = useGameStateWithFallback()
    const speech = state.firstMateSpeech ?? null
    const [visible, setVisible] = useState(false)
    const [displaySpeech, setDisplaySpeech] = useState(speech)

    useEffect(() => {
        if (speech) {
            setDisplaySpeech(speech)
            setVisible(true)

            const timer = setTimeout(() => {
                setVisible(false)
            }, FIRST_MATE_SPEECH_DURATION_MS)

            return () => clearTimeout(timer)
        }
        setVisible(false)
    }, [speech?.timestamp])

    if (!displaySpeech || !visible) return null

    return (
        <>
            <style>{`
                @keyframes speech-fade-in {
                    from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
                }
            `}</style>
            <div
                style={{
                    ...BUBBLE_CONTAINER,
                    animation: "speech-fade-in 0.3s ease-out",
                }}
            >
                <div style={BUBBLE}>
                    <div style={LABEL}>⚓ FIRST MATE</div>
                    <div style={MESSAGE}>{displaySpeech.message}</div>
                </div>
                <div style={TAIL} />
            </div>
        </>
    )
}
