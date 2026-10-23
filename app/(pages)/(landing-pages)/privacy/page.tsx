import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, FileText, Cpu, Database, Eye, AlertCircle, RefreshCw } from "lucide-react";
import { DATA_RETENTION_CONFIG } from "@/app/lib/workplace/retention-config";

export const metadata = {
  title: "Privacy Policy | Skillora AI",
  description: "Skillora AI Privacy Policy - Plain-language transparency on data collection, local AI processing, and privacy rights.",
};

export default function PrivacyPolicyPage() {
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
          <Shield className="h-3.5 w-3.5" />
          <span>Privacy & Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400">
          Effective Date: <span className="text-slate-200 font-mono">October 23, 2026</span> &bull; Policy Version:{" "}
          <span className="text-slate-200 font-mono">{DATA_RETENTION_CONFIG.PRIVACY_POLICY_VERSION}</span>
        </p>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-200/90 leading-relaxed">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <strong>Legal Notice:</strong> This privacy document reflects the technical architecture and verified data
              flows of the Skillora AI application. Specific corporate entities, operational jurisdictions, and statutory
              retention requirements marked in brackets (<span className="font-mono text-amber-300">[like this]</span>)
              must be finalized by organizational legal counsel prior to formal commercial deployment.
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-10 text-sm leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">1.</span> Information We Collect
          </h2>
          <p className="text-slate-300">
            Skillora AI collects only the minimal personal and behavioural data necessary to provide workplace scenario
            assessments, generate formative rubric feedback, and support individual professional growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
              <h3 className="font-semibold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-300">
                <FileText className="h-3.5 w-3.5" />
                Account Data (Required)
              </h3>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5">
                <li><strong className="text-white">Full Name:</strong> To identify your account and greet you on the platform.</li>
                <li><strong className="text-white">Email Address:</strong> Used as your unique login identifier and for password recovery.</li>
                <li><strong className="text-white">Password:</strong> Securely hashed using bcrypt (cost factor 10). Plaintext passwords are never stored.</li>
                <li><strong className="text-white">Account Role:</strong> Assigned role (<code className="text-violet-300">user</code> or <code className="text-violet-300">hr</code>) controlling feature access.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 space-y-2">
              <h3 className="font-semibold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-300">
                <Cpu className="h-3.5 w-3.5" />
                Assessment Data (Required to Assess)
              </h3>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5">
                <li><strong className="text-white">Scenario Responses:</strong> The written reflections you submit for workplace challenges (up to 5,000 characters per prompt).</li>
                <li><strong className="text-white">Evaluation Scores:</strong> Rubric-derived scores across 5 core competencies (0–100).</li>
                <li><strong className="text-white">Evidence Quotes:</strong> Text snippets from your answers verified by the evaluator.</li>
                <li><strong className="text-white">Development Plans:</strong> Generated action items and growth recommendations.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4 text-xs text-slate-400 mt-2">
            <strong className="text-slate-200">What we do NOT collect:</strong> Skillora AI does not collect government identification numbers, financial details, biometric data, health records, protected demographic traits, or browsing histories across external websites.
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">2.</span> How We Process Your Data
          </h2>
          <p className="text-slate-300">
            Your information is processed strictly for the following operational purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
            <li><strong className="text-white">Authentication & Account Management:</strong> Validating credentials, maintaining session integrity via secure cookies, and enforcing role authorization.</li>
            <li><strong className="text-white">Scenario Assessment Generation:</strong> Building relevant workplace scenarios based on chosen competencies and difficulty levels.</li>
            <li><strong className="text-white">Formative AI Evaluation:</strong> Generating developmental feedback, rubric scores, and milestone recommendations.</li>
            <li><strong className="text-white">Progress Analytics:</strong> Calculating historical improvement across comparable competency categories within your private account.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">3.</span> Local-First AI Architecture & Privacy
          </h2>
          <div className="rounded-2xl border border-violet-500/20 bg-slate-900/70 p-5 space-y-3">
            <div className="flex items-center gap-2 text-violet-400 font-semibold">
              <Cpu className="h-5 w-5" />
              <span>Zero Cloud AI Transmission</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm">
              Candidate responses and assessment evaluations are executed using a <strong>locally deployed Ollama instance</strong> (<code className="text-violet-300">qwen3:4b</code>) hosted in the same infrastructure as the application server.
            </p>
            <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
              <li>Candidate answers are <strong className="text-slate-200">never transmitted to external commercial AI providers</strong> (e.g. OpenAI, Anthropic, or Google Gemini).</li>
              <li>Your responses are not utilized to train public foundation models or shared with third-party AI repositories.</li>
              <li>AI feedback is heuristic and formative; it does not constitute a certified psychological assessment or an automated hiring decision.</li>
            </ul>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">4.</span> Access Control & HR Separation
          </h2>
          <p className="text-slate-300">
            Skillora AI implements server-side authorization boundaries to protect candidate and employee records:
          </p>
          <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
            <li><strong className="text-white">Candidate Privacy:</strong> Individual users can only access assessments, scorecards, and reports linked directly to their authenticated account identifier (<code className="text-violet-300">userId</code>). Insecure direct object references (IDOR) are blocked server-side.</li>
            <li><strong className="text-white">HR Scenario Administration:</strong> Users with verified HR permissions can author, update, and manage organizational workplace scenarios and rubric criteria.</li>
            <li><strong className="text-white">Confidential Assessment History:</strong> Candidate responses and historical scorecards are not publicly indexable or visible to other candidates.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">5.</span> Data Storage, Retention & Deletion
          </h2>
          <p className="text-slate-300">
            Data is stored in a relational PostgreSQL database. We adhere to data minimization principles with the following operational retention targets:
          </p>
          <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-slate-300">Completed Assessments & Feedback:</span>
              <span className="font-mono text-cyan-300">{DATA_RETENTION_CONFIG.COMPLETED_ASSESSMENT_RETENTION_DAYS} Days (1 Year) <span className="text-slate-500">[Configurable]</span></span>
            </div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-slate-300">Incomplete Assessment Drafts:</span>
              <span className="font-mono text-cyan-300">{DATA_RETENTION_CONFIG.INCOMPLETE_ASSESSMENT_RETENTION_DAYS} Days (30 Days) <span className="text-slate-500">[Configurable]</span></span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Security & HR Audit Logs:</span>
              <span className="font-mono text-cyan-300">{DATA_RETENTION_CONFIG.AUDIT_LOG_RETENTION_DAYS} Days (2 Years) <span className="text-slate-500">[Configurable]</span></span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            <em>Backup Clarification:</em> When data is deleted from live application tables, it is removed immediately from production queries. Scheduled disaster-recovery backups are overwritten and cycled according to the hosting provider’s backup retention lifecycle.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">6.</span> Third-Party Service Providers
          </h2>
          <p className="text-slate-300">
            Skillora AI minimizes external sub-processors. The current active runtime infrastructure uses:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-300 pl-2 text-xs">
            <li><strong className="text-white">Database Hosting:</strong> PostgreSQL instance (<span className="text-slate-400">[Host Provider, e.g. AWS RDS / Supabase / Neon, Region: [Deployment Region]]</span>).</li>
            <li><strong className="text-white">Application Hosting:</strong> Node.js / Next.js container environment (<span className="text-slate-400">[Host Provider, e.g. Vercel / AWS ECS / Self-Hosted, Region: [Deployment Region]]</span>).</li>
            <li><strong className="text-white">Third-Party Analytics & Ads:</strong> <span className="text-emerald-400 font-semibold">None.</span> No marketing pixels, Google Analytics, telemetry beacons, or session replays are embedded.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">7.</span> Your Privacy Rights
          </h2>
          <p className="text-slate-300">
            Depending on your jurisdiction (such as GDPR, UK GDPR, or CCPA/CPRA), you may hold statutory rights regarding your personal data:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-white/5 bg-slate-900/40">
              <strong className="text-white block mb-1">Right of Access & Portability</strong>
              You may request a machine-readable copy of your profile and assessment history using our data export tool.
            </div>
            <div className="p-3 rounded-xl border border-white/5 bg-slate-900/40">
              <strong className="text-white block mb-1">Right to Erasure (Deletion)</strong>
              You may request deletion of your account and associated score records at any time.
            </div>
            <div className="p-3 rounded-xl border border-white/5 bg-slate-900/40">
              <strong className="text-white block mb-1">Right to Rectification</strong>
              You may correct inaccurate account information directly in your account settings.
            </div>
            <div className="p-3 rounded-xl border border-white/5 bg-slate-900/40">
              <strong className="text-white block mb-1">Human Review of AI Feedback</strong>
              You may request human clarification or dispute AI-generated formative scores through our review process.
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">8.</span> Security Practices
          </h2>
          <p className="text-slate-300">
            We implement technical and organizational measures to safeguard your information, including:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs pl-2">
            <li>Strict HTTP security headers (Content Security Policy, X-Frame-Options, HSTS).</li>
            <li>Encrypted transport protocols (TLS/HTTPS enforced in production).</li>
            <li>Session cookies marked <code className="text-violet-300">HttpOnly</code>, <code className="text-violet-300">SameSite=Lax</code>, and <code className="text-violet-300">Secure</code> in HTTPS environments.</li>
            <li>In-memory rate limiting on authentication and AI evaluation endpoints.</li>
            <li>Sanitized logging practices to prevent sensitive responses from leaking into server logs.</li>
          </ul>
          <p className="text-xs text-slate-400">
            <em>Disclaimer:</em> While we implement robust industry-standard safeguards, no internet transmission or electronic storage method can guarantee absolute 100% security.
          </p>
        </section>

        {/* Section 9 */}
        <section className="space-y-3 border-t border-white/10 pt-8">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">9.</span> Contact & Inquiries
          </h2>
          <p className="text-slate-300">
            For privacy inquiries, data export requests, or human review of assessment feedback, contact our privacy officer at:
          </p>
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 space-y-2 text-xs">
            <p className="text-slate-300"><strong className="text-white">Organization:</strong> {DATA_RETENTION_CONFIG.ORGANIZATION_NAME}</p>
            <p className="text-slate-300"><strong className="text-white">Privacy Officer:</strong> {DATA_RETENTION_CONFIG.PRIVACY_EMAIL}</p>
            <p className="text-slate-300"><strong className="text-white">General Support:</strong> {DATA_RETENTION_CONFIG.SUPPORT_EMAIL}</p>
            <p className="text-slate-300"><strong className="text-white">Registered Address:</strong> {DATA_RETENTION_CONFIG.ORGANIZATION_ADDRESS}</p>
            <p className="text-slate-300"><strong className="text-white">Governing Jurisdiction:</strong> {DATA_RETENTION_CONFIG.GOVERNING_JURISDICTION}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
