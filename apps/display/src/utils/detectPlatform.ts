export type TVPlatform = "WEB" | "FIRE_TV" | "SAMSUNG_TV" | "LG_TV" | "MOBILE"

export function detectPlatform(): TVPlatform {
    const params = new URLSearchParams(window.location.search)
    const override = params.get("volley_platform")
    if (override === "FIRE_TV") return "FIRE_TV"
    if (override === "SAMSUNG_TV") return "SAMSUNG_TV"
    if (override === "LG_TV") return "LG_TV"

    const ua = navigator.userAgent
    if (ua.includes("Tizen") && ua.includes("SMART-TV")) return "SAMSUNG_TV"
    if (ua.includes("Web0S") && ua.includes("SmartTV")) return "LG_TV"

    return "WEB"
}

export function isTV(platform: TVPlatform): boolean {
    return (
        platform === "FIRE_TV" ||
        platform === "SAMSUNG_TV" ||
        platform === "LG_TV"
    )
}
