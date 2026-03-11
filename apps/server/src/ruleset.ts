import type { GameRuleset } from "@volley/vgf/server";
import type { TokenRaiderState } from "@token-raider/shared";
import { createInitialGameState } from "@token-raider/shared";
import type { GameServices } from "./services.js";
import { globalReducers } from "./reducers.js";
import {
  createActivateRemoteModeThunk,
  createStartRoundThunk,
  createCollectTokenThunk,
  createEndRoundThunk,
} from "./thunks.js";
import { createPhases } from "./phases.js";

/**
 * Create the TokenRaider game ruleset for WGFServer.
 *
 * The `actions` field is required by the GameRuleset type — pass `actions: {}`.
 */
export function createGameRuleset(
  services: GameServices,
): GameRuleset<TokenRaiderState> {
  return {
    setup: createInitialGameState,
    actions: {},
    reducers: globalReducers,
    thunks: {
      ACTIVATE_REMOTE_MODE: createActivateRemoteModeThunk(services),
      START_ROUND: createStartRoundThunk(services),
      COLLECT_TOKEN: createCollectTokenThunk(services),
      END_ROUND: createEndRoundThunk(services),
    },
    phases: createPhases(services),
  };
}
