import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoomLayout } from "./components/RoomLayout";
import { PhaseRouter } from "./components/PhaseRouter";

const GAME_ID = import.meta.env.VITE_GAME_ID ?? "token-raider";
const STAGE = import.meta.env.VITE_PLATFORM_SDK_STAGE ?? "staging";

/**
 * Wraps children in PlatformProvider only when volley_hub_session_id is present
 * (i.e., running inside the TV shell / VWR). In dev mode on a bare browser,
 * the hub session ID is absent and PlatformProvider throws.
 */
function MaybePlatformProvider({ children }: { children: ReactNode }) {
  const params = new URLSearchParams(window.location.search);
  const hasHubSession = params.has("volley_hub_session_id");

  if (!hasHubSession) return <>{children}</>;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PlatformProvider } = require("@volley/platform-sdk/react");

  return (
    <PlatformProvider
      options={{
        gameId: GAME_ID,
        appVersion: __APP_VERSION__,
        stage: STAGE,
      }}
    >
      {children}
    </PlatformProvider>
  );
}

export function App() {
  return (
    <MaybePlatformProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoomLayout />}>
            <Route index element={<PhaseRouter />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MaybePlatformProvider>
  );
}
