import React from "react";
import type { Metadata } from "next";
import { SystemSimulator } from "@/app/components/architecture-simulator/system-simulator";

export const metadata: Metadata = {
  title: "Skillora AI | System Architecture Simulator",
  description:
    "Interactive technical architecture simulator demonstrating frontend, authentication, backend API, PostgreSQL persistence, and local Ollama Qwen3 AI evaluation pipeline.",
};

export default function ArchitectureSimulatorPage() {
  return (
    <main className="relative min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-12 py-10 sm:py-16 max-w-7xl mx-auto">
      <SystemSimulator />
    </main>
  );
}
