import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import { WebSocketServer, WebSocket as ServerWebSocket } from "ws";
import { WGFServer, MemoryStorage } from "@volley/vgf/server";
import { Server as SocketIOServer } from "socket.io";
import { createLogger } from "@volley/logger";
import { createGameRuleset } from "./ruleset.js";
import type { GameServices } from "./services.js";

const logger = createLogger({ type: "node" });

const app = express();
app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
const httpServer = createServer(app);

// --- Deepgram WebSocket Proxy (port 8081) ---
const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;
const DG_PROXY_PORT = 8081;

if (DEEPGRAM_API_KEY) {
  const dgProxy = new WebSocketServer({ port: DG_PROXY_PORT });
  dgProxy.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.warn(
        `Deepgram proxy port ${DG_PROXY_PORT} in use (tsx watch restart)`,
      );
    }
  });
  dgProxy.on("connection", (clientWs) => {
    clientWs.once("message", (data) => {
      let encoding = "opus";
      let sampleRate = 48000;
      try {
        const config = JSON.parse(data.toString());
        if (config.type === "config") {
          encoding = config.encoding ?? encoding;
          sampleRate = config.sampleRate ?? sampleRate;
        }
      } catch {
        /* not JSON — treat as audio data, ignore */
      }

      const dgUrl = `wss://api.deepgram.com/v1/listen?model=nova-2&encoding=${encoding}&sample_rate=${sampleRate}&channels=1&interim_results=true&endpointing=300&smart_format=false`;
      const dgWs = new ServerWebSocket(dgUrl, {
        headers: { Authorization: `Token ${DEEPGRAM_API_KEY}` },
      });

      dgWs.on("open", () => {
        clientWs.send(JSON.stringify({ type: "proxy_ready" }));
      });
      dgWs.on("message", (msg) => {
        if (clientWs.readyState === ServerWebSocket.OPEN) {
          clientWs.send(msg.toString());
        }
      });

      clientWs.on("message", (audioData) => {
        if (dgWs.readyState === ServerWebSocket.OPEN) {
          dgWs.send(audioData);
        }
      });

      clientWs.on("close", () => {
        if (dgWs.readyState === ServerWebSocket.OPEN) {
          dgWs.send(JSON.stringify({ type: "CloseStream" }));
          dgWs.close();
        }
      });
    });
  });
}

// --- WGF Server ---
const storage = new MemoryStorage();
const io = new SocketIOServer(httpServer, {
  cors: { origin: true, methods: ["GET", "POST"], credentials: true },
});

const services: GameServices = {
  endSession: () => {},
  serverState: new Map(),
  devMode: true,
};

const game = createGameRuleset(services);
const PORT = 8080;

const server = new WGFServer({
  port: PORT,
  expressApp: app,
  httpServer,
  socketIOServer: io,
  storage,
  logger,
  gameRuleset: game,
  schedulerStore: {
    load: async () => null,
    save: async () => {},
    remove: async () => {},
  },
});

server.start();

// Pre-create a dev session so clients can connect with ?sessionId=dev-test
const DEV_SESSION_ID = "dev-test";

function ensureDevSession(): void {
  if (!storage.doesSessionExist(DEV_SESSION_ID)) {
    storage.createSession({
      sessionId: DEV_SESSION_ID,
      members: {},
      state: game.setup(),
    });
    console.log(`Dev session "${DEV_SESSION_ID}" (re)created`);
  }
}

ensureDevSession();

// Keep the dev session alive — re-create it if VGF deletes it after disconnect
setInterval(ensureDevSession, 2000);

// Also expose an endpoint to manually re-create it
app.post("/api/dev-session", (_req, res) => {
  ensureDevSession();
  res.json({ sessionId: DEV_SESSION_ID, status: "ok" });
});

console.log(`WGF server: http://localhost:${PORT}`);
if (DEEPGRAM_API_KEY) {
  console.log(`Deepgram proxy: ws://localhost:${DG_PROXY_PORT}`);
}
