/** Duration of each round in milliseconds (10 minutes — extended for dev/sailing). */
export const TIMER_DURATION_MS = 600_000;

/** Number of tokens spawned per round. */
export const TOKENS_PER_ROUND = 10;

/** Base point value of a single token. */
export const TOKEN_BASE_VALUE = 100;

/** Player movement speed (units per tick). */
export const PLAYER_MOVE_SPEED = 0.15;

/** Distance within which a token is collected. */
export const COLLECT_RADIUS = 1.5;

/** Playfield dimension (square arena side length). */
export const ARENA_SIZE = 200;

/** Maximum number of rounds in a game. */
export const MAX_ROUNDS = 5;

/** Number of initial rounds that count as tutorial. */
export const FTUE_ROUNDS = 1;

/** Score multiplier applied per successive round. */
export const ROUND_BONUS_MULTIPLIER = 1.5;

/* ---- Ship navigation ---- */

/** Maximum forward speed the ship can reach (world-units/s). */
export const SHIP_MAX_SPEED = 12;

/** Acceleration when under sail (world-units/s²). */
export const SHIP_ACCELERATION = 3;

/** Deceleration when anchor is dropped (world-units/s²). */
export const SHIP_DECELERATION = 5;

/** Rotation speed in radians per second. */
export const SHIP_TURN_SPEED = 0.8;

/** Server physics tick rate in milliseconds. */
export const SHIP_TICK_MS = 50;

/* ---- Crew needs ---- */

/** Starting food level for each crew member (0–100). */
export const CREW_INITIAL_FOOD = 80;

/** Starting morale level for each crew member (0–100). */
export const CREW_INITIAL_MORALE = 80;

/** Food decay rate per second while playing. */
export const NEED_DECAY_FOOD_PER_SEC = 0.4;

/** Morale decay rate per second while playing. */
export const NEED_DECAY_MORALE_PER_SEC = 0.25;

/** How much food a food-chest restores. */
export const CHEST_FOOD_VALUE = 25;

/** How much morale a morale-chest restores. */
export const CHEST_MORALE_VALUE = 25;

/** Total chests spawned per round (half food, half morale). */
export const CHEST_SPAWN_COUNT = 16;

/** Ship-to-chest auto-collect radius (world units). */
export const CHEST_COLLECT_RADIUS = 8.0;

/** First Mate warns when any need drops below this. */
export const FIRST_MATE_WARN_THRESHOLD = 25;

/** First Mate gives urgent warning below this. */
export const FIRST_MATE_DIRE_THRESHOLD = 10;

/** How long a speech bubble stays visible (ms). */
export const FIRST_MATE_SPEECH_DURATION_MS = 4000;
