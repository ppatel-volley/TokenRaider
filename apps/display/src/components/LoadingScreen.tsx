const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#0a0a1a",
    color: "#ffffff",
    fontFamily: "system-ui, sans-serif",
}

const titleStyle: React.CSSProperties = {
    fontSize: 64,
    fontWeight: 700,
    letterSpacing: 4,
    marginBottom: 24,
}

const subtitleStyle: React.CSSProperties = {
    fontSize: 20,
    opacity: 0.5,
}

export function LoadingScreen() {
    return (
        <div style={containerStyle}>
            <h1 style={titleStyle}>TokenRaider</h1>
            <p style={subtitleStyle}>Connecting...</p>
        </div>
    )
}
