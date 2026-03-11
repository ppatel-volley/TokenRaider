import type { TokenRaiderState } from "./types.js";
import { ARENA_SIZE, TIMER_DURATION_MS } from "./constants.js";

/** Create a fresh initial game state with all defaults. */
export function createInitialGameState(): TokenRaiderState {
  return {
    phase: "lobby",
    round: 1,
    score: 0,
    tokensCollected: 0,
    tokensRemaining: 0,
    timerStartedAt: 0,
    timerDuration: TIMER_DURATION_MS,
    timerPausedAt: null,
    currentTokens: [],
    playerPosition: { x: 0, y: 0, z: 0 },
    controllerConnected: false,
    pairingCode: null,
    controllerUrl: null,
    remoteMode: false,
    isFtue: true,
    lastRoundScore: null,
    highScore: 0,
    arenaSize: ARENA_SIZE,
    nextPhase: null,
  };
}
