"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { DevelopmentPlan } from "@/app/components/dashboard/development-plan";
import type { DevelopmentAction } from "@/app/lib/workplace/development-plans";
import type { CompetencyScores } from "@/app/lib/workplace/scoring";
import { parseStoredArray, parseStoredNumberRecord } from "@/app/lib/workplace/safe-json";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Target, Cpu, ShieldAlert } from "lucide-react";
import Link from "next/link";

type EvaluatedAnswer = {
  question: string;
  answer: string;
  expectedAnswer?: string;
  exampleStrongResponse?: string;
  score: number;
  wordCount: number;
  evidence: string[];
  strengths?: string[];
  improvements?: string[];
  competencies?: Record<string, number>;
  criterionEvaluations?: Array<{
    competency: string;
    score: number;
    evidence: string[];
    missingEvidence: string[];
    rationale: string;
  }>;
  evaluator?: string;
};

type Assessment = {
  id: string;
  name: string;
  type: string;
  questions: string[];
  expectedAnswers?: string[];
  isCompleted: boolean;
  feedBack?: {
    feedBack: string;
    problemSolving: number;
    systemDesign: number;
    communicationSkills: number;
    technicalAccuracy: number;
    behavioralResponses: number;
    timeManagement: number;
    answers?: string | null;
    competencyScores?: string | null;
    recommendations?: string | null;
  } | null;
};

export default function InterviewContent({ assessment }: { assessment: Assessment }) {
  const router = useRouter();
  const questions = Array.isArray(assessment.questions) ? assessment.questions : [];
  const expectedAnswersList = Array.isArray(assessment.expectedAnswers) ? assessment.expectedAnswers : [];
  const [answers, setAnswers] = useState<string[]>(questions.map(() => ""));
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [consentAcknowledged, setConsentAcknowledged] = useState(false);
  const [result, setResult] = useState<{
    average: number;
    feedback: string;
    competencies?: Partial<CompetencyScores>;
    recommendations?: DevelopmentAction[];
    scores?: EvaluatedAnswer[];
  } | null>(null);

  async function submit() {
    if (!consentAcknowledged) {
      setError("Please acknowledge the AI evaluation notice before submitting.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/interview/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: assessment.id,
          consentAcknowledged: true,
          answers: questions.map((question, i) => ({
            question,
            answer: answers[i] || "",
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not submit assessment.");
      setResult({
        average: data.average,
        feedback: data.feedback,
        competencies: data.competencies,
        recommendations: data.recommendations,
        scores: data.scores,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (assessment.isCompleted || result) {
    const feedback =
      result?.feedback ||
      assessment.feedBack?.feedBack ||
      "This assessment has been completed.";
    const storedFeedback = assessment.feedBack;

    const parsedCompetencies = parseStoredNumberRecord(storedFeedback?.competencyScores);
    const storedCompetencies =
      parsedCompetencies &&
      Object.keys(parsedCompetencies).some(
        (key) =>
          ["communication", "problemSolving", "collaboration", "accountability", "planning"].includes(key) &&
          typeof parsedCompetencies[key] === "number"
      )
        ? (parsedCompetencies as Partial<CompetencyScores>)
        : undefined;

    const storedRecommendations = parseStoredArray<DevelopmentAction>(
      storedFeedback?.recommendations,
      (item): item is DevelopmentAction =>
        Boolean(
          item &&
            typeof item === "object" &&
            typeof (item as DevelopmentAction).competency === "string" &&
            typeof (item as DevelopmentAction).label === "string" &&
            typeof (item as DevelopmentAction).score === "number" &&
            typeof (item as DevelopmentAction).reason === "string" &&
            Array.isArray((item as DevelopmentAction).actions) &&
            (item as DevelopmentAction).actions.every((action) => typeof action === "string") &&
            ["high", "medium", "maintain"].includes((item as DevelopmentAction).priority)
        )
    );

    const storedAnswers = parseStoredArray<EvaluatedAnswer>(
      storedFeedback?.answers,
      (item): item is EvaluatedAnswer =>
        Boolean(
          item &&
            typeof item === "object" &&
            typeof (item as EvaluatedAnswer).question === "string" &&
            typeof (item as EvaluatedAnswer).answer === "string" &&
            typeof (item as EvaluatedAnswer).score === "number" &&
            typeof (item as EvaluatedAnswer).wordCount === "number" &&
            Array.isArray((item as EvaluatedAnswer).evidence) &&
            (item as EvaluatedAnswer).evidence.every((signal) => typeof signal === "string")
        )
    );

    const evaluatedAnswers: EvaluatedAnswer[] = result?.scores || storedAnswers || [];

    // Overall score calculation
    const score =
      result?.average ??
      (evaluatedAnswers.length > 0
        ? Math.round(evaluatedAnswers.reduce((sum, item) => sum + item.score, 0) / evaluatedAnswers.length)
        : storedFeedback
        ? Math.round(
            (storedFeedback.problemSolving +
              storedFeedback.systemDesign +
              storedFeedback.communicationSkills +
              storedFeedback.technicalAccuracy +
              storedFeedback.behavioralResponses) /
              5
          )
        : 0);

    const allStrengths = [
      ...new Set(evaluatedAnswers.flatMap((item) => item.strengths || [])),
    ].slice(0, 3);
    const allImprovements = [
      ...new Set(evaluatedAnswers.flatMap((item) => item.improvements || [])),
    ].slice(0, 3);

    return (
      <Card className="mx-auto my-8 max-w-4xl border border-white/10 bg-slate-900/85 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-white/10 p-6 sm:p-8 bg-slate-900/90">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 font-semibold uppercase tracking-wider text-violet-300">
                <Sparkles className="h-3 w-3" />
                {assessment.type}
              </span>
              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Assessment Results
              </CardTitle>
              <p className="text-xs text-slate-400">
                Scenario: <strong className="text-slate-200">{assessment.name}</strong>
              </p>
            </div>
            <div className="flex flex-col sm:items-end justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 sm:px-6">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold block">
                Overall Score
              </span>
              <span className="text-3xl font-extrabold font-mono text-white">
                {score} <span className="text-sm font-normal text-emerald-400">/ 100</span>
              </span>
            </div>
          </div>
          <CardDescription className="text-xs text-slate-400 pt-2">
            Detailed scenario-by-scenario evaluation and formative development guidance powered by local Ollama AI.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 p-6 sm:p-8">
          {/* AI ASSESSMENT SAFEGUARD & HUMAN REVIEW NOTICE */}
          <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-xs text-amber-200/90 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 font-semibold text-amber-300">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>Formative Practice Feedback Notice</span>
            </div>
            <p className="text-slate-300">
              This assessment was evaluated using a local Ollama AI model against predetermined workplace competency rubrics.
              Scores and insights are advisory learning tools for professional reflection, not standardized psychometrics or certified hiring signals.
              Organizational policies must require meaningful human review before making consequential employment or promotion decisions.
            </p>
            <div className="pt-1 flex items-center justify-between border-t border-amber-500/20 text-[11px]">
              <span className="text-slate-400">Questions or discrepancy in feedback?</span>
              <Link href="/privacy" className="text-violet-400 underline hover:text-violet-300 font-medium">
                Review Privacy & Human Review Policy
              </Link>
            </div>
          </div>

          {/* SECTION I: SCENARIO-BY-SCENARIO RESULTS */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Scenario-by-Scenario Evaluation
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {evaluatedAnswers.length} Scenarios
              </span>
            </div>

            {evaluatedAnswers.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                Detailed scenario feedback is being processed or was not recorded for this historical run.
              </p>
            ) : (
              evaluatedAnswers.map((item, answerIndex) => {
                const expectedAns =
                  item.expectedAnswer ||
                  item.exampleStrongResponse ||
                  expectedAnswersList[answerIndex] ||
                  "Clarify key facts, consider affected colleagues, explain reasoning clearly, agree on practical next steps with owners, and follow up.";

                return (
                  <div
                    key={`${answerIndex}-${item.question.slice(0, 20)}`}
                    className="rounded-2xl border border-white/10 bg-slate-800/40 p-6 space-y-4 shadow-md backdrop-blur"
                  >
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="font-bold text-sm text-violet-300">
                        Scenario {answerIndex + 1} of {evaluatedAnswers.length}
                      </span>
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-white">
                        Score: {item.score} / 100
                      </span>
                    </div>

                    {/* 1. Scenario question */}
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        1. Scenario Question
                      </h4>
                      <p className="rounded-xl border border-white/5 bg-slate-900/60 p-4 text-sm font-medium text-slate-100 leading-relaxed">
                        {item.question}
                      </p>
                    </div>

                    {/* 2. Your submitted answer */}
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        2. Your Submitted Response
                      </h4>
                      <p className="rounded-xl border border-white/5 bg-slate-950/60 p-4 text-xs sm:text-sm whitespace-pre-wrap text-slate-200 leading-relaxed font-mono">
                        {item.answer}
                      </p>
                    </div>

                    {/* 3. Expected answer */}
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        3. Authoritative Strong Response Criteria
                      </h4>
                      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                        <p className="italic">{expectedAns}</p>
                      </div>
                    </div>

                    {/* 4. Individual score & Rubric breakdown */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        4. Competency Breakdown
                      </h4>
                      <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4 space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold font-mono text-white">{item.score}</span>
                          <span className="text-xs text-slate-400">/ 100 ({item.score}%)</span>
                        </div>

                        {item.criterionEvaluations && item.criterionEvaluations.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-white/5">
                            <div className="grid gap-2.5 sm:grid-cols-2">
                              {item.criterionEvaluations.map((crit, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="rounded-lg border border-white/5 bg-slate-800/60 p-3 text-xs space-y-1"
                                >
                                  <div className="flex justify-between items-center font-medium">
                                    <span className="capitalize text-slate-200">
                                      {crit.competency.replace(/([A-Z])/g, " $1")}
                                    </span>
                                    <span className="font-mono font-semibold text-violet-300">
                                      {crit.score} / 100
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 leading-relaxed">
                                    {crit.rationale}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 5. Feedback */}
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        5. Evidence & Evaluative Feedback
                      </h4>
                      <div className="rounded-xl border border-white/5 bg-slate-900/60 p-4 text-xs space-y-3">
                        {item.strengths && item.strengths.length > 0 && (
                          <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3 space-y-1">
                            <p className="font-semibold text-xs text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              What was done well:
                            </p>
                            <ul className="list-disc pl-5 text-xs text-emerald-200/90 space-y-0.5 mt-1">
                              {item.strengths.map((str, sIdx) => (
                                <li key={sIdx}>{str}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {item.improvements && item.improvements.length > 0 && (
                          <div className="rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 space-y-1">
                            <p className="font-semibold text-xs text-amber-400 flex items-center gap-1.5">
                              <AlertCircle className="h-3.5 w-3.5" />
                              What could be improved:
                            </p>
                            <ul className="list-disc pl-5 text-xs text-amber-200/90 space-y-0.5 mt-1">
                              {item.improvements.map((imp, iIdx) => (
                                <li key={iIdx}>{imp}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {item.evidence && item.evidence.length > 0 && (
                          <div className="rounded-lg border border-white/5 bg-slate-800/40 p-3 space-y-1">
                            <p className="font-semibold text-[11px] text-slate-400">
                              Verified answer snippets:
                            </p>
                            <ul className="list-disc pl-5 text-[11px] text-slate-400 space-y-0.5 mt-1 font-mono">
                              {item.evidence.map((ev, evIdx) => (
                                <li key={evIdx}>&ldquo;{ev}&rdquo;</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* SECTION II: OVERALL RESULTS */}
          <div className="border-t border-white/10 pt-6 space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight border-b border-white/5 pb-2">
              Overall Assessment Evaluation
            </h3>

            {/* Overall Feedback */}
            <div className="space-y-1">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Formative Summary
              </h4>
              <div className="rounded-xl border border-white/5 bg-slate-800/50 p-4 text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
                {feedback}
              </div>
            </div>

            {/* Strengths & Improvements in 2 cols */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Key Strengths
                </h4>
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-xs text-emerald-200/90">
                  {allStrengths.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {allStrengths.map((str, i) => (
                        <li key={i}>{str}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="italic text-slate-400">Demonstrated constructive workplace approach.</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Development Opportunities
                </h4>
                <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 text-xs text-amber-200/90">
                  {allImprovements.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {allImprovements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="italic text-slate-400">Continue refining clarity and follow-through.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actionable Development Recommendations */}
            <div className="space-y-2 pt-2">
              <DevelopmentPlan items={result?.recommendations || storedRecommendations || []} />
            </div>
          </div>

          <p className="text-[11px] text-slate-500 pt-2">
            Skillora AI evaluation is rubric-guided and powered by local Ollama AI. Scores are designed for self-reflection and professional development, not for hiring or performance evaluations.
          </p>

          <div className="flex flex-wrap gap-3 pt-2 border-t border-white/5">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-500/25 hover:brightness-110 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </button>
            <button
              onClick={() => router.push("/dashboard?tab=create_interview")}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-800 px-6 py-2.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            >
              <span>Practise Another Scenario</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!questions.length) {
    return (
      <Card className="mx-auto mt-8 max-w-xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl p-6 text-center">
        <CardContent className="space-y-4 p-0">
          <p className="text-sm text-slate-400">No scenarios were found for this assessment.</p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="rounded-full bg-violet-600 hover:bg-violet-500 text-white text-xs"
          >
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto my-8 max-w-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="border-b border-white/10 p-6 sm:p-8 bg-slate-900/90 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400 bg-violet-950/60 border border-violet-500/30 px-3 py-1 rounded-full">
            {assessment.type}
          </span>
          <span className="text-xs font-mono font-medium text-slate-400">
            Scenario {index + 1} of {questions.length}
          </span>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {assessment.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-6 sm:p-8">
        <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-5 text-base sm:text-lg leading-relaxed font-medium text-white shadow-inner">
          {questions[index]}
        </div>

        <div className="space-y-2">
          <label htmlFor="response" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            How would you respond in this workplace situation?
          </label>
          <textarea
            id="response"
            rows={7}
            value={answers[index] || ""}
            onChange={(e) =>
              setAnswers((old) =>
                old.map((answer, i) => (i === index ? e.target.value : answer))
              )
            }
            placeholder="Explain your approach, who you would involve, what trade-offs you consider, and what concrete next steps you would take."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm text-white placeholder:text-slate-500 shadow-inner outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 leading-relaxed font-sans"
          />
        </div>

        {index === questions.length - 1 && (
          <div className="rounded-2xl border border-violet-500/25 bg-slate-950/70 p-4 space-y-2 text-xs">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="assessmentConsent"
                checked={consentAcknowledged}
                onChange={(e) => setConsentAcknowledged(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-slate-800 text-violet-600 focus:ring-violet-500/20 cursor-pointer accent-violet-600 shrink-0"
              />
              <label htmlFor="assessmentConsent" className="text-slate-300 leading-relaxed cursor-pointer text-xs">
                I acknowledge that my responses will be evaluated locally by Ollama AI against structured workplace competency rubrics. I understand these scores are advisory formative development guides, not certified psychometrics or automated hiring decisions.
              </label>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-3 pt-2">
          <Button
            variant="outline"
            disabled={index === 0 || busy}
            onClick={() => setIndex((i) => i - 1)}
            className="rounded-full border-white/10 bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-200"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Previous
          </Button>

          {index < questions.length - 1 ? (
            <button
              disabled={busy || !(answers[index] || "").trim()}
              onClick={() => setIndex((i) => i + 1)}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-500/20 hover:brightness-110 active:scale-[0.98] disabled:opacity-40 cursor-pointer"
            >
              <span>Next Scenario</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              disabled={busy || answers.every((a) => !a.trim()) || !consentAcknowledged}
              onClick={submit}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-7 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-[0.98] disabled:opacity-40 cursor-pointer"
            >
              {busy ? (
                <>
                  <Cpu className="h-4 w-4 animate-spin" />
                  <span>Evaluating with Ollama AI…</span>
                </>
              ) : (
                <>
                  <span>Complete Assessment</span>
                  <CheckCircle2 className="h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-800/40 bg-rose-950/40 p-3.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-white/5">
          <Cpu className="h-3.5 w-3.5 text-violet-400 shrink-0" />
          <span>
            Responses are evaluated locally by Ollama AI (`qwen3:4b`). No answers or private reflections leave your machine.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
