# Learning 043: VGF Project Scaffolding — Complete 0-to-1 Guide Corrections

**Date:** 2026-03-10
**Category:** Project Setup / VGF Framework
**Severity:** Critical

## The Mistake

When scaffolding a new VGF monorepo from `BUILDING_TV_GAMES.md`, dozens of issues surfaced across type errors, runtime crashes, and connection failures. The guide was written against VGF ~4.3 but the actual installed version is 4.9.0 with significant breaking changes.

## Issues Discovered (34 total)

### Package & Dependency Issues

1. **Version constraints in the guide are stale.** Guide says `^4.8.0` but actual latest is `4.9.0`. Always run `npm view @volley/vgf version` before writing `package.json`.
2. **`socket.io` must be a direct server dependency.** Guide template omits it, but `dev.ts` imports `Server as SocketIOServer`.
3. **`dotenv` must be a direct server dependency.** Guide's dev.ts uses `import "dotenv/config"` without listing it.
4. **`@volley/vgf` has no bare specifier export.** Must use subpath: `/client`, `/server`, `/types`.

### TypeScript Type Issues

5. **Game state interfaces MUST include `[key: string]: unknown`.** VGF's `BaseGameState` extends `Record<string, unknown>`.
6. **`IOnBeginContext` NOT exported from `@volley/vgf/server`.** Import from `@volley/vgf/types`.
7. **`IGameActionContext` NOT exported at all.** Use inline type `{ session: ISession<YourState> }`.
8. **`WGFServer` requires `schedulerStore: IRuntimeSchedulerStore`** — NOT optional. MemoryStorage doesn't implement it. Use noop for dev.
9. **VGF thunks must return `Promise<void>`**, not `void`. Use `async`.
10. **VGF thunk args default to `never[]`.** `dispatchThunk("NAME", {})` fails. Need type cast on client hooks.
11. **`console` is NOT `ILogger`.** WGFServer needs `createLogger({ type: "node" })` from `@volley/logger`.
12. **JSX namespace** — React 19 + TS 5.7: omit `JSX.Element` return types, let inference handle it.
13. **`socketOptions` NOT in the `.d.ts`** but IS spread at runtime (`...options.socketOptions`). Need type cast.

### VGF 4.9.0 Phase Transition Breaking Changes

14. **`PhaseModificationError`** — VGF 4.8+ throws if ANY reducer modifies `state.phase`. The `SET_PHASE` reducer pattern is completely broken.
15. **Must use `nextPhase` pattern** — Add `nextPhase: string | null` to state. Use `SET_NEXT_PHASE` reducer (sets `nextPhase`, not `phase`). Configure `endIf` on all phases to check `hasNextPhase(state)`.
16. **Every phase's `onBegin` must clear `nextPhase`** via `reducerDispatcher("CLEAR_NEXT_PHASE", {})`. Without this, stale nextPhase values re-trigger transitions.
17. **`onBegin` must use `reducerDispatcher`, not `ctx.dispatch`** — Cast ctx to `PhaseLifecycleContext` type with `reducerDispatcher`, then `return c.getState()`.
18. **PhaseRunner2 evaluates `endIf` BEFORE `onBegin` runs.** If `playing.endIf` checks `tokensRemaining === 0` and tokens are generated in `onBegin`, the check fires before tokens exist → infinite loop → OOM crash. Guard with `if (state.currentTokens.length === 0) return false`.
19. **Initial state `phase` must match a registered phase name.** Using `"idle"` when only `"lobby"` is registered means the phase runner never evaluates endIf.
20. **Lobby `endIf` should check `hasNextPhase()` ONLY**, not `state.remoteMode`. If `remoteMode` persists from a previous session, lobby skips immediately on reconnect.

### WGFServer Lifecycle Limitations

21. **`WGFServer` does NOT call `onConnect`/`onDisconnect` lifecycle hooks.** All setup must be client-initiated via thunks.
22. **WGFServer does NOT send Socket.IO acknowledgements.** Client-side `dispatchThunk()` always throws `DispatchTimeoutError` after 10s. The thunk DOES execute — catch the error.

### Client Connection Issues

23. **Use `127.0.0.1` not `localhost`** for dev server URLs. VPN can intercept localhost.
24. **Do NOT use React StrictMode with VGF.** Double mount/unmount kills Socket.IO transport.
25. **Let `VGFProvider` manage connect/close lifecycle.** Don't call `transport.connect()` manually. Use `useMemo` for transport creation, pass to VGFProvider with default `autoConnect: true`.
26. **`VGFProvider` `autoConnect` goes in `clientOptions`**, not top-level prop.
27. **`useDeviceInfo()` returns methods.** Use `.getDeviceId()`, not destructuring.
28. **Socket options go in `socketOptions` object** — `transports`, `reconnectionAttempts` etc are NOT top-level on transport config.

### Dev Server Issues

29. **Dev sessions get deleted on client disconnect.** Use `setInterval(ensureDevSession, 2000)` to auto-recreate.
30. **Port conflicts on restart.** `strictPort: true` means Vite fails hard. Kill all processes before restart.
31. **`tsx watch` restarts on file edits** — kills server, session, and active connections.
32. **Vite HMR runs `useMemo` twice** (from `installHook.js`). Don't fight it — VGFProvider handles it.

### Scaffolding Gaps

33. **WGF CLI (`vgf create`) does NOT create a controller app.** Must create `apps/controller` manually with Platform SDK, VGF client, react-router-dom.
34. **Playwright E2E needs `--use-gl=egl` flag** for headless Chrome WebGL support.

## Import Map (verified VGF 4.9.0)

| Type | Import from |
|------|-------------|
| `WGFServer`, `MemoryStorage`, `IThunkContext` | `@volley/vgf/server` |
| `IOnBeginContext`, `ISession`, `GameThunk` | `@volley/vgf/types` |
| `VGFProvider`, `SocketIOClientTransport`, `ClientType`, `getVGFHooks` | `@volley/vgf/client` |
| `IGameActionContext` | **Not exported** — use `{ session: ISession<State> }` |

## Red Flags

- `PhaseModificationError` → NEVER modify `state.phase` in a reducer. Use `nextPhase` pattern.
- `DispatchTimeoutError` → Expected with WGFServer. Thunk still executes. Catch the error.
- `Index signature for type 'string' is missing` → add `[key: string]: unknown`
- `ERR_PACKAGE_PATH_NOT_EXPORTED` → use subpath exports
- `Type 'Console' is missing properties from ILogger` → use `@volley/logger`
- Server crashes with OOM after phase transition → check `endIf` runs before `onBegin`, add guards
- Lobby skips instantly → check `endIf` isn't checking persistent state like `remoteMode`
- No server logs on thunk dispatch → check Socket.IO connection is actually established
- `PlatformInitializationError: usePlatformContext must be used within PlatformProvider` → controller's `useDeviceInfo()` requires PlatformProvider, which crashes in dev without `volley_hub_session_id`. Use `MaybePlatformProvider` pattern on controller too, and fall back to a static device ID in dev.
- `Hub session ID not found in query parameters` → PlatformProvider crashes without `volley_hub_session_id` URL param. This param is only present when running inside the TV shell. Use conditional wrapping in dev.

## Prevention

- **Always run `npm view` before pinning versions**
- **Always read the actual `.d.ts` files** after install
- **Build shared first** before typechecking apps
- **Read emoji-multiplatform reference** for every pattern — it's the source of truth, not the guide
- **Use Playwright E2E tests** to validate connection + phase transitions before manual testing
- **Kill all processes** on 3000/5173/8080/8081 before `pnpm dev`
