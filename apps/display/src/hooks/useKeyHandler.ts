import { useEffect, useCallback, useRef } from "react"

const KEY_MAP: Record<string, string[]> = {
    ArrowUp: ["ArrowUp"],
    ArrowDown: ["ArrowDown"],
    ArrowLeft: ["ArrowLeft"],
    ArrowRight: ["ArrowRight"],
    Enter: ["Enter"],
    Back: ["Backspace", "Escape"],
    Mic: ["m"],
}

export function useKeyDown(key: string, callback: () => void): void {
    const callbackRef = useRef(callback)
    callbackRef.current = callback

    const handler = useCallback(
        (event: KeyboardEvent) => {
            const mappedKeys = KEY_MAP[key] ?? [key]
            if (mappedKeys.includes(event.key)) {
                callbackRef.current()
            }
        },
        [key],
    )

    useEffect(() => {
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [handler])
}

export function useKeyUp(key: string, callback: () => void): void {
    const callbackRef = useRef(callback)
    callbackRef.current = callback

    const handler = useCallback(
        (event: KeyboardEvent) => {
            const mappedKeys = KEY_MAP[key] ?? [key]
            if (mappedKeys.includes(event.key)) {
                callbackRef.current()
            }
        },
        [key],
    )

    useEffect(() => {
        window.addEventListener("keyup", handler)
        return () => window.removeEventListener("keyup", handler)
    }, [handler])
}
