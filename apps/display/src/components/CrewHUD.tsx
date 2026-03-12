import { useGameStateWithFallback } from "../hooks/useVGFState"
import { FIRST_MATE_WARN_THRESHOLD } from "@token-raider/shared"
import type { CrewMember } from "@token-raider/shared"

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const HUD_CONTAINER: React.CSSProperties = {
    position: "absolute",
    bottom: 16,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 12,
    zIndex: 10,
    pointerEvents: "none",
}

const CARD: React.CSSProperties = {
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(6px)",
    border: "1px solid rgba(255,215,0,0.35)",
    borderRadius: 10,
    padding: "8px 12px",
    minWidth: 120,
    textAlign: "center",
}

const CARD_ABANDONED: React.CSSProperties = {
    ...CARD,
    opacity: 0.4,
    border: "1px solid rgba(255,255,255,0.15)",
}

const NAME: React.CSSProperties = {
    color: "#fbbf24",
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
    letterSpacing: 0.5,
    fontFamily: "system-ui, sans-serif",
}

const BAR_CONTAINER: React.CSSProperties = {
    height: 6,
    borderRadius: 3,
    background: "rgba(255,255,255,0.12)",
    marginBottom: 4,
    overflow: "hidden",
}

const LABEL: React.CSSProperties = {
    fontSize: 9,
    color: "rgba(255,255,255,0.5)",
    textAlign: "left",
    marginBottom: 1,
    fontFamily: "system-ui, sans-serif",
}

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function NeedBar({ value, color }: { value: number; color: string }) {
    const isLow = value < FIRST_MATE_WARN_THRESHOLD
    return (
        <div style={BAR_CONTAINER}>
            <div
                style={{
                    height: "100%",
                    width: `${Math.max(0, Math.min(100, value))}%`,
                    borderRadius: 3,
                    background: isLow ? "#ef4444" : color,
                    transition: "width 0.3s ease, background 0.3s ease",
                    animation: isLow ? "pulse-bar 0.8s ease-in-out infinite" : "none",
                }}
            />
        </div>
    )
}

function CrewCard({ member }: { member: CrewMember }) {
    if (member.status === "abandoned") {
        return (
            <div style={CARD_ABANDONED}>
                <div style={NAME}>{member.name}</div>
                <div style={{ color: "#ef4444", fontSize: 11, fontWeight: 600 }}>
                    Abandoned Ship!
                </div>
            </div>
        )
    }

    return (
        <div style={CARD}>
            <div style={NAME}>{member.name}</div>
            <div style={LABEL}>Food</div>
            <NeedBar value={member.needs.food} color="#22c55e" />
            <div style={LABEL}>Morale</div>
            <NeedBar value={member.needs.morale} color="#fbbf24" />
        </div>
    )
}

export function CrewHUD() {
    const state = useGameStateWithFallback()
    const crew = state.crew ?? []

    if (crew.length === 0) return null

    return (
        <>
            {/* Pulse animation for low-need bars */}
            <style>{`
                @keyframes pulse-bar {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
            <div style={HUD_CONTAINER}>
                {crew.map((m) => (
                    <CrewCard key={m.id} member={m} />
                ))}
            </div>
        </>
    )
}
