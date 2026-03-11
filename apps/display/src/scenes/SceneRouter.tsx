import { useGameStateWithFallback } from "../hooks/useVGFState"
import { LoadingScreen } from "../components/LoadingScreen"
import { LobbyScene } from "./LobbyScene"
import { GameScene } from "./GameScene"
import { RoundEndScene } from "./RoundEndScene"
import { GameOverScene } from "./GameOverScene"

export function SceneRouter() {
    const state = useGameStateWithFallback()

    // VGF state starts as {} -- guard before rendering scenes
    if (!("phase" in state)) {
        return <LoadingScreen />
    }

    switch (state.phase) {
        case "lobby":
        case "idle":
            return <LobbyScene />
        case "playing":
            return <GameScene />
        case "roundEnd":
            return <RoundEndScene />
        case "gameOver":
            return <GameOverScene />
        default:
            return <LoadingScreen />
    }
}
