import { Outlet } from "react-router-dom";
import { VGFProvider } from "@volley/vgf/client";
import { useControllerSession } from "../hooks/useControllerSession";

export function RoomLayout() {
  const { transport, sessionId } = useControllerSession();

  if (!sessionId) {
    return (
      <div className="error-screen">
        <h1>No Session</h1>
        <p>
          No session ID found. Scan the QR code on the TV to connect your
          controller.
        </p>
      </div>
    );
  }

  if (!transport) {
    return (
      <div className="loading-screen">
        <p>Connecting...</p>
      </div>
    );
  }

  return (
    <VGFProvider transport={transport} clientOptions={{ autoConnect: true }}>
      <Outlet />
    </VGFProvider>
  );
}
