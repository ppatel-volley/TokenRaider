import type {
  TokenRaiderState,
  Token,
  ShipHeading,
  ShipNavigation,
  TreasureChest,
  CrewMember,
  ChestType,
} from "@token-raider/shared";
import type { IThunkContext } from "@volley/vgf/server";
import {
  TOKENS_PER_ROUND,
  TOKEN_BASE_VALUE,
  ARENA_SIZE,
  MAX_ROUNDS,
  ROUND_BONUS_MULTIPLIER,
  SHIP_MAX_SPEED,
  SHIP_ACCELERATION,
  SHIP_DECELERATION,
  SHIP_TURN_SPEED,
  SHIP_TICK_MS,
  CHEST_SPAWN_COUNT,
  CHEST_COLLECT_RADIUS,
  FIRST_MATE_WARN_THRESHOLD,
  FIRST_MATE_DIRE_THRESHOLD,
  FIRST_MATE_SPEECH_DURATION_MS,
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

/* ---- Ship navigation ---- */

/** Target rotation for each cardinal heading (0 = north / -Z). */
const HEADING_ROTATION: Record<string, number> = {
  north: 0,
  east: Math.PI / 2,
  south: Math.PI,
  west: -Math.PI / 2,
};

/**
 * Set the ship heading and start sailing. Dispatches SET_SHIP_HEADING
 * and kicks off the physics tick loop if not already running.
 */
export function createSetHeadingThunk(_services: GameServices) {
  return async (
    ctx: IThunkContext<TokenRaiderState>,
    heading: ShipHeading,
  ): Promise<void> => {
    ctx.dispatch("SET_SHIP_HEADING", { heading });
    ensureShipTick(ctx);
  };
}

/**
 * Drop anchor — ship decelerates to a stop.
 */
export function createLayAnchorThunk(_services: GameServices) {
  return async (ctx: IThunkContext<TokenRaiderState>): Promise<void> => {
    ctx.dispatch("LAY_ANCHOR");
    // Tick loop will keep running (crew needs still decay)
  };
}

/**
 * Toggle auto-pilot: steer toward nearest uncollected chest.
 * Weighs anchor and kicks off the tick loop.
 */
export function createSeekResourcesThunk(_services: GameServices) {
  return async (ctx: IThunkContext<TokenRaiderState>): Promise<void> => {
    ctx.dispatch("SET_SEEKING_RESOURCES", { seeking: true });
    ensureShipTick(ctx);
  };
}

/* ---- Chest spawning ---- */

/** Generate treasure chests — half food, half morale — at random ocean positions. */
function generateChests(count: number, arenaSize: number): TreasureChest[] {
  const chests: TreasureChest[] = [];
  const halfFood = Math.floor(count / 2);
  for (let i = 0; i < count; i++) {
    const pos = randomArenaPosition(arenaSize);
    const type: ChestType = i < halfFood ? "food" : "morale";
    chests.push({
      id: `chest-${Date.now()}-${i}`,
      x: pos.x,
      z: pos.z,
      type,
      collected: false,
    });
  }
  return chests;
}

/**
 * Spawn treasure chests and reset crew for a new round.
 * Also kicks off the tick loop so needs start decaying immediately.
 */
export function createSpawnChestsThunk(_services: GameServices) {
  return async (ctx: IThunkContext<TokenRaiderState>): Promise<void> => {
    const state = ctx.getState();
    const chests = generateChests(CHEST_SPAWN_COUNT, state.arenaSize);
    ctx.dispatch("SET_TREASURE_CHESTS", { chests });
    ctx.dispatch("RESET_CREW");
    ctx.dispatch("DECAY_CREW_NEEDS", { deltaSeconds: 0, now: Date.now() });
    ensureShipTick(ctx);
  };
}

/* ---- Physics tick loop ---- */

let tickRunning = false;

/** Shortest-arc signed angle difference. */
function angleDiff(from: number, to: number): number {
  let d = ((to - from) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
  return d;
}

/** First Mate warning messages keyed by need type. */
const FIRST_MATE_WARNINGS: Record<string, string[]> = {
  food_warn: [
    "{name} is gettin' hungry, Cap'n!",
    "{name} needs grub, Cap'n!",
  ],
  food_dire: [
    "{name} is starvin'! Find food NOW!",
  ],
  morale_warn: [
    "{name}'s spirits be fallin', Cap'n!",
    "{name} looks glum, Cap'n!",
  ],
  morale_dire: [
    "{name} is about to jump ship!",
  ],
};

function pickWarning(key: string, name: string): string {
  const pool = FIRST_MATE_WARNINGS[key] ?? FIRST_MATE_WARNINGS.food_warn;
  const msg = pool[Math.floor(Math.random() * pool.length)];
  return msg.replace("{name}", name);
}

/**
 * Car-like steering + crew needs decay + chest auto-collect + abandonment.
 *
 * The tick loop keeps running throughout the "playing" phase even when
 * anchored, because crew needs still decay while stationary.
 */
function ensureShipTick(ctx: IThunkContext<TokenRaiderState>) {
  if (tickRunning) return;
  tickRunning = true;

  const dt = SHIP_TICK_MS / 1000;
  const TURN_SPEED_THRESHOLD = SHIP_MAX_SPEED * 0.25;

  const tick = () => {
    const state = ctx.getState();

    // --- Stop condition: not in playing phase and ship fully stopped ---
    if (state.phase !== "playing" && state.shipNavigation.speed <= 0) {
      tickRunning = false;
      return;
    }

    const nav: ShipNavigation = { ...state.shipNavigation };

    // --- Auto-pilot: compute target rotation toward nearest chest ---
    let seekTargetRot: number | null = null;
    if (nav.seekingResources) {
      const chests: TreasureChest[] = state.treasureChests;
      const uncollected = chests.filter((c) => !c.collected);
      if (uncollected.length > 0) {
        let nearest = uncollected[0];
        let nearestDist = Infinity;
        for (const c of uncollected) {
          const dx = c.x - nav.x;
          const dz = c.z - nav.z;
          const dist = dx * dx + dz * dz;
          if (dist < nearestDist) {
            nearestDist = dist;
            nearest = c;
          }
        }
        // Smart steering: when close, overshoot past the chest so the ship
        // sails through the generous collect radius instead of circling.
        const dist = Math.sqrt(nearestDist);
        const OVERSHOOT = 20;
        const CLOSE_THRESHOLD = 15;
        let targetX = nearest.x;
        let targetZ = nearest.z;
        if (dist < CLOSE_THRESHOLD && dist > 0.1) {
          const nx = (nearest.x - nav.x) / dist;
          const nz = (nearest.z - nav.z) / dist;
          targetX = nearest.x + nx * OVERSHOOT;
          targetZ = nearest.z + nz * OVERSHOOT;
        }
        // atan2(dx, -dz) matches the movement formula: sin(θ), -cos(θ)
        seekTargetRot = Math.atan2(targetX - nav.x, -(targetZ - nav.z));
      } else {
        // No chests left — stop seeking, drop anchor
        ctx.dispatch("SET_SEEKING_RESOURCES", { seeking: false });
        ctx.dispatch("LAY_ANCHOR");
        nav.seekingResources = false;
        nav.anchored = true;
        nav.heading = null;
      }
    }

    // --- Speed: accelerate or decelerate ---
    const hasDirection = nav.heading !== null || seekTargetRot !== null;
    if (nav.anchored || !hasDirection) {
      nav.speed = Math.max(0, nav.speed - SHIP_DECELERATION * dt);
    } else {
      nav.speed = Math.min(SHIP_MAX_SPEED, nav.speed + SHIP_ACCELERATION * dt);
    }

    // --- Rotation toward target heading (car-like: only when moving) ---
    const effectiveTarget = seekTargetRot ?? (nav.heading ? (HEADING_ROTATION[nav.heading] ?? 0) : null);
    if (effectiveTarget !== null && nav.speed > 0.01) {
      const diff = angleDiff(nav.rotationY, effectiveTarget);
      const speedFactor = Math.min(1, nav.speed / TURN_SPEED_THRESHOLD);
      const maxStep = SHIP_TURN_SPEED * speedFactor * dt;
      if (Math.abs(diff) > 0.001) {
        nav.rotationY += Math.sign(diff) * Math.min(Math.abs(diff), maxStep);
      } else {
        nav.rotationY = effectiveTarget;
      }
    }

    // --- Position: always move in the direction the ship faces ---
    if (nav.speed > 0) {
      nav.x += Math.sin(nav.rotationY) * nav.speed * dt;
      nav.z -= Math.cos(nav.rotationY) * nav.speed * dt;
    }

    ctx.dispatch("UPDATE_SHIP_NAVIGATION", { shipNavigation: nav });

    // === Crew systems (only during playing phase) ===
    if (state.phase === "playing") {
      const now = Date.now();

      // --- Need decay ---
      if (state.lastNeedDecayAt > 0) {
        const delta = (now - state.lastNeedDecayAt) / 1000;
        if (delta > 0) {
          ctx.dispatch("DECAY_CREW_NEEDS", { deltaSeconds: delta, now });
        }
      } else {
        // First tick — just set the timestamp
        ctx.dispatch("DECAY_CREW_NEEDS", { deltaSeconds: 0, now });
      }

      // Re-read state after decay dispatch
      const afterDecay = ctx.getState();

      // --- Chest auto-collect (2D distance check) ---
      const chests: TreasureChest[] = afterDecay.treasureChests;
      for (const chest of chests) {
        if (chest.collected) continue;
        const dx = nav.x - chest.x;
        const dz = nav.z - chest.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist <= CHEST_COLLECT_RADIUS) {
          ctx.dispatch("COLLECT_CHEST", { chestId: chest.id });
        }
      }

      // --- Abandonment check ---
      const crew: CrewMember[] = afterDecay.crew;
      let abandonedCount = 0;
      for (const member of crew) {
        if (member.status === "abandoned") {
          abandonedCount++;
          continue;
        }
        if (member.needs.food <= 0 || member.needs.morale <= 0) {
          ctx.dispatch("ABANDON_CREW_MEMBER", { crewMemberId: member.id });
          abandonedCount++;
        }
      }

      // All crew gone → game over
      if (abandonedCount >= crew.length) {
        ctx.dispatch("SET_NEXT_PHASE", { phase: "gameOver" });
        tickRunning = false;
        return;
      }

      // --- First Mate speech ---
      const activeCrew = crew.filter((m) => m.status === "active" && m.needs.food > 0 && m.needs.morale > 0);
      let worstMember: CrewMember | null = null;
      let worstNeed = "food";
      let worstValue = 999;
      for (const m of activeCrew) {
        if (m.needs.food < worstValue) {
          worstValue = m.needs.food;
          worstMember = m;
          worstNeed = "food";
        }
        if (m.needs.morale < worstValue) {
          worstValue = m.needs.morale;
          worstMember = m;
          worstNeed = "morale";
        }
      }

      const currentSpeech = afterDecay.firstMateSpeech;
      if (worstMember && worstValue < FIRST_MATE_WARN_THRESHOLD) {
        // Only update if different crew member or speech expired
        const shouldUpdate =
          !currentSpeech ||
          currentSpeech.crewMemberId !== worstMember.id ||
          now - currentSpeech.timestamp > FIRST_MATE_SPEECH_DURATION_MS;

        if (shouldUpdate) {
          const severity = worstValue < FIRST_MATE_DIRE_THRESHOLD ? "dire" : "warn";
          const key = `${worstNeed}_${severity}`;
          const message = pickWarning(key, worstMember.name);
          ctx.dispatch("SET_FIRST_MATE_SPEECH", {
            speech: { message, crewMemberId: worstMember.id, timestamp: now },
          });
        }
      } else if (currentSpeech && now - currentSpeech.timestamp > FIRST_MATE_SPEECH_DURATION_MS) {
        // Clear expired speech when no warnings needed
        ctx.dispatch("SET_FIRST_MATE_SPEECH", { speech: null });
      }
    }

    setTimeout(tick, SHIP_TICK_MS);
  };

  setTimeout(tick, SHIP_TICK_MS);
}
