"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { DevelopmentPlan } from "@/app/components/dashboard/development-plan";
import type { DevelopmentAction } from "@/app/lib/workplace/development-plans";
import type { CompetencyScores } from "@/app/lib/workplace/scoring";
import { parseStoredArray, parseStoredNumberRecord } from "@/app/lib/workplace/safe-json";

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
  const [result, setResult] = useState<{
    average: number;
    feedback: string;
    competencies?: Partial<CompetencyScores>;
    recommendations?: DevelopmentAction[];
    scores?: EvaluatedAnswer[];
  } | null>(null);

  async function submit() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/interview/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: assessment.id,
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
      <Card className="mx-auto mt-8 max-w-4xl shadow-md border bg-white/90">
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="inline-block mb-1 text-xs px-2.5 py-0.5 rounded-full border border-gray-300 font-medium">
                {assessment.type}
              </span>
              <CardTitle className="text-2xl font-bold">Assessment Results</CardTitle>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground block">Overall Score</span>
              <span className="text-2xl font-bold text-dark">{score} / 100</span>
            </div>
          </div>
          <CardDescription>
            Detailed scenario-by-scenario evaluation and development guidance powered by local Ollama evaluation.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          {/* SECTION I: SCENARIO-BY-SCENARIO RESULTS (Items 1 - 5 for each scenario) */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-dark border-b pb-2">
              Scenario-by-Scenario Assessment Results
            </h3>

            {evaluatedAnswers.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
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
                    className="rounded-xl border bg-card p-5 space-y-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-bold text-sm text-dark">
                        Scenario {answerIndex + 1} of {evaluatedAnswers.length}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-dark border">
                        Score: {item.score} / 100
                      </span>
                    </div>

                    {/* 1. Scenario question */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        1. Scenario Question
                      </h4>
                      <p className="rounded-lg border bg-slate-50 p-3 text-sm font-medium text-dark leading-relaxed">
                        {item.question}
                      </p>
                    </div>

                    {/* 2. Your submitted answer */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        2. Your Submitted Answer
                      </h4>
                      <p className="rounded-lg border bg-white p-3 text-sm whitespace-pre-wrap text-dark leading-relaxed">
                        {item.answer}
                      </p>
                    </div>

                    {/* 3. Expected answer */}
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        3. Expected Answer
                      </h4>
                      <div className="rounded-lg border border-amber-200/80 bg-amber-50/60 p-3 text-sm">
                        <p className="text-dark italic leading-relaxed">{expectedAns}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Authoritative strong response criteria for this scenario.
                        </p>
                      </div>
                    </div>

                    {/* 4. Individual score */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        4. Individual Score
                      </h4>
                      <div className="rounded-lg border bg-slate-50/80 p-3 space-y-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-dark">{item.score}</span>
                          <span className="text-sm text-muted-foreground">/ 100 ({item.score}%)</span>
                        </div>

                        {/* Applicable rubric breakdown */}
                        {item.criterionEvaluations && item.criterionEvaluations.length > 0 && (
                          <div className="space-y-2 pt-1 border-t">
                            <p className="text-xs font-semibold text-muted-foreground">
                              Rubric Breakdown:
                            </p>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {item.criterionEvaluations.map((crit, cIdx) => (
                                <div
                                  key={cIdx}
                                  className="rounded border bg-white p-2.5 text-xs space-y-1"
                                >
                                  <div className="flex justify-between items-center font-medium">
                                    <span className="capitalize text-dark">
                                      {crit.competency.replace(/([A-Z])/g, " $1")}
                                    </span>
                                    <span className="font-semibold text-dark">
                                      {crit.score} / 100
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground">{crit.rationale}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 5. Feedback */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        5. Feedback
                      </h4>
                      <div className="rounded-lg border bg-slate-50/80 p-3 text-sm space-y-2">
                        {item.strengths && item.strengths.length > 0 && (
                          <div>
                            <p className="font-semibold text-xs text-emerald-800">What was done well:</p>
                            <ul className="list-disc pl-5 text-xs text-dark space-y-0.5 mt-0.5">
                              {item.strengths.map((str, sIdx) => (
                                <li key={sIdx}>{str}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {item.improvements && item.improvements.length > 0 && (
                          <div>
                            <p className="font-semibold text-xs text-amber-900">What could be improved:</p>
                            <ul className="list-disc pl-5 text-xs text-dark space-y-0.5 mt-0.5">
                              {item.improvements.map((imp, iIdx) => (
                                <li key={iIdx}>{imp}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {item.evidence && item.evidence.length > 0 && (
                          <div>
                            <p className="font-semibold text-xs text-muted-foreground">
                              Verified response snippets:
                            </p>
                            <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-0.5 mt-0.5">
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

          {/* SECTION II: OVERALL RESULTS (Items 6 - 10) */}
          <div className="mt-8 border-t-2 pt-6 space-y-6">
            <h3 className="text-lg font-bold text-dark border-b pb-2">
              Overall Assessment Evaluation
            </h3>

            {/* 6. Overall assessment score */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                6. Overall Assessment Score
              </h4>
              <div className="rounded-xl border bg-slate-50 p-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-dark">{score}</span>
                  <span className="text-base text-muted-foreground">/ 100 ({score}%)</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Mean average across all {evaluatedAnswers.length || 1} evaluated scenario responses.
                </p>
              </div>
            </div>

            {/* 7. Overall feedback */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                7. Overall Feedback
              </h4>
              <div className="rounded-lg border bg-white p-4 text-sm leading-relaxed text-dark">
                {feedback}
              </div>
            </div>

            {/* 8. Strengths */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                8. Strengths
              </h4>
              <div className="rounded-lg border bg-emerald-50/60 border-emerald-200 p-4 text-sm">
                {allStrengths.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-emerald-950">
                    {allStrengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground italic">
                    Demonstrated constructive workplace intent across assessed scenarios.
                  </p>
                )}
              </div>
            </div>

            {/* 9. Areas for improvement */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                9. Areas for Improvement
              </h4>
              <div className="rounded-lg border bg-amber-50/60 border-amber-200 p-4 text-sm">
                {allImprovements.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1 text-amber-950">
                    {allImprovements.map((imp, i) => (
                      <li key={i}>{imp}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground italic">
                    Continue refining clarity and follow-through in high-stakes communication.
                  </p>
                )}
              </div>
            </div>

            {/* 10. Actionable development recommendations */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                10. Actionable Development Recommendations
              </h4>
              <DevelopmentPlan items={result?.recommendations || storedRecommendations || []} />
            </div>
          </div>

          <p className="text-xs text-muted-foreground pt-4">
            Ollama-powered AI practice feedback evaluates against explicit scenario rubrics.
            Scores are designed for learning and reflection, not for employment or hiring decisions.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button onClick={() => router.push("/dashboard")}>Back to dashboard</Button>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard?tab=create_interview")}
            >
              Practise another scenario
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!questions.length) {
    return (
      <Card className="mx-auto mt-8 max-w-3xl">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">No scenarios were found for this assessment.</p>
          <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto mt-8 max-w-3xl shadow-sm">
      <CardHeader>
        <p className="text-sm text-muted-foreground">
          Workplace behaviour assessment · {assessment.type}
        </p>
        <CardTitle>{assessment.name}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Scenario {index + 1} of {questions.length}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl bg-muted p-5 text-lg leading-relaxed font-medium text-dark">
          {questions[index]}
        </div>

        <label htmlFor="response" className="block text-sm font-semibold">
          How would you respond?
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
          placeholder="Explain your approach, who you would involve, and what you would do next."
          className="w-full rounded-md border border-input bg-background p-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        <div className="flex flex-wrap justify-between gap-3 pt-2">
          <Button
            variant="outline"
            disabled={index === 0 || busy}
            onClick={() => setIndex((i) => i - 1)}
          >
            Previous
          </Button>
          {index < questions.length - 1 ? (
            <Button
              disabled={busy || !(answers[index] || "").trim()}
              onClick={() => setIndex((i) => i + 1)}
            >
              Next scenario
            </Button>
          ) : (
            <Button
              disabled={busy || answers.every((a) => !a.trim())}
              onClick={submit}
            >
              {busy ? "Evaluating with Ollama…" : "Complete assessment"}
            </Button>
          )}
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          Your responses are evaluated by a local Ollama model against scenario-specific criteria.
          Ensure Ollama is running with the configured model before submitting.
        </p>
      </CardContent>
    </Card>
  );
}
