# TokenRaider

A 3D multiplayer TV game built with the Volley Games Framework (VGF), Three.js, and React/TypeScript.

Two-device model: a **Display** (TV screen rendered with Three.js) and a **Controller** (phone UI), connected via a server-authoritative **Server** over Socket.IO.

---

## Prerequisites

- **Node.js** >= 22.0.0
- **pnpm** >= 10.0.0

---

## Project Structure

```
.
├── apps/
│   ├── server/          # @token-raider/server — VGF game server (Express + Socket.IO)
│   ├── display/         # @token-raider/display — TV client (Vite + React + Three.js)
│   ├── controller/      # @token-raider/controller — Phone client (Vite + React)
│   └── e2e/             # End-to-end tests
├── packages/
│   └── shared/          # @token-raider/shared — Shared types, constants, utilities
├── package.json         # Root workspace scripts
├── pnpm-workspace.yaml  # Workspace config
└── tsconfig.base.json   # Shared TypeScript config
```

---

## Install

```bash
pnpm install
```

---

## Build

```bash
pnpm build
```

This runs `tsc -b` (TypeScript) on all packages, plus Vite production builds for `display` and `controller`.

Build order (handled automatically by pnpm):
1. `packages/shared` — shared types (no other deps)
2. `apps/server` — TypeScript compile
3. `apps/display` — TypeScript compile + Vite bundle
4. `apps/controller` — TypeScript compile + Vite bundle

---

## Development

```bash
pnpm dev
```

Starts all three services in parallel with hot reload:

| Service    | URL                                          | Description              |
|------------|----------------------------------------------|--------------------------|
| Display    | http://localhost:3000/?sessionId=dev-test     | TV screen (Three.js)     |
| Controller | http://localhost:5173/?sessionId=dev-test     | Phone UI (React)         |
| Server     | http://localhost:8080                         | VGF game server          |

A dev session `dev-test` is automatically created on startup. The `?sessionId=dev-test` query parameter is required for clients to connect.

### Optional: Deepgram proxy

If `DEEPGRAM_API_KEY` is set in `.env`, a WebSocket proxy for Deepgram speech-to-text starts on `ws://localhost:8081`.

---

## Other Commands

| Command            | Description                        |
|--------------------|------------------------------------|
| `pnpm test`        | Run tests across all packages      |
| `pnpm test:run`    | Run tests once (no watch)          |
| `pnpm test:e2e`    | Run end-to-end tests               |
| `pnpm typecheck`   | TypeScript type checking           |
| `pnpm clean`       | Remove build artefacts             |

---

## AI Agent Guidelines

This repo includes an AI agent guidelines framework. See [CLAUDE.md](./CLAUDE.md) for the entry point, which references:

- [AGENTS.md](./AGENTS.md) — Core behavioural guidelines and verification requirements
- [AGENTS-PROJECT.md](./AGENTS-PROJECT.md) — Project-specific commands and keyword triggers
- [AGENTS-REACT-TS.md](./AGENTS-REACT-TS.md) — React/TypeScript/Three.js patterns
- [AGENTS-RLM.md](./AGENTS-RLM.md) — Large context handling strategies
