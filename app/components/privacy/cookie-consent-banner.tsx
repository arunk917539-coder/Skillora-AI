"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X, Settings2, Check } from "lucide-react";
import { DATA_RETENTION_CONFIG } from "@/app/lib/workplace/retention-config";

type ConsentPreferences = {
  version: string;
  timestamp: string;
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const CONSENT_STORAGE_KEY = "skillora_consent_preferences_v1";

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!stored) {
        setShowBanner(true);
      }
    } catch {
      // LocalStorage access restricted or unavailable
    }
  }, []);

  const savePreferences = (analytics: boolean, marketing: boolean) => {
    const preferences: ConsentPreferences = {
      version: DATA_RETENTION_CONFIG.COOKIE_POLICY_VERSION,
      timestamp: new Date().toISOString(),
      necessary: true,
      analytics,
      marketing,
    };
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Ignore storage errors
    }
    setShowBanner(false);
    setShowCustomize(false);
  };

  const handleAcceptAll = () => {
    savePreferences(true, true);
  };

  const handleRejectNonEssential = () => {
    savePreferences(false, false);
  };

  const handleSaveCustom = () => {
    savePreferences(analyticsConsent, marketingConsent);
  };

  if (!mounted || !showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl animate-in fade-in-50 slide-in-from-bottom-5 duration-300">
      <div className="rounded-2xl border border-white/15 bg-slate-900/95 p-5 sm:p-6 backdrop-blur-xl shadow-2xl text-white">
        {!showCustomize ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 max-w-2xl">
              <div className="rounded-full bg-violet-950/60 border border-violet-500/30 p-2.5 text-violet-400 shrink-0">
                <Cookie className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-white">
                  Privacy & Cookie Preferences
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Skillora AI uses strictly necessary cookies to keep you signed in securely and protect against CSRF attacks.
                  We do not use advertising trackers. You can read our full{" "}
                  <Link href="/cookies" className="text-violet-400 underline hover:text-violet-300">
                    Cookie Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-violet-400 underline hover:text-violet-300">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                onClick={() => setShowCustomize(true)}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <Settings2 className="h-3.5 w-3.5" />
                <span>Customize</span>
              </button>

              <button
                onClick={handleRejectNonEssential}
                className="flex-1 md:flex-none inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <span>Reject Non-Essential</span>
              </button>

              <button
                onClick={handleAcceptAll}
                className="flex-1 md:flex-none inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-violet-500/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Accept All</span>
              </button>
            </div>
          </div>
        ) : (
          /* Customization Dialog */
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-violet-400" />
                <h3 className="text-sm font-bold text-white">Customize Cookie Categories</h3>
              </div>
              <button
                onClick={() => setShowCustomize(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Category 1: Strictly Necessary */}
              <div className="rounded-xl border border-white/10 bg-slate-800/40 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Strictly Necessary</span>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Required
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Encrypted session authentication and CSRF security tokens. Cannot be disabled.
                </p>
              </div>

              {/* Category 2: Functional Analytics */}
              <div className="rounded-xl border border-white/10 bg-slate-800/40 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Performance / Analytics</span>
                  <input
                    type="checkbox"
                    id="analytics-toggle"
                    checked={analyticsConsent}
                    onChange={(e) => setAnalyticsConsent(e.target.checked)}
                    className="h-4 w-4 rounded accent-violet-600 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  (Currently disabled by default; Skillora AI does not run third-party analytics scripts).
                </p>
              </div>

              {/* Category 3: Marketing */}
              <div className="rounded-xl border border-white/10 bg-slate-800/40 p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Marketing & Advertising</span>
                  <input
                    type="checkbox"
                    id="marketing-toggle"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="h-4 w-4 rounded accent-violet-600 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  (Currently disabled by default; Skillora AI operates with zero advertising pixels).
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setShowCustomize(false)}
                className="px-4 py-1.5 rounded-full border border-white/10 bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleSaveCustom}
                className="px-5 py-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-semibold text-white shadow-md shadow-violet-500/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Trigger button for users to reopen cookie preferences anytime */
export function CookiePreferencesTrigger() {
  const resetConsent = () => {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      window.location.reload();
    } catch {
      // Ignore
    }
  };

  return (
    <button
      onClick={resetConsent}
      className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
    >
      <Cookie className="h-3 w-3" />
      <span>Cookie Preferences</span>
    </button>
  );
}
