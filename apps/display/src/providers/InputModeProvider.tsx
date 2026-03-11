import {
    createContext,
    useContext,
    useMemo,
    type ReactNode,
} from "react"
import {
    detectPlatform,
    isTV as isTVPlatform,
    type TVPlatform,
} from "../utils/detectPlatform"

interface InputModeContextValue {
    isRemoteMode: boolean
    isTV: boolean
    platform: TVPlatform
}

const InputModeContext = createContext<InputModeContextValue>({
    isRemoteMode: false,
    isTV: false,
    platform: "WEB",
})

export function useInputMode(): InputModeContextValue {
    return useContext(InputModeContext)
}

function getInputModeOverride(): boolean | null {
    const params = new URLSearchParams(window.location.search)
    const override = params.get("inputMode")
    if (override === "remote") return true
    if (override === "controller") return false
    return null
}

export function InputModeProvider({
    children,
}: {
    children: ReactNode
}) {
    const value = useMemo(() => {
        const platform = detectPlatform()
        const tvDetected = isTVPlatform(platform)
        const override = getInputModeOverride()
        const isRemoteMode = override ?? tvDetected
        return { isRemoteMode, isTV: tvDetected, platform }
    }, [])

    return (
        <InputModeContext.Provider value={value}>
            {children}
        </InputModeContext.Provider>
    )
}
