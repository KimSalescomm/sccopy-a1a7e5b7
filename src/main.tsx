import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { isPublishedHost } from "./lib/env";

// Ensure data-env is set even if the inline script in index.html was stripped
// or evaluated in a different order. CSS rules under html[data-env="published"]
// depend on this attribute.
document.documentElement.setAttribute(
  "data-env",
  isPublishedHost() ? "published" : "preview"
);

createRoot(document.getElementById("root")!).render(<App />);

