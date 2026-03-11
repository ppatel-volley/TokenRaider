import type { TokenRaiderState, Token, PlayerPosition } from "@token-raider/shared";

// ---- Payload types ----

interface SetNextPhasePayload {
  phase: string;
}

interface SetScorePayload {
  score: number;
}

interface CollectTokenPayload {
  tokenId: string;
}

interface MovePlayerPayload {
  position: PlayerPosition;
}

interface SetControllerConnectedPayload {
  connected: boolean;
}

interface SetFtuePayload {
  isFtue: boolean;
}

interface SetTokensPayload {
  tokens: Token[];
}

interface PauseTimerPayload {
  now: number;
}

interface ResumeTimerPayload {
  now: number;
}

interface ResetRoundPayload {
  round: number;
}

// ---- Reducers ----

export function SET_NEXT_PHASE(
  state: TokenRaiderState,
  payload: SetNextPhasePayload,
): TokenRaiderState {
  return { ...state, nextPhase: payload.phase };
}

export function CLEAR_NEXT_PHASE(
  state: TokenRaiderState,
): TokenRaiderState {
  return { ...state, nextPhase: null };
}

export function SET_SCORE(
  state: TokenRaiderState,
  payload: SetScorePayload,
): TokenRaiderState {
  return { ...state, score: payload.score };
}

export function COLLECT_TOKEN(
  state: TokenRaiderState,
  payload: CollectTokenPayload,
): TokenRaiderState {
  const token = state.currentTokens.find((t) => t.id === payload.tokenId);
  if (!token || token.collected) return state;

  const updatedTokens = state.currentTokens.map((t) =>
    t.id === payload.tokenId ? { ...t, collected: true } : t,
  );

  return {
    ...state,
    currentTokens: updatedTokens,
    score: state.score + token.value,
    tokensCollected: state.tokensCollected + 1,
    tokensRemaining: state.tokensRemaining - 1,
  };
}

export function MOVE_PLAYER(
  state: TokenRaiderState,
  payload: MovePlayerPayload,
): TokenRaiderState {
  return { ...state, playerPosition: payload.position };
}

export function SET_CONTROLLER_CONNECTED(
  state: TokenRaiderState,
  payload: SetControllerConnectedPayload,
): TokenRaiderState {
  return { ...state, controllerConnected: payload.connected };
}

export function SET_REMOTE_MODE(
  state: TokenRaiderState,
): TokenRaiderState {
  return { ...state, remoteMode: true };
}

export function SET_FTUE(
  state: TokenRaiderState,
  payload: SetFtuePayload,
): TokenRaiderState {
  return { ...state, isFtue: payload.isFtue };
}

export function SET_TOKENS(
  state: TokenRaiderState,
  payload: SetTokensPayload,
): TokenRaiderState {
  return {
    ...state,
    currentTokens: payload.tokens,
    tokensRemaining: payload.tokens.length,
    tokensCollected: 0,
  };
}

export function START_TIMER(
  state: TokenRaiderState,
  payload: { timerStartedAt: number },
): TokenRaiderState {
  return { ...state, timerStartedAt: payload.timerStartedAt, timerPausedAt: null };
}

export function PAUSE_TIMER(
  state: TokenRaiderState,
  payload: PauseTimerPayload,
): TokenRaiderState {
  return { ...state, timerPausedAt: payload.now };
}

export function RESUME_TIMER(
  state: TokenRaiderState,
  payload: ResumeTimerPayload,
): TokenRaiderState {
  if (state.timerPausedAt === null) return state;

  const pausedDuration = payload.now - state.timerPausedAt;
  return {
    ...state,
    timerStartedAt: state.timerStartedAt + pausedDuration,
    timerPausedAt: null,
  };
}

export function RESET_ROUND(
  state: TokenRaiderState,
  payload: ResetRoundPayload,
): TokenRaiderState {
  return {
    ...state,
    round: payload.round,
    score: 0,
    tokensCollected: 0,
    tokensRemaining: 0,
    currentTokens: [],
    timerStartedAt: 0,
    timerPausedAt: null,
    lastRoundScore: null,
    playerPosition: { x: 0, y: 0, z: 0 },
  };
}

/** All global reducers keyed by action name. */
export const globalReducers = {
  SET_NEXT_PHASE,
  CLEAR_NEXT_PHASE,
  SET_SCORE,
  COLLECT_TOKEN,
  MOVE_PLAYER,
  SET_CONTROLLER_CONNECTED,
  SET_REMOTE_MODE,
  SET_FTUE,
  SET_TOKENS,
  START_TIMER,
  PAUSE_TIMER,
  RESUME_TIMER,
  RESET_ROUND,
};
