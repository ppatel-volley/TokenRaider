import { useCallback, useRef } from "react";
import { useStateSyncSelector, useDispatchThunk } from "../hooks/useVGFState";

export function PlayingController() {
  const score = useStateSyncSelector((s) => s.score);
  const tokensRemaining = useStateSyncSelector((s) => s.tokensRemaining);
  const timerStartedAt = useStateSyncSelector((s) => s.timerStartedAt);
  const timerDuration = useStateSyncSelector((s) => s.timerDuration);
  const dispatchThunk = useDispatchThunk();
  const micActiveRef = useRef(false);

  const sendDirection = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      dispatchThunk("MOVE", direction);
    },
    [dispatchThunk],
  );

  const handleCollect = useCallback(() => {
    dispatchThunk("COLLECT");
  }, [dispatchThunk]);

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
          <span className="hud-label">Tokens</span>
          <span className="hud-value">{tokensRemaining}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Time</span>
          <span className="hud-value">{secondsLeft}s</span>
        </div>
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

      {/* Directional pad */}
      <div className="dpad">
        <button
          className="dpad-btn dpad-up"
          onTouchStart={() => sendDirection("up")}
          type="button"
          aria-label="Move up"
        >
          &#9650;
        </button>
        <div className="dpad-middle-row">
          <button
            className="dpad-btn dpad-left"
            onTouchStart={() => sendDirection("left")}
            type="button"
            aria-label="Move left"
          >
            &#9664;
          </button>
          <button
            className="collect-btn"
            onTouchStart={handleCollect}
            type="button"
            aria-label="Collect token"
          >
            Collect
          </button>
          <button
            className="dpad-btn dpad-right"
            onTouchStart={() => sendDirection("right")}
            type="button"
            aria-label="Move right"
          >
            &#9654;
          </button>
        </div>
        <button
          className="dpad-btn dpad-down"
          onTouchStart={() => sendDirection("down")}
          type="button"
          aria-label="Move down"
        >
          &#9660;
        </button>
      </div>
    </div>
  );
}
