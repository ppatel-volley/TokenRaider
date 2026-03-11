import { useCallback } from "react";
import {
  useStateSyncSelector,
  useDispatchThunk,
} from "../hooks/useVGFState";

export function RoundEndController() {
  const lastRoundScore = useStateSyncSelector((s) => s.lastRoundScore);
  const score = useStateSyncSelector((s) => s.score);
  const round = useStateSyncSelector((s) => s.round);
  const dispatchThunk = useDispatchThunk();

  const handleNextRound = useCallback(() => {
    dispatchThunk("NEXT_ROUND");
  }, [dispatchThunk]);

  return (
    <div className="scene round-end">
      <h1>Round {round} Complete</h1>
      <div className="score-display">
        <div className="score-row">
          <span className="score-label">Round Score</span>
          <span className="score-value">{lastRoundScore ?? 0}</span>
        </div>
        <div className="score-row">
          <span className="score-label">Total Score</span>
          <span className="score-value">{score}</span>
        </div>
      </div>
      <button
        className="action-btn"
        onTouchStart={handleNextRound}
        onClick={handleNextRound}
        type="button"
      >
        Next Round
      </button>
    </div>
  );
}
