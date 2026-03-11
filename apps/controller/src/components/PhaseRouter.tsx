import { useStateSync } from "../hooks/useVGFState";
import { LobbyController } from "../scenes/LobbyController";
import { PlayingController } from "../scenes/PlayingController";
import { RoundEndController } from "../scenes/RoundEndController";
import { GameOverController } from "../scenes/GameOverController";

export function PhaseRouter() {
  const state = useStateSync();

  // VGF state starts as {} — guard before accessing phase
  if (!("phase" in state)) {
    return (
      <div className="loading-screen">
        <p>Waiting for game state...</p>
      </div>
    );
  }

  switch (state.phase) {
    case "lobby":
      return <LobbyController />;
    case "playing":
      return <PlayingController />;
    case "roundEnd":
      return <RoundEndController />;
    case "gameOver":
      return <GameOverController />;
    default:
      return (
        <div className="loading-screen">
          <p>Waiting for game...</p>
        </div>
      );
  }
}
