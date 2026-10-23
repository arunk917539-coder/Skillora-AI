import React from "react";
import Link from "next/link";
import { ArrowLeft, Cookie, ShieldCheck, Check, Info, Lock } from "lucide-react";
import { DATA_RETENTION_CONFIG } from "@/app/lib/workplace/retention-config";

export const metadata = {
  title: "Cookie Policy | Skillora AI",
  description: "Skillora AI Cookie Policy - Verified cookie inventory and plain-language explanation of strictly necessary session cookies.",
};

export default function CookiePolicyPage() {
  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-slate-200">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4 border-b border-white/10 pb-8 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold uppercase tracking-wider text-violet-300">
          <Cookie className="h-3.5 w-3.5" />
          <span>Transparency Notice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Cookie Policy & Inventory
        </h1>
        <p className="text-sm text-slate-400">
          Effective Date: <span className="text-slate-200 font-mono">October 23, 2026</span> &bull; Version:{" "}
          <span className="text-slate-200 font-mono">{DATA_RETENTION_CONFIG.COOKIE_POLICY_VERSION}</span>
        </p>
      </div>

      <div className="space-y-10 text-sm leading-relaxed">
        {/* Section 1: Audited Technical Status */}
        <section className="space-y-3">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="h-5 w-5" />
              <span>Verified Application Status: Strictly Necessary Cookies Only</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Skillora AI uses <strong>only strictly necessary cookies</strong> essential for user authentication, security,
              and cross-site request forgery (CSRF) protection.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3 flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-xs text-slate-300"><strong>Zero Advertising Trackers:</strong> No marketing pixels or ad beacons.</span>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3 flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                <span className="text-xs text-slate-300"><strong>Zero Analytics Scripts:</strong> No Google Analytics or third-party telemetry.</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 pt-1">
            Under Article 5(3) of the EU ePrivacy Directive and comparable international data privacy frameworks, cookies that are strictly necessary to provide an information society service explicitly requested by the user are exempt from prior consent requirements.
          </p>
        </section>

        {/* Section 2: Verified Cookie Inventory */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">1.</span> Verified Cookie Inventory
          </h2>
          <p className="text-slate-300">
            The following cookies may be set in your browser during your use of Skillora AI:
          </p>

          <div className="w-full overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-slate-800/60 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3.5">Cookie Name</th>
                  <th className="p-3.5">Provider</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Purpose</th>
                  <th className="p-3.5">Lifetime</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="p-3.5 font-mono text-violet-300">authjs.session-token</td>
                  <td className="p-3.5">Skillora AI (First-party)</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-semibold">
                      Strictly Necessary
                    </span>
                  </td>
                  <td className="p-3.5">Maintains your authenticated session state and user identity securely via encrypted JWT.</td>
                  <td className="p-3.5 font-mono">Session / 30 Days</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-violet-300">__Secure-authjs.session-token</td>
                  <td className="p-3.5">Skillora AI (First-party)</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-semibold">
                      Strictly Necessary
                    </span>
                  </td>
                  <td className="p-3.5">HTTPS-enforced variant of the session token used in production deployment.</td>
                  <td className="p-3.5 font-mono">Session / 30 Days</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-violet-300">authjs.csrf-token</td>
                  <td className="p-3.5">Skillora AI (First-party)</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-semibold">
                      Strictly Necessary
                    </span>
                  </td>
                  <td className="p-3.5">Prevents Cross-Site Request Forgery (CSRF) attacks during login and form submissions.</td>
                  <td className="p-3.5 font-mono">Session</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-mono text-violet-300">authjs.callback-url</td>
                  <td className="p-3.5">Skillora AI (First-party)</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-semibold">
                      Strictly Necessary
                    </span>
                  </td>
                  <td className="p-3.5">Stores the target destination URL to redirect you appropriately after completing login.</td>
                  <td className="p-3.5 font-mono">Session</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Browser Storage */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">2.</span> Local Storage & Browser Caching
          </h2>
          <p className="text-slate-300">
            Skillora AI uses browser local storage strictly for client-side user experience preferences:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-2 text-xs">
            <li><strong className="text-white font-mono">skillora_consent_preferences_v1:</strong> Remembers your consent acknowledgement choice so you are not re-prompted continuously.</li>
            <li>No persistent tracking identifiers, advertising tokens, or behavioural profiles are stored in local storage.</li>
          </ul>
        </section>

        {/* Section 4: Managing Cookies */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">3.</span> How to Manage or Disable Cookies
          </h2>
          <p className="text-slate-300">
            You can configure your browser settings to block or delete cookies at any time. However, because Skillora AI
            relies exclusively on session cookies for authentication, blocking all cookies will prevent you from signing in
            or taking assessments.
          </p>
          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 text-xs text-slate-400">
            Most modern web browsers allow you to view, delete, and block cookies via their Privacy & Security settings menu (e.g. Chrome, Firefox, Safari, Edge).
          </div>
        </section>

        {/* Section 5: Inquiries */}
        <section className="space-y-3 border-t border-white/10 pt-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">4.</span> Questions Regarding Cookies
          </h2>
          <p className="text-slate-300">
            If you have questions regarding our use of session cookies, please contact:
          </p>
          <p className="text-xs text-slate-300">
            <strong className="text-white">Email:</strong> {DATA_RETENTION_CONFIG.PRIVACY_EMAIL}
          </p>
        </section>
      </div>
    </div>
  );
}
