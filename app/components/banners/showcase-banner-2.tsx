import React from "react";
import Image from "next/image";
import { CheckCircle2, Lock, RefreshCw } from "lucide-react";
import { ScrollReveal } from "../ui/scroll-reveal";

const ShowcaseBanner2 = () => {
  return (
    <ScrollReveal delay={40} as="article" className="relative my-12 rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/90 via-slate-900/75 to-violet-950/30 p-8 sm:p-12 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Decorative ambient radial glow */}
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-violet-600/15 blur-[80px]" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
        <section className="flex flex-col gap-5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold uppercase tracking-wider text-violet-300 w-fit">
            Deliberate Practice Cycle
          </div>

          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Reflect. Improve. Practise Again.
          </h3>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Work through authentic workplace challenges, review your verified evidence snippets, and receive concrete development recommendations for your next attempt. Skillora AI leverages on-device AI evaluation to generate rubric-guided practice feedback without compromising privacy.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan-400 shrink-0" />
              <span>100% Private & Local</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Evidence-Backed Scoring</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-violet-400 shrink-0" />
              <span>Targeted Next Steps</span>
            </div>
          </div>
        </section>

        <div className="hidden lg:flex shrink-0 items-center justify-center p-6 rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur">
          <Image
            src="/banner-img2.svg"
            height={180}
            width={320}
            className="object-contain w-[260px] h-auto drop-shadow-md"
            alt="Workplace assessment illustration"
          />
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ShowcaseBanner2;
