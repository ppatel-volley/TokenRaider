import type { TokenRaiderState, Token } from "@token-raider/shared";
import {
  TOKENS_PER_ROUND,
  TOKEN_BASE_VALUE,
  ROUND_BONUS_MULTIPLIER,
} from "@token-raider/shared";
import type { GameServices } from "./services.js";

/** endIf context shape — IGameActionContext is not publicly exported */
interface EndIfContext {
  session: { state: TokenRaiderState };
}

/** VGF IOnBeginContext — session, reducerDispatcher, getState, logger */
interface PhaseLifecycleContext {
  session: { sessionId: string; state: TokenRaiderState };
  getState: () => TokenRaiderState;
  reducerDispatcher: (name: string, ...args: unknown[]) => void;
  logger: { info: (...args: unknown[]) => void; error: (...args: unknown[]) => void };
}

/** Generate a random position within the arena bounds. */
function randomArenaPosition(arenaSize: number): {
  x: number;
  y: number;
  z: number;
} {
  const half = arenaSize / 2;
  return {
    x: Math.random() * arenaSize - half,
    y: 0,
    z: Math.random() * arenaSize - half,
  };
}

/** Generate tokens for a round. */
function generateTokens(
  count: number,
  arenaSize: number,
  round: number,
): Token[] {
  const tokens: Token[] = [];
  const multiplier = Math.pow(ROUND_BONUS_MULTIPLIER, round - 1);

  for (let i = 0; i < count; i++) {
    const pos = randomArenaPosition(arenaSize);
    tokens.push({
      id: `token-${round}-${i}`,
      x: pos.x,
      y: pos.y,
      z: pos.z,
      value: Math.round(TOKEN_BASE_VALUE * multiplier),
      collected: false,
    });
  }

  return tokens;
}

/**
 * WoF pattern: true when a thunk has requested a transition to a DIFFERENT phase.
 * The `nextPhase !== phase` guard prevents re-triggering after the phase runner
 * updates state.phase to match nextPhase.
 */
function hasNextPhase(state: TokenRaiderState): boolean {
  return state.nextPhase !== null && state.nextPhase !== state.phase;
}

/**
 * Create phase definitions for the TokenRaider game.
 *
 * VGF 4.9.0: Reducers cannot modify state.phase (PhaseModificationError).
 * Phase transitions use the WoF pattern: SET_NEXT_PHASE reducer + endIf check.
 * Every phase's onBegin clears nextPhase via CLEAR_NEXT_PHASE reducer.
 */
export function createPhases(_services: GameServices) {
  return {
    lobby: {
      actions: {},
      reducers: {},
      thunks: {},
      onBegin: async (ctx: unknown) => {
        const c = ctx as PhaseLifecycleContext;
        c.reducerDispatcher("CLEAR_NEXT_PHASE", {});
        return c.getState();
      },
      endIf: (ctx: EndIfContext) => hasNextPhase(ctx.session.state),
      next: (ctx: EndIfContext) => {
        if (hasNextPhase(ctx.session.state)) return ctx.session.state.nextPhase!;
        return "playing";
      },
    },

    playing: {
      actions: {},
      reducers: {},
      thunks: {},
      onBegin: async (ctx: unknown) => {
        const c = ctx as PhaseLifecycleContext;
        c.reducerDispatcher("CLEAR_NEXT_PHASE", {});
        const state = c.getState();
        const tokens = generateTokens(
          TOKENS_PER_ROUND,
          state.arenaSize,
          state.round,
        );

        c.reducerDispatcher("SET_TOKENS", { tokens });
        c.reducerDispatcher("START_TIMER", { timerStartedAt: Date.now() });
        return c.getState();
      },
      endIf: (ctx: EndIfContext) => {
        const state = ctx.session.state;

        // nextPhase requested
        if (hasNextPhase(state)) return true;

        // Guard: onBegin hasn't run yet if no tokens exist.
        // VGF PhaseRunner2 evaluates endIf BEFORE onBegin, so we must
        // not trigger on tokensRemaining === 0 when tokens are absent.
        if (state.currentTokens.length === 0) return false;

        const {
          tokensRemaining,
          timerStartedAt,
          timerDuration,
          timerPausedAt,
        } = state;

        // All tokens collected
        if (tokensRemaining === 0) return true;

        // Timer expired (only when not paused)
        if (timerPausedAt === null && timerStartedAt > 0) {
          const elapsed = Date.now() - timerStartedAt;
          if (elapsed >= timerDuration) return true;
        }

        return false;
      },
      next: (ctx: EndIfContext) => ctx.session.state.nextPhase ?? "roundEnd",
    },

    roundEnd: {
      actions: {},
      reducers: {},
      thunks: {},
      onBegin: async (ctx: unknown) => {
        const c = ctx as PhaseLifecycleContext;
        c.reducerDispatcher("CLEAR_NEXT_PHASE", {});
        return c.getState();
      },
      endIf: (ctx: EndIfContext) => hasNextPhase(ctx.session.state),
      next: (ctx: EndIfContext) => ctx.session.state.nextPhase ?? "playing",
    },

    gameOver: {
      actions: {},
      reducers: {},
      thunks: {},
      onBegin: async (ctx: unknown) => {
        const c = ctx as PhaseLifecycleContext;
        c.reducerDispatcher("CLEAR_NEXT_PHASE", {});
        return c.getState();
      },
      endIf: (ctx: EndIfContext) => hasNextPhase(ctx.session.state),
      next: (ctx: EndIfContext) => ctx.session.state.nextPhase ?? "lobby",
    },
  };
}
