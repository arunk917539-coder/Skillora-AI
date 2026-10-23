import Link from "next/link";
import Image from "next/image";
import React from "react";
import { CookiePreferencesTrigger } from "@/app/components/privacy/cookie-consent-banner";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#07090E] text-slate-400 py-12 px-6">
      <div className="mx-auto max-w-full sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1280px] flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative h-10 w-44">
              <Image
                src="/skillora-horizontal.png"
                alt="Skillora AI"
                fill
                className="object-contain object-left group-hover:brightness-110 transition-all"
              />
            </div>
          </Link>

          <p className="text-sm text-slate-400 max-w-md">
            AI-powered workplace behavioural assessment and skill development platform. Local-first, private, and formative.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-white tracking-wide text-xs uppercase">Platform</span>
            <Link href="/dashboard" className="hover:text-violet-400 transition-colors">Dashboard</Link>
            <Link href="/dashboard?tab=create_interview" className="hover:text-violet-400 transition-colors">Create Assessment</Link>
            <Link href="/dashboard?tab=mock_interviews" className="hover:text-violet-400 transition-colors">Active Assessments</Link>
            <Link href="/dashboard?tab=interview_history" className="hover:text-violet-400 transition-colors">Assessment History</Link>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-white tracking-wide text-xs uppercase">Core Competencies</span>
            <span className="text-slate-400">Communication</span>
            <span className="text-slate-400">Collaboration & Teamwork</span>
            <span className="text-slate-400">Problem Solving & Judgement</span>
            <span className="text-slate-400">Accountability & Ethics</span>
            <span className="text-slate-400">Planning & Prioritisation</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-white tracking-wide text-xs uppercase">Privacy & Legal</span>
            <Link href="/privacy" className="hover:text-violet-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-violet-400 transition-colors">Terms and Conditions</Link>
            <Link href="/cookies" className="hover:text-violet-400 transition-colors">Cookie Policy</Link>
            <CookiePreferencesTrigger />
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="font-semibold text-white tracking-wide text-xs uppercase">About & AI Notice</span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Skillora AI provides rubric-based formative feedback using a local Ollama model. Evaluations are advisory learning aids and must not serve as the sole basis for automated employment or hiring decisions.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} Skillora AI. All rights reserved.</span>
          <span className="text-slate-400 font-mono">Nexathon Enterprise Edition</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
