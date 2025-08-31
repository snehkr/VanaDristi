import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { ApiProvider } from "./api";
import "./index.css";

const queryClient = new QueryClient();

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ApiProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}
