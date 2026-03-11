/** Per-session data tracked only on the server (never sent to clients). */
export interface ServerOnlyState {
  sessionId: string;
  connectedAt: number;
  lastActivity: number;
}

/** Services injected into the game ruleset. */
export interface GameServices {
  serverState: Map<string, ServerOnlyState>;
  endSession: (sessionId: string) => void;
  devMode?: boolean;
}
