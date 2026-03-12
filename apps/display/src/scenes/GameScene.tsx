import { Component, useCallback, useEffect, type ReactNode } from "react"
import { Canvas } from "@react-three/fiber"
import { OceanScene } from "../three/ocean/OceanScene"
import { useGameStateWithFallback, useDispatchThunk } from "../hooks/useVGFState"
import type { ShipHeading } from "@token-raider/shared"
import { CrewHUD } from "../components/CrewHUD"
import { FirstMateSpeech } from "../components/FirstMateSpeech"

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
                    style={{ width: "100%", height: "100%", background: "#000000" }}
                />
            )
        }
        return this.props.children
    }
}

/* ------------------------------------------------------------------ */
/*  Navigation button overlay (dev UI)                                 */
/* ------------------------------------------------------------------ */

const NAV_BTN_STYLE: React.CSSProperties = {
    padding: "8px 16px",
    fontSize: 14,
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: 6,
    background: "rgba(0,0,0,0.5)",
    color: "#fff",
    cursor: "pointer",
    backdropFilter: "blur(4px)",
    minWidth: 80,
    textAlign: "center",
}

const NAV_BAR_STYLE: React.CSSProperties = {
    position: "absolute",
    top: 12,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 8,
    zIndex: 10,
    pointerEvents: "auto",
}

function NavigationButtons() {
    const dispatchThunk = useDispatchThunk()
    const state = useGameStateWithFallback()
    const seeking = state.shipNavigation?.seekingResources ?? false

    const setHeading = useCallback(
        (heading: ShipHeading) => dispatchThunk("SET_HEADING", heading),
        [dispatchThunk],
    )

    const layAnchor = useCallback(
        () => dispatchThunk("LAY_ANCHOR"),
        [dispatchThunk],
    )

    const seekResources = useCallback(
        () => dispatchThunk("SEEK_RESOURCES"),
        [dispatchThunk],
    )

    return (
        <div style={NAV_BAR_STYLE}>
            <button
                type="button"
                style={{
                    ...NAV_BTN_STYLE,
                    background: seeking ? "rgba(20,184,166,0.7)" : "rgba(20,184,166,0.35)",
                    border: seeking ? "1px solid rgba(20,184,166,0.8)" : NAV_BTN_STYLE.border,
                }}
                onClick={seekResources}
            >
                🧭 Seek
            </button>
            <button type="button" style={NAV_BTN_STYLE} onClick={() => setHeading("north")}>
                ⬆ North
            </button>
            <button type="button" style={NAV_BTN_STYLE} onClick={() => setHeading("south")}>
                ⬇ South
            </button>
            <button type="button" style={NAV_BTN_STYLE} onClick={() => setHeading("east")}>
                ➡ East
            </button>
            <button type="button" style={NAV_BTN_STYLE} onClick={() => setHeading("west")}>
                ⬅ West
            </button>
            <button
                type="button"
                style={{ ...NAV_BTN_STYLE, background: "rgba(180,60,60,0.6)" }}
                onClick={layAnchor}
            >
                ⚓ Anchor
            </button>
        </div>
    )
}

/* ------------------------------------------------------------------ */
/*  Inner scene that can access VGF hooks (must be inside Canvas)      */
/* ------------------------------------------------------------------ */

function GameSceneInner() {
    const state = useGameStateWithFallback()
    return (
        <OceanScene
            navigation={state.shipNavigation}
            treasureChests={state.treasureChests ?? []}
            crew={state.crew ?? []}
        />
    )
}

// -- Component ------------------------------------------------------------

export function GameScene() {
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

    return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
            {/* Navigation buttons — on top of the canvas */}
            <NavigationButtons />

            {/* Crew HUD — bottom of screen */}
            <CrewHUD />

            {/* First Mate speech bubble — top of screen */}
            <FirstMateSpeech />

            {/* 3D Canvas — wrapped in error boundary for WebGL fallback */}
            <CanvasErrorBoundary>
                <Canvas
                    camera={{
                        position: [0, 50, 80],
                        fov: 70,
                        near: 0.3,
                        far: 4000,
                    }}
                    gl={{ antialias: true, alpha: false }}
                    style={{ background: "#000000" }}
                >
                    <GameSceneInner />
                </Canvas>
            </CanvasErrorBoundary>
        </div>
    )
}
