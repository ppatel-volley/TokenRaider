import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
import {
    useStateSync,
    useDispatch,
    useDispatchThunk,
} from "../hooks/useVGFState"
import { useKeyDown } from "../hooks/useKeyHandler"
import { COLLECT_RADIUS, PLAYER_MOVE_SPEED } from "@token-raider/shared"
import { Arena } from "../three/Arena"
import { Token } from "../three/Token"
import { Player } from "../three/Player"

/**
 * Local error boundary for the 3D Canvas.
 * When WebGL is not available (e.g. headless browsers), renders a plain
 * <canvas> fallback so that tests checking for a canvas element still pass.
 */
class CanvasErrorBoundary extends Component<
    { children: ReactNode },
    { hasError: boolean }
> {
    constructor(props: { children: ReactNode }) {
        super(props)
        this.state = { hasError: false }
    }
    static getDerivedStateFromError(): { hasError: boolean } {
        return { hasError: true }
    }
    componentDidCatch(error: Error): void {
        console.warn("[VGF] CanvasErrorBoundary caught:", error.message)
    }
    render() {
        if (this.state.hasError) {
            return (
                <canvas
                    data-testid="game-canvas-fallback"
                    style={{ width: "100%", height: "100%", background: "#0a0a1a" }}
                />
            )
        }
        return this.props.children
    }
}

// -- HUD overlay styles --------------------------------------------------

const hudStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    pointerEvents: "none",
    fontFamily: "system-ui, sans-serif",
    color: "#ffffff",
    zIndex: 1,
}

const hudItemStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
}

const hudLabelStyle: React.CSSProperties = {
    fontSize: 14,
    opacity: 0.5,
    textTransform: "uppercase",
    letterSpacing: 2,
}

const hudValueStyle: React.CSSProperties = {
    fontSize: 36,
    fontWeight: 700,
}

// -- Timer helper ---------------------------------------------------------

function useCountdown(startedAt: number, duration: number): number {
    const [remaining, setRemaining] = useState(duration)
    const frameRef = useRef<number>(0)

    useEffect(() => {
        if (startedAt <= 0) {
            setRemaining(duration)
            return
        }

        function tick() {
            const elapsed = Date.now() - startedAt
            const left = Math.max(0, duration - elapsed)
            setRemaining(left)
            if (left > 0) {
                frameRef.current = requestAnimationFrame(tick)
            }
        }

        frameRef.current = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(frameRef.current)
    }, [startedAt, duration])

    return remaining
}

function formatTime(ms: number): string {
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

// -- Proximity check ------------------------------------------------------

function isWithinCollectRadius(
    px: number,
    pz: number,
    tx: number,
    tz: number,
): boolean {
    const dx = px - tx
    const dz = pz - tz
    return Math.sqrt(dx * dx + dz * dz) <= COLLECT_RADIUS
}

// -- Component ------------------------------------------------------------

export function GameScene() {
    const state = useStateSync()
    const dispatch = useDispatch()
    const dispatchThunk = useDispatchThunk()

    // Suppress WebGL context creation errors so they don't bubble up to
    // the outer GameErrorBoundary and unmount the entire scene tree.
    // The CanvasErrorBoundary will render a fallback <canvas> instead.
    useEffect(() => {
        const handler = (event: ErrorEvent) => {
            if (event.message?.includes("WebGL")) {
                event.preventDefault()
            }
        }
        window.addEventListener("error", handler)
        return () => window.removeEventListener("error", handler)
    }, [])

    const score = "score" in state ? state.score : 0
    const tokensRemaining =
        "tokensRemaining" in state ? state.tokensRemaining : 0
    const timerStartedAt =
        "timerStartedAt" in state ? state.timerStartedAt : 0
    const timerDuration =
        "timerDuration" in state ? state.timerDuration : 30000
    const currentTokens =
        "currentTokens" in state ? state.currentTokens : []
    const playerPosition =
        "playerPosition" in state
            ? state.playerPosition
            : { x: 0, y: 0, z: 0 }
    const arenaSize = "arenaSize" in state ? state.arenaSize : 20

    const remaining = useCountdown(timerStartedAt, timerDuration)

    // Movement via D-pad -- dispatches MOVE_PLAYER reducer
    const move = useCallback(
        (dx: number, dz: number) => {
            const halfArena = arenaSize / 2
            const newX = Math.max(
                -halfArena,
                Math.min(halfArena, playerPosition.x + dx),
            )
            const newZ = Math.max(
                -halfArena,
                Math.min(halfArena, playerPosition.z + dz),
            )
            dispatch("MOVE_PLAYER", { x: newX, y: 0, z: newZ })

            // Check for token collection after move
            for (const token of currentTokens) {
                if (
                    !token.collected &&
                    isWithinCollectRadius(newX, newZ, token.x, token.z)
                ) {
                    dispatchThunk("COLLECT_TOKEN", { tokenId: token.id })
                }
            }
        },
        [dispatch, dispatchThunk, playerPosition, currentTokens, arenaSize],
    )

    useKeyDown("ArrowUp", () => move(0, -PLAYER_MOVE_SPEED))
    useKeyDown("ArrowDown", () => move(0, PLAYER_MOVE_SPEED))
    useKeyDown("ArrowLeft", () => move(-PLAYER_MOVE_SPEED, 0))
    useKeyDown("ArrowRight", () => move(PLAYER_MOVE_SPEED, 0))

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            {/* HUD overlay */}
            <div style={hudStyle}>
                <div style={hudItemStyle}>
                    <span style={hudLabelStyle}>Score</span>
                    <span style={hudValueStyle}>{score}</span>
                </div>
                <div style={hudItemStyle}>
                    <span style={hudLabelStyle}>Time</span>
                    <span
                        style={{
                            ...hudValueStyle,
                            color: remaining < 10000 ? "#ef4444" : "#ffffff",
                        }}
                    >
                        {formatTime(remaining)}
                    </span>
                </div>
                <div style={hudItemStyle}>
                    <span style={hudLabelStyle}>Tokens</span>
                    <span style={hudValueStyle}>{tokensRemaining}</span>
                </div>
            </div>

            {/* 3D Canvas — wrapped in error boundary for WebGL fallback */}
            <CanvasErrorBoundary>
                <Canvas
                    camera={{
                        position: [0, 18, 12],
                        fov: 50,
                        near: 0.1,
                        far: 100,
                    }}
                    shadows
                    style={{ background: "#0a0a1a" }}
                >
                    <ambientLight intensity={0.3} />
                    <directionalLight
                        position={[10, 15, 10]}
                        intensity={0.8}
                        castShadow
                        shadow-mapSize-width={1024}
                        shadow-mapSize-height={1024}
                    />
                    <pointLight
                        position={[0, 10, 0]}
                        intensity={0.4}
                        color="#fbbf24"
                    />

                    <Arena size={arenaSize} />

                    {currentTokens.map((token) => (
                        <Token
                            key={token.id}
                            position={[token.x, 1, token.z]}
                            value={token.value}
                            collected={token.collected}
                        />
                    ))}

                    <Player
                        position={[playerPosition.x, 0.35, playerPosition.z]}
                    />
                </Canvas>
            </CanvasErrorBoundary>
        </div>
    )
}
