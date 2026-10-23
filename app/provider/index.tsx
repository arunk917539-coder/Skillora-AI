"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode, useState } from "react";
import { CustomCursor } from "@/app/components/ui/custom-cursor";

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
        <CustomCursor />
      </QueryClientProvider>
    </NextAuthSessionProvider>
  );
}
