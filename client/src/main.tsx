import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./assets/pwa-styles.css";
import "./assets/mobile-pwa.css";

// Service worker silenciado para evitar erros
if ('serviceWorker' in navigator && false) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

createRoot(document.getElementById("root")!).render(<App />);
