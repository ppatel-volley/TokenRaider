import type { TokenRaiderState, CrewMember } from "./types.js";
import { ARENA_SIZE, TIMER_DURATION_MS, CREW_INITIAL_FOOD, CREW_INITIAL_MORALE } from "./constants.js";

/** Default crew roster with fresh need values. */
export function createInitialCrew(): CrewMember[] {
  return [
    { id: "lookout", name: "Lookout Liz", status: "active", needs: { food: CREW_INITIAL_FOOD, morale: CREW_INITIAL_MORALE } },
    { id: "gunner", name: "Gunner Gus", status: "active", needs: { food: CREW_INITIAL_FOOD, morale: CREW_INITIAL_MORALE } },
    { id: "cook", name: "Cookie Pete", status: "active", needs: { food: CREW_INITIAL_FOOD, morale: CREW_INITIAL_MORALE } },
  ];
}

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
    shipNavigation: {
      x: 0,
      z: 0,
      rotationY: 0,
      speed: 0,
      heading: null,
      anchored: true,
      seekingResources: false,
    },
    crew: createInitialCrew(),
    treasureChests: [],
    firstMateSpeech: null,
    lastNeedDecayAt: 0,
    isFtue: true,
    lastRoundScore: null,
    highScore: 0,
    arenaSize: ARENA_SIZE,
    nextPhase: null,
  };
}
