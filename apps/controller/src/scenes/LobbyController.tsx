export function LobbyController() {
  return (
    <div className="scene lobby">
      <h1 className="game-title">TokenRaider</h1>
      <p className="lobby-status">Waiting for game to start...</p>
      <div className="lobby-hint">
        <p>Use voice commands or the D-pad to move and collect tokens.</p>
      </div>
    </div>
  );
}
