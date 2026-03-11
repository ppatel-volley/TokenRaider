import { useState, useRef, useCallback, useEffect } from "react"
import { useKeyDown } from "./useKeyHandler"

interface UseDPadNavigationOptions {
    itemCount: number
    /** 1 for vertical list, N for grid */
    gridColumns: number
    /** false when this component should not capture keys */
    enabled: boolean
    onSelect: (index: number) => void
}

interface UseDPadNavigationResult {
    focusIndex: number
    setFocusIndex: (index: number) => void
    itemRefs: React.MutableRefObject<(HTMLElement | null)[]>
}

export function useDPadNavigation({
    itemCount,
    gridColumns,
    enabled,
    onSelect,
}: UseDPadNavigationOptions): UseDPadNavigationResult {
    const [focusIndex, setFocusIndex] = useState(0)
    const itemRefs = useRef<(HTMLElement | null)[]>([])

    // Keep refs array in sync
    useEffect(() => {
        itemRefs.current = itemRefs.current.slice(0, itemCount)
    }, [itemCount])

    // Focus the DOM element when focusIndex changes
    useEffect(() => {
        if (enabled) {
            itemRefs.current[focusIndex]?.focus()
        }
    }, [focusIndex, enabled])

    const handleUp = useCallback(() => {
        if (!enabled) return
        setFocusIndex((prev) => {
            const next = prev - gridColumns
            return next >= 0 ? next : prev
        })
    }, [enabled, gridColumns])

    const handleDown = useCallback(() => {
        if (!enabled) return
        setFocusIndex((prev) => {
            const next = prev + gridColumns
            return next < itemCount ? next : prev
        })
    }, [enabled, gridColumns, itemCount])

    const handleLeft = useCallback(() => {
        if (!enabled) return
        setFocusIndex((prev) => (prev > 0 ? prev - 1 : prev))
    }, [enabled])

    const handleRight = useCallback(() => {
        if (!enabled) return
        setFocusIndex((prev) => (prev < itemCount - 1 ? prev + 1 : prev))
    }, [enabled, itemCount])

    const handleEnter = useCallback(() => {
        if (!enabled) return
        onSelect(focusIndex)
    }, [enabled, onSelect, focusIndex])

    useKeyDown("ArrowUp", handleUp)
    useKeyDown("ArrowDown", handleDown)
    useKeyDown("ArrowLeft", handleLeft)
    useKeyDown("ArrowRight", handleRight)
    useKeyDown("Enter", handleEnter)

    return { focusIndex, setFocusIndex, itemRefs }
}
