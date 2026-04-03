"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          borderRadius: "1rem",
          border: "1px solid hsl(var(--border))",
          background: "hsl(var(--card))",
          color: "hsl(var(--card-foreground))",
          boxShadow: "0 4px 24px -4px rgba(0,0,0,0.08)",
        },
      }}
    />
  );
}
