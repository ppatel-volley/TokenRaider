import type {
  TokenRaiderState,
  Token,
  PlayerPosition,
  ShipNavigation,
  ShipHeading,
  CrewMember,
  CrewMemberId,
  TreasureChest,
  FirstMateSpeech,
} from "@token-raider/shared";
import {
  NEED_DECAY_FOOD_PER_SEC,
  NEED_DECAY_MORALE_PER_SEC,
  CHEST_FOOD_VALUE,
  CHEST_MORALE_VALUE,
  CREW_INITIAL_FOOD,
  CREW_INITIAL_MORALE,
} from "@token-raider/shared";

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

interface SetShipHeadingPayload {
  heading: ShipHeading;
}

interface UpdateShipNavigationPayload {
  shipNavigation: ShipNavigation;
}

interface SetTreasureChestsPayload {
  chests: TreasureChest[];
}

interface CollectChestPayload {
  chestId: string;
}

interface DecayCrewNeedsPayload {
  deltaSeconds: number;
  now: number;
}

interface AbandonCrewMemberPayload {
  crewMemberId: CrewMemberId;
}

interface SetFirstMateSpeechPayload {
  speech: FirstMateSpeech | null;
}

interface SetSeekingResourcesPayload {
  seeking: boolean;
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

export function SET_SHIP_HEADING(
  state: TokenRaiderState,
  payload: SetShipHeadingPayload,
): TokenRaiderState {
  const nav: ShipNavigation = state.shipNavigation;
  return {
    ...state,
    shipNavigation: {
      ...nav,
      heading: payload.heading,
      anchored: false,
      seekingResources: false,
    },
  };
}

export function LAY_ANCHOR(
  state: TokenRaiderState,
): TokenRaiderState {
  const nav: ShipNavigation = state.shipNavigation;
  return {
    ...state,
    shipNavigation: {
      ...nav,
      heading: null,
      anchored: true,
      seekingResources: false,
    },
  };
}

export function UPDATE_SHIP_NAVIGATION(
  state: TokenRaiderState,
  payload: UpdateShipNavigationPayload,
): TokenRaiderState {
  return { ...state, shipNavigation: payload.shipNavigation };
}

/* ---- Crew / chest reducers ---- */

export function SET_TREASURE_CHESTS(
  state: TokenRaiderState,
  payload: SetTreasureChestsPayload,
): TokenRaiderState {
  return { ...state, treasureChests: payload.chests };
}

export function COLLECT_CHEST(
  state: TokenRaiderState,
  payload: CollectChestPayload,
): TokenRaiderState {
  const chests: TreasureChest[] = state.treasureChests;
  const chest = chests.find((c) => c.id === payload.chestId);
  if (!chest || chest.collected) return state;

  const updatedChests = chests.map((c) =>
    c.id === payload.chestId ? { ...c, collected: true } : c,
  );

  const crew: CrewMember[] = state.crew;
  const updatedCrew = crew.map((m) => {
    if (m.status !== "active") return m;
    const needs = { ...m.needs };
    if (chest.type === "food") {
      needs.food = Math.min(100, needs.food + CHEST_FOOD_VALUE);
    } else {
      needs.morale = Math.min(100, needs.morale + CHEST_MORALE_VALUE);
    }
    return { ...m, needs };
  });

  return { ...state, treasureChests: updatedChests, crew: updatedCrew };
}

export function DECAY_CREW_NEEDS(
  state: TokenRaiderState,
  payload: DecayCrewNeedsPayload,
): TokenRaiderState {
  const crew: CrewMember[] = state.crew;
  const updatedCrew = crew.map((m) => {
    if (m.status !== "active") return m;
    return {
      ...m,
      needs: {
        food: Math.max(0, m.needs.food - NEED_DECAY_FOOD_PER_SEC * payload.deltaSeconds),
        morale: Math.max(0, m.needs.morale - NEED_DECAY_MORALE_PER_SEC * payload.deltaSeconds),
      },
    };
  });
  return { ...state, crew: updatedCrew, lastNeedDecayAt: payload.now };
}

export function ABANDON_CREW_MEMBER(
  state: TokenRaiderState,
  payload: AbandonCrewMemberPayload,
): TokenRaiderState {
  const crew: CrewMember[] = state.crew;
  const updatedCrew = crew.map((m) =>
    m.id === payload.crewMemberId ? { ...m, status: "abandoned" as const } : m,
  );
  return { ...state, crew: updatedCrew };
}

export function SET_FIRST_MATE_SPEECH(
  state: TokenRaiderState,
  payload: SetFirstMateSpeechPayload,
): TokenRaiderState {
  return { ...state, firstMateSpeech: payload.speech };
}

export function SET_SEEKING_RESOURCES(
  state: TokenRaiderState,
  payload: SetSeekingResourcesPayload,
): TokenRaiderState {
  const nav: ShipNavigation = state.shipNavigation;
  return {
    ...state,
    shipNavigation: {
      ...nav,
      seekingResources: payload.seeking,
      ...(payload.seeking ? { anchored: false, heading: null } : {}),
    },
  };
}

export function RESET_CREW(
  state: TokenRaiderState,
): TokenRaiderState {
  const crew: CrewMember[] = state.crew;
  const updatedCrew = crew.map((m) => ({
    ...m,
    status: "active" as const,
    needs: { food: CREW_INITIAL_FOOD, morale: CREW_INITIAL_MORALE },
  }));
  return { ...state, crew: updatedCrew, firstMateSpeech: null };
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
  SET_SHIP_HEADING,
  LAY_ANCHOR,
  UPDATE_SHIP_NAVIGATION,
  SET_TREASURE_CHESTS,
  COLLECT_CHEST,
  DECAY_CREW_NEEDS,
  ABANDON_CREW_MEMBER,
  SET_FIRST_MATE_SPEECH,
  SET_SEEKING_RESOURCES,
  RESET_CREW,
};
