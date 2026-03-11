import type { TokenRaiderState, Token } from "@token-raider/shared";
import type { IThunkContext } from "@volley/vgf/server";
import {
  TOKENS_PER_ROUND,
  TOKEN_BASE_VALUE,
  ARENA_SIZE,
  MAX_ROUNDS,
  ROUND_BONUS_MULTIPLIER,
} from "@token-raider/shared";
import type { GameServices } from "./services.js";

// ---- Helpers ----

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

/** Generate a set of tokens with random positions. */
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

// ---- Thunk factories ----

/**
 * Activate remote mode AND dispatch SET_NEXT_PHASE to request a phase transition.
 * Never rely on endIf cascade from lifecycle hooks.
 */
export function createActivateRemoteModeThunk(_services: GameServices) {
  return async (ctx: IThunkContext<TokenRaiderState>): Promise<void> => {
    console.log("[THUNK] ACTIVATE_REMOTE_MODE executing");
    ctx.dispatch("SET_REMOTE_MODE");
    ctx.dispatch("SET_NEXT_PHASE", { phase: "playing" });
    console.log("[THUNK] ACTIVATE_REMOTE_MODE done");
  };
}

/**
 * Start a new round: generate tokens, set them in state, and transition to "playing".
 */
export function createStartRoundThunk(_services: GameServices) {
  return async (ctx: IThunkContext<TokenRaiderState>): Promise<void> => {
    const state = ctx.getState();
    const tokens = generateTokens(
      TOKENS_PER_ROUND,
      state.arenaSize,
      state.round,
    );

    ctx.dispatch("SET_TOKENS", { tokens });
    ctx.dispatch("SET_NEXT_PHASE", { phase: "playing" });
  };
}

/**
 * Collect a token: validate it exists and is not already collected,
 * then dispatch COLLECT_TOKEN. If all tokens are now collected, end the round.
 * Idempotent — safe for at-least-once delivery.
 */
export function createCollectTokenThunk(_services: GameServices) {
  return async (
    ctx: IThunkContext<TokenRaiderState>,
    tokenId: string,
  ): Promise<void> => {
    const state = ctx.getState();
    const token = state.currentTokens.find((t) => t.id === tokenId);

    // Idempotent: skip if token doesn't exist or is already collected
    if (!token || token.collected) return;

    ctx.dispatch("COLLECT_TOKEN", { tokenId });

    // Check if all tokens are now collected (accounting for this one)
    if (state.tokensRemaining <= 1) {
      ctx.dispatch("SET_NEXT_PHASE", { phase: "roundEnd" });
    }
  };
}

/**
 * End the current round: calculate final score, update high score if needed,
 * and transition to "roundEnd" or "gameOver".
 */
export function createEndRoundThunk(_services: GameServices) {
  return async (ctx: IThunkContext<TokenRaiderState>): Promise<void> => {
    const state = ctx.getState();
    const finalScore = state.score;

    ctx.dispatch("SET_SCORE", { score: finalScore });

    if (state.round >= MAX_ROUNDS) {
      ctx.dispatch("SET_NEXT_PHASE", { phase: "gameOver" });
    } else {
      ctx.dispatch("SET_NEXT_PHASE", { phase: "roundEnd" });
    }
  };
}
