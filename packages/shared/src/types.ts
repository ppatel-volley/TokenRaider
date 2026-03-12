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

/** Cardinal heading the ship can be commanded to sail toward. */
export type ShipHeading = "north" | "south" | "east" | "west" | null;

/* ---- Crew system ---- */

export type CrewMemberId = "lookout" | "gunner" | "cook";
export type CrewStatus = "active" | "abandoned";
export type ChestType = "food" | "morale";

export interface CrewNeeds {
  food: number;
  morale: number;
}

export interface CrewMember {
  id: CrewMemberId;
  name: string;
  status: CrewStatus;
  needs: CrewNeeds;
}

export interface TreasureChest {
  id: string;
  x: number;
  z: number;
  type: ChestType;
  collected: boolean;
}

export interface FirstMateSpeech {
  message: string;
  crewMemberId: CrewMemberId;
  timestamp: number;
}

/** Ship navigation state — position, heading, speed, anchor. */
export interface ShipNavigation {
  /** World-space X position. */
  x: number;
  /** World-space Z position (north/south axis). */
  z: number;
  /** Current rotation in radians (0 = north / -Z). */
  rotationY: number;
  /** Current forward speed in world-units per second. */
  speed: number;
  /** Commanded heading (null = no heading / anchored). */
  heading: ShipHeading;
  /** Whether the anchor is down (ship decelerating to stop). */
  anchored: boolean;
  /** Auto-pilot: steer toward nearest uncollected chest. */
  seekingResources: boolean;
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
  shipNavigation: ShipNavigation;
  crew: CrewMember[];
  treasureChests: TreasureChest[];
  firstMateSpeech: FirstMateSpeech | null;
  lastNeedDecayAt: number;
  isFtue: boolean;
  lastRoundScore: number | null;
  highScore: number;
  arenaSize: number;
  nextPhase: string | null;
}
