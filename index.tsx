import React from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import { App } from "./App.tsx";

const app = document.getElementById("app") ?? (() => {
  const app = document.createElement("div");
  document.body.appendChild(app);
  return app;
})();

const root = createRoot(app);

root.render(<App />);
