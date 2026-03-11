import { PlatformProvider } from "@volley/platform-sdk/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RoomLayout } from "./components/RoomLayout";
import { PhaseRouter } from "./components/PhaseRouter";

const GAME_ID = import.meta.env.VITE_GAME_ID ?? "token-raider";
const STAGE = import.meta.env.VITE_PLATFORM_SDK_STAGE ?? "staging";

export function App() {
  return (
    <PlatformProvider
      options={{
        gameId: GAME_ID,
        appVersion: __APP_VERSION__,
        stage: STAGE,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoomLayout />}>
            <Route index element={<PhaseRouter />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PlatformProvider>
  );
}
