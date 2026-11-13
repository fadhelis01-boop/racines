import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/app.css";
import { loadState } from "./lib/store";
import { requestPersistence } from "./lib/db";
import { registerServiceWorker } from "./lib/pwa";

createRoot(document.getElementById("root")!).render(<App />);
void loadState();
void requestPersistence();
registerServiceWorker();
