import { Component, type ErrorInfo, type ReactNode } from "react"

interface GameErrorBoundaryProps {
    children: ReactNode
}

interface GameErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

export class GameErrorBoundary extends Component<
    GameErrorBoundaryProps,
    GameErrorBoundaryState
> {
    constructor(props: GameErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): GameErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("GameErrorBoundary caught:", error, errorInfo)
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                        background: "#0a0a1a",
                        color: "#ffffff",
                        fontFamily: "system-ui, sans-serif",
                        padding: 32,
                        textAlign: "center",
                    }}
                >
                    <h1 style={{ fontSize: 36, marginBottom: 16 }}>
                        Something went wrong
                    </h1>
                    <p style={{ fontSize: 18, opacity: 0.7, maxWidth: 480 }}>
                        {this.state.error?.message ?? "An unexpected error occurred."}
                    </p>
                </div>
            )
        }

        return this.props.children
    }
}
