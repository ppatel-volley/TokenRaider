import { useMemo } from "react";
import { useDeviceInfo } from "@volley/platform-sdk/react";
import { createControllerTransport } from "../lib/createControllerTransport";

/**
 * Derive controller session from Platform SDK device identity and URL params.
 *
 * - userId comes from `useDeviceInfo()` (Platform SDK) — never a random UUID.
 * - sessionId comes from URL query params (`volley_account` or `sessionId`).
 */
export function useControllerSession(): {
  transport: ReturnType<typeof createControllerTransport> | null;
  sessionId: string | null;
  clientId: string;
} {
  const deviceInfo = useDeviceInfo();
  const deviceId = deviceInfo.getDeviceId() ?? "";

  const sessionId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("volley_account") ?? params.get("sessionId");
  }, []);

  const transport = useMemo(() => {
    if (!sessionId || !deviceId) return null;
    return createControllerTransport(sessionId, deviceId);
  }, [sessionId, deviceId]);

  return { transport, sessionId, clientId: deviceId };
}
