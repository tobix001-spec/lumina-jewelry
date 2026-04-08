/**
 * components/Providers.tsx
 * Client-side provider tree:
 *  - React Query (TanStack Query) for server state management
 *  - Toast notifications (via Radix Toast)
 */

"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function Providers({ children }: { children: React.ReactNode }) {
  // Each browser session gets its own QueryClient instance
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data stays fresh for 5 minutes, then refetches in background
            staleTime: 5 * 60 * 1000,
            // Retry failed queries once
            retry: 1,
            // Don't refetch on window focus in production (can cause flickering)
            refetchOnWindowFocus: process.env.NODE_ENV === "development",
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
