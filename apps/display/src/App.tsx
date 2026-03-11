import { MaybePlatformProvider } from "./providers/MaybePlatformProvider"
import { GameErrorBoundary } from "./components/GameErrorBoundary"
import { InputModeProvider } from "./providers/InputModeProvider"
import { VGFDisplayProvider } from "./providers/VGFDisplayProvider"
import { SceneRouter } from "./scenes/SceneRouter"

export function App() {
    return (
        <MaybePlatformProvider>
            <GameErrorBoundary>
                <InputModeProvider>
                    <VGFDisplayProvider>
                        <SceneRouter />
                    </VGFDisplayProvider>
                </InputModeProvider>
            </GameErrorBoundary>
        </MaybePlatformProvider>
    )
}
