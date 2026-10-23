"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { handleCreateInterviewFormAction } from "@/app/lib/form-actions";
import { getAvailableCustomQuestions } from "@/app/lib/workplace/hr-questions";
import { toast } from "sonner";

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
    <div className="relative w-full overflow-hidden">
      <Card className="flex w-full max-w-4xl flex-col border-none bg-transparent p-4 shadow-none">
        <CardHeader className="mb-4 p-0">
          <CardTitle className="text-center text-xl md:text-left md:text-2xl">
            Create a workplace behaviour assessment
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Explore realistic scenarios and reflect on your approach. Evaluation uses your local Ollama model; no hosted AI API key is required.
          </p>
          <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            Workplace Compass is a practice and learning tool. Its AI-generated feedback may be imperfect and is not a validated HR assessment. Do not use scores to make employment decisions.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <form action={formAction} className="flex flex-col gap-5">
            {customScenarios.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label>Assessment Source</Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setAssessmentSource("curated")}
                    className={`px-4 py-2 text-sm rounded-lg border transition ${
                      assessmentSource === "curated"
                        ? "bg-dark text-white border-dark font-medium"
                        : "bg-white text-dark border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Curated Scenarios
                  </button>
                  <button
                    type="button"
                    onClick={() => setAssessmentSource("custom")}
                    className={`px-4 py-2 text-sm rounded-lg border transition ${
                      assessmentSource === "custom"
                        ? "bg-dark text-white border-dark font-medium"
                        : "bg-white text-dark border-gray-300 hover:bg-gray-50"
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
                  <Label htmlFor="customQuestionSelect">Select Custom Scenario</Label>
                  <Select
                    value={selectedCustomId}
                    onValueChange={setSelectedCustomId}
                  >
                    <SelectTrigger id="customQuestionSelect">
                      <SelectValue placeholder="Choose a scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {customScenarios.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.title} ({item.category} • {item.difficulty})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {customScenarios.find((x) => x.id === selectedCustomId) && (
                  <div className="rounded-lg border bg-slate-50 p-3 text-sm">
                    <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                      Scenario Preview:
                    </span>
                    <p className="text-dark">
                      {customScenarios.find((x) => x.id === selectedCustomId)?.question}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Assessment title</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Teamwork and communication"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="type">Competency focus</Label>
                  <Select name="type" required defaultValue="Communication">
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Choose a competency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {[
                          "Communication",
                          "Teamwork",
                          "Conflict Resolution",
                          "Ethical Decision-Making",
                          "Prioritization",
                        ].map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="difficultyLevel">Scenario difficulty</Label>
                    <Select name="difficultyLevel" required defaultValue="Medium">
                      <SelectTrigger id="difficultyLevel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {["Easy", "Medium", "Hard"].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="numberOfQuestions">Number of scenarios</Label>
                    <Select name="numberOfQuestions" required defaultValue="3">
                      <SelectTrigger id="numberOfQuestions">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {["1", "2", "3"].map((item) => (
                            <SelectItem key={item} value={item}>
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
              <p role="alert" className="text-sm text-red-600">
                {state.errors.general}
              </p>
            )}
            <Button type="submit" disabled={pending} className="w-full md:w-auto">
              {pending ? "Creating assessment…" : "Create assessment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateInterviewForm;
