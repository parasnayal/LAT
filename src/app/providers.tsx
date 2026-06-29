"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { ToastProvider } from "@/shared/components/toast/toast-provider";
import { createQueryClient } from "@/shared/lib/queryClient";

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState<QueryClient>(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}
