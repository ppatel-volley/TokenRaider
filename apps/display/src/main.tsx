import { createRoot } from "react-dom/client"
import { App } from "./App"
import "./styles.css"

// WGFServer doesn't send Socket.IO acks, so VGF's dispatchThunk/dispatchReducer
// always reject with DispatchTimeoutError after 10s. The thunk/reducer DOES
// execute server-side — only the acknowledgement is missing. Suppress the noise.
window.addEventListener("unhandledrejection", (e) => {
    if (e.reason?.name === "DispatchTimeoutError") e.preventDefault()
})

// NO React.StrictMode — double mount/unmount kills VGF's Socket.IO transport
const root = document.getElementById("root")
if (!root) throw new Error("Root element not found")

createRoot(root).render(<App />)
