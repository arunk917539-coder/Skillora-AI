"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";

export default function Provider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <NextAuthSessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </NextAuthSessionProvider>
  );
}
