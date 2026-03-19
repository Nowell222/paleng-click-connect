import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "./components/ErrorBoundary";

console.log("🚀 Starting app initialization...");
console.log("Root element:", document.getElementById("root"));

try {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("Root element not found in DOM");
  }

  console.log("✅ Root element found, mounting React app...");

  createRoot(root).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );

  console.log("✅ React app mounted successfully");
} catch (error) {
  console.error("❌ Failed to mount app:", error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f5f5f5; font-family: system-ui;">
      <div style="max-width: 500px; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h1 style="color: #dc2626; margin-bottom: 1rem;">App Failed to Load</h1>
        <p style="color: #666; margin-bottom: 1rem;">${error instanceof Error ? error.message : String(error)}</p>
        <p style="color: #666; font-size: 0.875rem;">Check the console for more details (F12)</p>
      </div>
    </div>
  `;
}
