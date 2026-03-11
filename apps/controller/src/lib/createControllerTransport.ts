import { SocketIOClientTransport, ClientType } from "@volley/vgf/client";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_SERVER_ENDPOINT ?? "http://localhost:8080";

/**
 * Create a VGF transport for the controller client.
 *
 * IMPORTANT: `query` is a top-level option — NEVER nest it inside `socketOptions`.
 * Nesting clobbers VGF's internal sessionId, userId, and clientType params.
 */
export function createControllerTransport(
  sessionId: string,
  userId: string,
): SocketIOClientTransport {
  return new SocketIOClientTransport({
    url: BACKEND_URL,
    query: {
      sessionId,
      userId,
      clientType: ClientType.Controller,
    },
    socketOptions: {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      reconnectionDelayMax: 6000,
      transports: ["polling", "websocket"],
    },
  });
}
