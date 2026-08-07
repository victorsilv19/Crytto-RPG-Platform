
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { applyStoredTheme } from "./app/lib/theme";
  import "./styles/index.css";

  // Restaura o tema salvo antes de renderizar, evitando "flash" e o reset ao dar F5.
  applyStoredTheme();

  createRoot(document.getElementById("root")!).render(<App />);
  