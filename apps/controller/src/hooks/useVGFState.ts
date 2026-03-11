import { getVGFHooks, type GameRuleset } from "@volley/vgf/client";
import type { TokenRaiderState } from "@token-raider/shared";

/** Typed VGF hooks bound to the TokenRaider state shape. */
export const vgfHooks = getVGFHooks<
  GameRuleset<TokenRaiderState>,
  TokenRaiderState,
  string
>();

export const useStateSync = vgfHooks.useStateSync;
export const useStateSyncSelector = vgfHooks.useStateSyncSelector;
export const useDispatch = vgfHooks.useDispatch;

/**
 * Controller-side thunk dispatcher. Cast to a permissive signature because
 * the concrete thunk definitions (and their arg types) live on the server;
 * the controller only knows the thunk *name* and optional args.
 */
export const useDispatchThunk = vgfHooks.useDispatchThunk as () => (
  thunkName: string,
  ...args: unknown[]
) => void;

export const usePhase = vgfHooks.usePhase;
