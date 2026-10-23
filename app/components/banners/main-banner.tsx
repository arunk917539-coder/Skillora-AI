import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Cpu, Target, Sparkles } from "lucide-react";
import { ScrollReveal } from "../ui/scroll-reveal";

const MainBanner = () => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 items-center w-full justify-between flex flex-col-reverse xl:flex-row gap-12">
      <ScrollReveal delay={50} className="flex items-center xl:items-start gap-8 flex-col max-w-2xl">
        {/* Enterprise Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold uppercase tracking-wider text-violet-300 shadow-sm backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
          <span>Local-First Behavioural Intelligence</span>
        </div>

        <div className="flex gap-5 flex-col items-center xl:items-start">
          <h1 className="text-center xl:text-left text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
            Skillora AI — Master{" "}
            <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Real Workplace Decisions
            </span>
          </h1>

          <p className="text-center xl:text-left text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Explore authentic workplace scenarios, reflect on your reasoning, and receive explainable rubric feedback powered by a local Ollama model. Designed for continuous behavioural skill development, reflective growth, and transparent competency signals.
          </p>
        </div>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap justify-center xl:justify-start gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900/60 backdrop-blur">
            <Cpu className="h-4 w-4 text-cyan-400" />
            <span>Local Ollama (qwen3:4b)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900/60 backdrop-blur">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Formative & Explainable</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900/60 backdrop-blur">
            <Target className="h-4 w-4 text-violet-400" />
            <span>5 Core Competencies</span>
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-300 hover:brightness-110 hover:shadow-violet-500/40 cursor-pointer">
              <span>Start an Assessment</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
          <Link href="#features" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-6 py-4 text-sm font-medium text-slate-300 transition-all hover:bg-white/5 hover:text-white cursor-pointer">
              <span>Explore Features</span>
            </button>
          </Link>
        </div>
      </ScrollReveal>

      {/* Hero Visual — Metallic Logo Showcase Card */}
      <ScrollReveal delay={180} className="relative w-full max-w-[460px] xl:max-w-[500px] flex items-center justify-center">
        {/* Outer ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-blue-600/15 to-transparent rounded-3xl blur-2xl -z-10" />

        <div className="relative w-full rounded-3xl border border-white/15 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-6">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            <Image
              src="/skillora-logo.jpg"
              alt="Skillora AI Metallic Emblem"
              fill
              className="object-contain rounded-2xl drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
              priority
            />
          </div>

          <div className="w-full border-t border-white/10 pt-4 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              Explainable Evaluation
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-semibold">
              Ready
            </span>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default MainBanner;
