import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, AlertTriangle, ShieldCheck, Scale, Cpu, CheckCircle } from "lucide-react";
import { DATA_RETENTION_CONFIG } from "@/app/lib/workplace/retention-config";

export const metadata = {
  title: "Terms and Conditions | Skillora AI",
  description: "Skillora AI Terms and Conditions - Permitted use, AI limitations, account security, and organizational responsibilities.",
};

export default function TermsAndConditionsPage() {
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
          <Scale className="h-3.5 w-3.5" />
          <span>Platform Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Terms and Conditions
        </h1>
        <p className="text-sm text-slate-400">
          Effective Date: <span className="text-slate-200 font-mono">October 23, 2026</span> &bull; Version:{" "}
          <span className="text-slate-200 font-mono">{DATA_RETENTION_CONFIG.TERMS_VERSION}</span>
        </p>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-200/90 leading-relaxed">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <strong>Notice of Legal Review:</strong> These Terms and Conditions outline the operational boundaries and
              technical limitations of Skillora AI. Formal deployment requires review by qualified legal counsel in the
              organization&apos;s governing jurisdiction (<span className="font-mono text-amber-300">[Governing Jurisdiction]</span>).
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-10 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">1.</span> Purpose and Permitted Use
          </h2>
          <p className="text-slate-300">
            Skillora AI is an artificial intelligence-assisted workplace behavioural assessment and skill development
            platform. The platform is designed for formative learning, situational practice, and self-reflection on
            workplace decision-making.
          </p>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 space-y-2 text-xs">
            <p className="text-white font-semibold">Permitted Purposes:</p>
            <ul className="list-disc list-inside space-y-1 text-slate-300">
              <li>Individual professional development, situational reflection, and communication practice.</li>
              <li>Organizational scenario authoring by authorized HR personnel for structured training.</li>
              <li>Reviewing formative developmental milestones and recommended focus areas.</li>
            </ul>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">2.</span> Account Security & Eligibility
          </h2>
          <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
            <li><strong className="text-white">Eligibility:</strong> You must be at least 18 years old or the age of legal majority in your jurisdiction to create an account.</li>
            <li><strong className="text-white">Credential Confidentiality:</strong> You are solely responsible for maintaining the confidentiality of your account password. You agree to notify us immediately of any unauthorized access.</li>
            <li><strong className="text-white">Accurate Information:</strong> You agree to provide accurate registration information and not impersonate other individuals.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">3.</span> AI Capabilities, Limitations & Mandatory Human Review
          </h2>
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <Cpu className="h-5 w-5" />
              <span>Critical Notice on AI Evaluations</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Assessment feedback, rubric scores, and developmental action items are generated by a local artificial
              intelligence model (<code className="text-amber-300">qwen3:4b</code> via Ollama) evaluated against preset
              rubrics.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300">
              <li><strong className="text-white">No Employment Guarantees:</strong> Skillora AI does not guarantee hiring, promotion, career progression, or specific employment outcomes.</li>
              <li><strong className="text-white">Not a Certified Psychometric Test:</strong> Scores represent rubric heuristic alignment for learning purposes and are not standardized psychological evaluations.</li>
              <li><strong className="text-white">Mandatory Human Review:</strong> Employers and organizational administrators must NOT make consequential hiring, promotion, compensation, or termination decisions solely based on automated AI scores without substantial, qualified human review.</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">4.</span> Acceptable Use & Prohibited Conduct
          </h2>
          <p className="text-slate-300">When using Skillora AI, you agree NOT to:</p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-2 text-xs">
            <li>Attempt prompt injections, system jailbreaks, or adversarial inputs intended to bypass evaluation guidelines.</li>
            <li>Submit defamatory, harassing, discriminatory, sexually explicit, or unlawful content in scenario responses.</li>
            <li>Scrape, reverse engineer, decompile, or copy the underlying assessment prompts, rubrics, or platform codebase.</li>
            <li>Attempt to access another user&apos;s assessments, scores, or HR scenario authoring environments.</li>
            <li>Introduce malicious code, viruses, or automated scripts that overload or degrade system performance.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">5.</span> Intellectual Property & Submissions
          </h2>
          <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
            <li><strong className="text-white">Platform IP:</strong> The Skillora AI interface, brand assets, metallic emblem, software, and default scenario rubrics are the intellectual property of {DATA_RETENTION_CONFIG.ORGANIZATION_NAME}.</li>
            <li><strong className="text-white">Your Responses:</strong> You retain ownership of your submitted answers. By submitting, you grant Skillora AI a limited license to store, process, and evaluate your responses solely for providing platform features.</li>
            <li><strong className="text-white">Custom HR Scenarios:</strong> Organizations authoring custom scenarios retain ownership of their proprietary question prompts and criteria.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">6.</span> Service Availability & Disclaimers
          </h2>
          <p className="text-slate-300">
            Skillora AI is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. To the maximum extent permitted by applicable
            law, {DATA_RETENTION_CONFIG.ORGANIZATION_NAME} disclaims all warranties, express or implied, including merchantability,
            fitness for a particular purpose, and non-infringement.
          </p>
          <p className="text-xs text-slate-400">
            We do not warrant that platform operations will be uninterrupted, error-free, or that local Ollama AI inference will always be immediately available.
          </p>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">7.</span> Limitation of Liability
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            To the fullest extent permitted by law, {DATA_RETENTION_CONFIG.ORGANIZATION_NAME} shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, including loss of profits, data, employment opportunities,
            or goodwill, arising from or related to your use of the platform.
          </p>
          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-3 text-xs text-slate-400">
            <em>Jurisdictional Note:</em> Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities. In such jurisdictions, our liability shall be limited to the maximum extent permitted by law.
          </div>
        </section>

        {/* Section 8 */}
        <section className="space-y-3 border-t border-white/10 pt-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">8.</span> Governing Law & Inquiries
          </h2>
          <p className="text-slate-300">
            These terms are governed by the laws of {DATA_RETENTION_CONFIG.GOVERNING_JURISDICTION}. Any disputes shall be resolved in the competent courts located in <span className="font-mono text-cyan-300">[Designated Legal Jurisdiction / Venue]</span>.
          </p>
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 space-y-2 text-xs">
            <p className="text-slate-300"><strong className="text-white">Organization:</strong> {DATA_RETENTION_CONFIG.ORGANIZATION_NAME}</p>
            <p className="text-slate-300"><strong className="text-white">Legal & Compliance:</strong> {DATA_RETENTION_CONFIG.PRIVACY_EMAIL}</p>
            <p className="text-slate-300"><strong className="text-white">Registered Address:</strong> {DATA_RETENTION_CONFIG.ORGANIZATION_ADDRESS}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
