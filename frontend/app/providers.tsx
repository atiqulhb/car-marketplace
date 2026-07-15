// app/providers.tsx
"use client";

import { getQueryClient } from "@/lib/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { SocketProvider } from '@/providers/socket.provider'
import { NuqsAdapter } from "nuqs/adapters/next/app"

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
      </SocketProvider>
    </QueryClientProvider>
  );
}