export interface Token {
  id: string;
  x: number;
  y: number;
  z: number;
  value: number;
  collected: boolean;
}

export interface PlayerPosition {
  x: number;
  y: number;
  z: number;
}

export interface TokenRaiderState {
  [key: string]: unknown;
  phase: string;
  round: number;
  score: number;
  tokensCollected: number;
  tokensRemaining: number;
  timerStartedAt: number;
  timerDuration: number;
  timerPausedAt: number | null;
  currentTokens: Token[];
  playerPosition: PlayerPosition;
  controllerConnected: boolean;
  pairingCode: string | null;
  controllerUrl: string | null;
  remoteMode: boolean;
  isFtue: boolean;
  lastRoundScore: number | null;
  highScore: number;
  arenaSize: number;
  nextPhase: string | null;
}
