import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App.tsx";
import { AuthWrapper } from "@/components/AuthWrapper";
import { queryClient } from "@/lib/queryClient";
import { RadixToaster } from "@Team-Trung-Vu-Khang/eco-shared-ui";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthWrapper>
        <App />
        <RadixToaster />
      </AuthWrapper>
    </QueryClientProvider>
  </StrictMode>,
);
