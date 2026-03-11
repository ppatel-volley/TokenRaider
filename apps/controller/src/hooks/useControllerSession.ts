import { useMemo } from "react";
import { createControllerTransport } from "../lib/createControllerTransport";

/**
 * Derive controller session from URL params and device identity.
 *
 * In production (inside PlatformProvider), useDeviceInfo() provides the
 * device ID. In dev mode (no PlatformProvider), we fall back to a
 * stable dev identifier.
 */
function getDeviceId(): string {
  try {
    // Dynamic import to avoid crashing when PlatformProvider is absent
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useDeviceInfo } = require("@volley/platform-sdk/react");
    const deviceInfo = useDeviceInfo();
    return deviceInfo.getDeviceId() ?? "controller-dev";
  } catch {
    return "controller-dev";
  }
}

export function useControllerSession(): {
  transport: ReturnType<typeof createControllerTransport> | null;
  sessionId: string | null;
  clientId: string;
} {
  const sessionId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("volley_account") ?? params.get("sessionId");
  }, []);

  // In dev mode, use a stable fallback ID
  const params = new URLSearchParams(window.location.search);
  const hasHubSession = params.has("volley_hub_session_id");
  const deviceId = hasHubSession ? getDeviceId() : "controller-dev";

  const transport = useMemo(() => {
    if (!sessionId || !deviceId) return null;
    return createControllerTransport(sessionId, deviceId);
  }, [sessionId, deviceId]);

  return { transport, sessionId, clientId: deviceId };
}
