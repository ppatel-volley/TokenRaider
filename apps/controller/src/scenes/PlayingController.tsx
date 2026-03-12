import { useCallback, useRef } from "react";
import { useStateSyncSelector, useDispatchThunk } from "../hooks/useVGFState";
import type { ShipHeading } from "@token-raider/shared";

/* ------------------------------------------------------------------ */
/*  Inline styles for ship navigation buttons (phone controller)       */
/* ------------------------------------------------------------------ */

const NAV_BTN: React.CSSProperties = {
  padding: "12px 0",
  fontSize: 15,
  fontWeight: 600,
  border: "1px solid rgba(255,255,255,0.25)",
  borderRadius: 8,
  background: "rgba(0,0,0,0.45)",
  color: "#fff",
  cursor: "pointer",
  flex: 1,
  textAlign: "center",
  WebkitTapHighlightColor: "transparent",
  touchAction: "manipulation",
};

const ANCHOR_BTN: React.CSSProperties = {
  ...NAV_BTN,
  background: "rgba(180,60,60,0.55)",
  flex: "none",
  width: "100%",
  padding: "14px 0",
};

const NAV_GRID: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
  padding: "0 16px",
  marginTop: 12,
};

export function PlayingController() {
  const score = useStateSyncSelector((s) => s.score);
  const tokensRemaining = useStateSyncSelector((s) => s.tokensRemaining);
  const timerStartedAt = useStateSyncSelector((s) => s.timerStartedAt);
  const timerDuration = useStateSyncSelector((s) => s.timerDuration);
  const crew = useStateSyncSelector((s) => s.crew ?? []);
  const activeCrew = crew.filter((c: { status: string }) => c.status === "active").length;
  const seeking = useStateSyncSelector((s) => s.shipNavigation?.seekingResources ?? false);
  const dispatchThunk = useDispatchThunk();
  const micActiveRef = useRef(false);

  /* -- Ship heading helpers ---------------------------------------- */

  const setHeading = useCallback(
    (heading: ShipHeading) => dispatchThunk("SET_HEADING", heading),
    [dispatchThunk],
  );

  const layAnchor = useCallback(
    () => dispatchThunk("LAY_ANCHOR"),
    [dispatchThunk],
  );

  const seekResources = useCallback(
    () => dispatchThunk("SEEK_RESOURCES"),
    [dispatchThunk],
  );

  /* -- Legacy callbacks (kept for future token / voice features) ---- */

  const handleMicDown = useCallback(() => {
    if (micActiveRef.current) return;
    micActiveRef.current = true;
    dispatchThunk("VOICE_START");
  }, [dispatchThunk]);

  const handleMicUp = useCallback(() => {
    if (!micActiveRef.current) return;
    micActiveRef.current = false;
    dispatchThunk("VOICE_STOP");
  }, [dispatchThunk]);

  const secondsLeft = Math.max(
    0,
    Math.ceil((timerStartedAt + timerDuration - Date.now()) / 1000),
  );

  return (
    <div className="scene playing">
      {/* HUD */}
      <div className="hud">
        <div className="hud-item">
          <span className="hud-label">Score</span>
          <span className="hud-value">{score}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Crew</span>
          <span className="hud-value">{activeCrew}/{crew.length}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Time</span>
          <span className="hud-value">{secondsLeft}s</span>
        </div>
      </div>

      {/* Ship navigation controls */}
      <div style={NAV_GRID}>
        <button
          type="button"
          style={{
            ...NAV_BTN,
            background: seeking ? "rgba(20,184,166,0.7)" : "rgba(20,184,166,0.35)",
            border: seeking ? "1px solid rgba(20,184,166,0.8)" : NAV_BTN.border,
            flex: "none",
            width: "100%",
          }}
          onClick={seekResources}
        >
          🧭 Seek Resources
        </button>
        <button type="button" style={NAV_BTN} onClick={() => setHeading("north")}>
          ⬆ North
        </button>
        <button type="button" style={NAV_BTN} onClick={() => setHeading("south")}>
          ⬇ South
        </button>
        <button type="button" style={NAV_BTN} onClick={() => setHeading("east")}>
          ➡ East
        </button>
        <button type="button" style={NAV_BTN} onClick={() => setHeading("west")}>
          ⬅ West
        </button>
        <button type="button" style={ANCHOR_BTN} onClick={layAnchor}>
          ⚓ Lay Anchor
        </button>
      </div>

      {/* Push-to-talk mic button */}
      <button
        className="mic-button"
        onTouchStart={handleMicDown}
        onTouchEnd={handleMicUp}
        onMouseDown={handleMicDown}
        onMouseUp={handleMicUp}
        type="button"
        aria-label="Push to talk"
      >
        <svg
          viewBox="0 0 24 24"
          width="48"
          height="48"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm-1-9a1 1 0 1 1 2 0v6a1 1 0 1 1-2 0V5zm6 6a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.93V20H8v2h8v-2h-3v-2.07A7 7 0 0 0 19 11h-2z" />
        </svg>
        <span>Hold to Talk</span>
      </button>
    </div>
  );
}
