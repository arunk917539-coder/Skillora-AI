"use client";

import React, { useActionState, useEffect, useState } from "react";
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
import { Button } from "../ui/button";
import { handleCreateInterviewFormAction } from "@/app/lib/form-actions";
import { getAvailableCustomQuestions } from "@/app/lib/workplace/hr-questions";
import { toast } from "sonner";
import { Sparkles, Info, ArrowRight } from "lucide-react";

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
  const [customScenarios, setCustomScenarios] = useState<CustomScenarioSummary[]>([]);
  const [assessmentSource, setAssessmentSource] = useState<"curated" | "custom">("curated");
  const [selectedCustomId, setSelectedCustomId] = useState<string>("");

  useEffect(() => {
    let active = true;
    getAvailableCustomQuestions()
      .then((items) => {
        if (active && items && items.length > 0) {
          setCustomScenarios(items);
          setSelectedCustomId(items[0].id);
        }
      })
      .catch(() => {});
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
            {customScenarios.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium text-slate-300">Assessment Source</Label>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAssessmentSource("curated")}
                    className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all ${
                      assessmentSource === "curated"
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md shadow-violet-500/20"
                        : "bg-slate-800/80 text-slate-400 border-white/10 hover:text-white"
                    }`}
                  >
                    Curated Scenarios
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssessmentSource("custom")}
                    className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all ${
                      assessmentSource === "custom"
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md shadow-violet-500/20"
                        : "bg-slate-800/80 text-slate-400 border-white/10 hover:text-white"
                    }`}
                  >
                    HR Custom Scenarios ({customScenarios.length})
                  </button>
                </div>
              </div>
            )}

            {assessmentSource === "custom" && customScenarios.length > 0 ? (
              <>
                <input type="hidden" name="customQuestionId" value={selectedCustomId} />
                <div className="flex flex-col gap-2">
                  <Label htmlFor="customQuestionSelect" className="text-xs font-medium text-slate-300">
                    Select Custom Scenario
                  </Label>
                  <Select value={selectedCustomId} onValueChange={setSelectedCustomId}>
                    <SelectTrigger
                      id="customQuestionSelect"
                      className="h-11 rounded-xl border border-white/10 bg-slate-900/90 text-sm text-white"
                    >
                      <SelectValue placeholder="Choose a scenario" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-white/10 bg-slate-900 text-white shadow-2xl">
                      <SelectGroup>
                        {customScenarios.map((item) => (
                          <SelectItem key={item.id} value={item.id} className="hover:bg-white/10 focus:bg-white/10">
                            {item.title} ({item.category} • {item.difficulty})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {customScenarios.find((x) => x.id === selectedCustomId) && (
                  <div className="rounded-xl border border-white/10 bg-slate-800/50 p-4 text-xs space-y-1">
                    <span className="font-semibold text-[10px] text-violet-400 uppercase tracking-wider block">
                      Scenario Preview:
                    </span>
                    <p className="text-slate-200 leading-relaxed">
                      {customScenarios.find((x) => x.id === selectedCustomId)?.question}
                    </p>
                  </div>
                )}
              </>
            ) : (
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
                    <Select name="numberOfQuestions" required defaultValue="3">
                      <SelectTrigger
                        id="numberOfQuestions"
                        className="h-11 rounded-xl border border-white/10 bg-slate-900/90 text-sm text-white"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-white/10 bg-slate-900 text-white shadow-2xl">
                        <SelectGroup>
                          {["1", "2", "3"].map((item) => (
                            <SelectItem key={item} value={item} className="hover:bg-white/10 focus:bg-white/10">
                              {item}
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
              disabled={pending}
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
