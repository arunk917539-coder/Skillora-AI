"use client";

import React, { useActionState, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { handleCreateInterviewFormAction } from "@/app/lib/form-actions";
import { getAvailableCustomQuestions } from "@/app/lib/workplace/hr-questions";
import { toast } from "sonner";
import { Sparkles, Info, ArrowRight, Check, AlertCircle, HelpCircle, Layers } from "lucide-react";
import { useIsHr, useDashboardTab } from "./navigation-bar/dashboard-tabs-controller";

type CustomScenarioSummary = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  question: string;
  competencies: string[];
};

const initialState = {
  success: false,
  errors: {} as Record<string, string>,
  assessmentId: undefined as string | undefined,
};

const CreateInterviewForm = () => {
  const [state, formAction, pending] = useActionState(handleCreateInterviewFormAction, initialState);
  const router = useRouter();
  const isHr = useIsHr();
  const { setActiveTab } = useDashboardTab();
  const [customScenarios, setCustomScenarios] = useState<CustomScenarioSummary[]>([]);
  const [assessmentSource, setAssessmentSource] = useState<"curated" | "hr_questions">("curated");
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [skillFilter, setSkillFilter] = useState<string>("all");
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoadingQuestions(true);
    getAvailableCustomQuestions()
      .then((items) => {
        if (active && items) {
          setCustomScenarios(items);
          if (items.length > 0) {
            setSelectedQuestionIds([items[0].id]);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setIsLoadingQuestions(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (state.success && state.assessmentId) {
      toast.success("Workplace assessment created");
      router.push(`/interview/${state.assessmentId}`);
    } else if (state.errors?.general) {
      toast.error(state.errors.general);
    }
  }, [state, router]);

  const toggleQuestionSelection = (id: string) => {
    setSelectedQuestionIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) {
          toast.info("An assessment requires at least 1 question.");
          return prev;
        }
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 5) {
          toast.warning("You can select up to 5 questions per assessment.");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const filteredQuestions = useMemo(() => {
    if (skillFilter === "all") return customScenarios;
    return customScenarios.filter(
      (q) =>
        q.category.toLowerCase() === skillFilter.toLowerCase() ||
        q.competencies?.some((c) => c.toLowerCase() === skillFilter.toLowerCase())
    );
  }, [customScenarios, skillFilter]);

  return (
    <div className="w-full">
      <Card className="flex w-full flex-col border-none bg-transparent p-0 shadow-none">
        <CardHeader className="mb-6 p-0 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold uppercase tracking-wider text-violet-300 w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            Scenario Builder
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Create a Workplace Assessment
          </CardTitle>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Explore authentic workplace scenarios and reflect on your approach. Evaluation uses your local Ollama model (`qwen3:4b`); no hosted API keys required.
          </p>

          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-950/25 p-3 text-xs text-amber-200/90 leading-relaxed">
            <Info className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <span>
              Skillora AI is an educational learning and practice tool. AI-generated feedback is rubric-based and formative, designed for skill development rather than employment screening.
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <form action={formAction} className="flex flex-col gap-5">
            {/* Assessment Option Selector */}
            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium text-slate-300">Assessment Option</Label>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setAssessmentSource("curated")}
                  className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer ${
                    assessmentSource === "curated"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md shadow-violet-500/20"
                      : "bg-slate-800/80 text-slate-400 border-white/10 hover:text-white"
                  }`}
                >
                  Curated Scenarios
                </button>
                <button
                  type="button"
                  onClick={() => setAssessmentSource("hr_questions")}
                  className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                    assessmentSource === "hr_questions"
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md shadow-violet-500/20"
                      : "bg-slate-800/80 text-slate-400 border-white/10 hover:text-white"
                  }`}
                >
                  <span>HR Questions</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                    {customScenarios.length}
                  </span>
                </button>
              </div>
            </div>

            <input type="hidden" name="assessmentSource" value={assessmentSource} />

            {/* HR Questions Mode */}
            {assessmentSource === "hr_questions" ? (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name" className="text-xs font-medium text-slate-300">
                    Assessment Title
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Leadership & Cross-Functional Alignment"
                    defaultValue="HR Workplace Assessment"
                    minLength={2}
                    maxLength={100}
                    required
                    className="h-11 rounded-xl border border-white/10 bg-slate-900/90 px-4 text-sm text-white placeholder:text-slate-500 focus:border-violet-500"
                  />
                </div>

                {isLoadingQuestions ? (
                  <div className="rounded-xl border border-white/10 bg-slate-900/40 p-6 text-center text-xs text-slate-400">
                    Loading published questions…
                  </div>
                ) : customScenarios.length === 0 ? (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-5 text-xs text-amber-200 space-y-3">
                    <div className="flex items-center gap-2 font-semibold text-amber-300">
                      <AlertCircle className="h-4 w-4" />
                      <span>No Published HR Questions Available</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      There are currently no published questions in the question bank. Please navigate to the{" "}
                      <span className="font-semibold text-white">Manage Questions</span> section in your dashboard to author and publish questions before creating an assessment with HR Questions.
                    </p>
                    {isHr ? (
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            if (setActiveTab) {
                              setActiveTab("hr_questions");
                            } else {
                              router.push("/dashboard?tab=hr_questions");
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-medium text-xs transition-colors cursor-pointer"
                        >
                          Go to Manage Questions
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-[11px] text-amber-300/80">
                        Please contact an authorized HR administrator to author and publish questions.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs font-medium text-slate-300">
                          Select Questions for Assessment
                        </Label>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300">
                          {selectedQuestionIds.length} of 5 selected
                        </span>
                      </div>

                      {/* Skill Filter */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Filter:</span>
                        <Select value={skillFilter} onValueChange={setSkillFilter}>
                          <SelectTrigger className="h-8 text-xs rounded-xl border-white/10 bg-slate-900 text-white min-w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border border-white/10 bg-slate-900 text-white shadow-2xl">
                            <SelectGroup>
                              <SelectItem value="all">All Skills</SelectItem>
                              <SelectItem value="Communication">Communication</SelectItem>
                              <SelectItem value="Teamwork">Teamwork</SelectItem>
                              <SelectItem value="Conflict Resolution">Conflict Resolution</SelectItem>
                              <SelectItem value="Ethical Decision-Making">Ethical Decision-Making</SelectItem>
                              <SelectItem value="Prioritization">Prioritization</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Hidden inputs for selected IDs */}
                    {selectedQuestionIds.map((id) => (
                      <input key={id} type="hidden" name="selectedHrQuestionIds" value={id} />
                    ))}

                    {/* Question Selection Cards */}
                    <div className="grid grid-cols-1 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                      {filteredQuestions.map((q) => {
                        const isSelected = selectedQuestionIds.includes(q.id);
                        return (
                          <div
                            key={q.id}
                            onClick={() => toggleQuestionSelection(q.id)}
                            className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                              isSelected
                                ? "bg-violet-950/40 border-violet-500/50 shadow-sm"
                                : "bg-slate-900/60 border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div
                              className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-violet-600 border-violet-500 text-white"
                                  : "border-white/20 bg-slate-800"
                              }`}
                            >
                              {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                            </div>

                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-white tracking-tight">
                                  {q.title}
                                </span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-violet-500/30 bg-violet-950/40 text-violet-300">
                                    {q.category}
                                  </span>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-slate-800 text-slate-300">
                                    {q.difficulty}
                                  </span>
                                </div>
                              </div>
                              <p className="text-slate-300 line-clamp-2 leading-relaxed">
                                {q.question}
                              </p>
                              {q.competencies && q.competencies.length > 0 && (
                                <div className="flex items-center gap-1.5 pt-0.5">
                                  <span className="text-[10px] text-slate-500">Evaluates:</span>
                                  {q.competencies.map((comp) => (
                                    <span key={comp} className="text-[10px] text-slate-400 font-mono">
                                      #{comp}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Curated Scenarios Mode (Low, Medium, High Categories Preserved) */
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name" className="text-xs font-medium text-slate-300">
                    Assessment Title
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Cross-Functional Alignment & Communication"
                    minLength={2}
                    maxLength={100}
                    required
                    className="h-11 rounded-xl border border-white/10 bg-slate-900/90 px-4 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="type" className="text-xs font-medium text-slate-300">
                    Competency Focus
                  </Label>
                  <Select name="type" required defaultValue="Communication">
                    <SelectTrigger
                      id="type"
                      className="h-11 rounded-xl border border-white/10 bg-slate-900/90 text-sm text-white"
                    >
                      <SelectValue placeholder="Choose a competency" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-white/10 bg-slate-900 text-white shadow-2xl">
                      <SelectGroup>
                        {[
                          "Communication",
                          "Teamwork",
                          "Conflict Resolution",
                          "Ethical Decision-Making",
                          "Prioritization",
                        ].map((item) => (
                          <SelectItem key={item} value={item} className="hover:bg-white/10 focus:bg-white/10">
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="difficultyLevel" className="text-xs font-medium text-slate-300">
                      Scenario Difficulty
                    </Label>
                    <Select name="difficultyLevel" required defaultValue="Medium">
                      <SelectTrigger
                        id="difficultyLevel"
                        className="h-11 rounded-xl border border-white/10 bg-slate-900/90 text-sm text-white"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-white/10 bg-slate-900 text-white shadow-2xl">
                        <SelectGroup>
                          {["Easy", "Medium", "Hard"].map((item) => (
                            <SelectItem key={item} value={item} className="hover:bg-white/10 focus:bg-white/10">
                              {item}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="numberOfQuestions" className="text-xs font-medium text-slate-300">
                      Number of Scenarios
                    </Label>
                    <Select name="numberOfQuestions" required defaultValue="5">
                      <SelectTrigger
                        id="numberOfQuestions"
                        className="h-11 rounded-xl border border-white/10 bg-slate-900/90 text-sm text-white"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-white/10 bg-slate-900 text-white shadow-2xl">
                        <SelectGroup>
                          {["1", "2", "3", "4", "5"].map((item) => (
                            <SelectItem key={item} value={item} className="hover:bg-white/10 focus:bg-white/10">
                              {item} {item === "5" ? "(Standard Comprehensive)" : item === "1" ? "Scenario" : "Scenarios"}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {state.errors?.general && (
              <p role="alert" className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-xl">
                {state.errors.general}
              </p>
            )}

            <button
              type="submit"
              disabled={pending || (assessmentSource === "hr_questions" && customScenarios.length === 0)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <span>{pending ? "Creating assessment…" : "Create Assessment"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-[11px] text-slate-500 pt-1">
              Assessment responses are processed on-premise by our local Ollama AI model. Review our{" "}
              <a href="/privacy" target="_blank" className="text-violet-400 hover:underline">
                Privacy Policy
              </a>.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateInterviewForm;
