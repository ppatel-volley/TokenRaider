import { useCallback } from "react";
import {
  useStateSyncSelector,
  useDispatchThunk,
} from "../hooks/useVGFState";

export function GameOverController() {
  const score = useStateSyncSelector((s) => s.score);
  const highScore = useStateSyncSelector((s) => s.highScore);
  const dispatchThunk = useDispatchThunk();

  const handlePlayAgain = useCallback(() => {
    dispatchThunk("PLAY_AGAIN");
  }, [dispatchThunk]);

  return (
    <div className="scene game-over">
      <h1>Game Over</h1>
      <div className="score-display">
        <div className="score-row">
          <span className="score-label">Final Score</span>
          <span className="score-value final">{score}</span>
        </div>
        <div className="score-row">
          <span className="score-label">High Score</span>
          <span className="score-value">{highScore}</span>
        </div>
      </div>
      <button
        className="action-btn"
        onTouchStart={handlePlayAgain}
        onClick={handlePlayAgain}
        type="button"
      >
        Play Again
      </button>
    </div>
  );
}
