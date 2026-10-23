"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { toast } from "sonner";
import {
  createHrQuestionAction,
  updateHrQuestionAction,
  deleteHrQuestionAction,
} from "@/app/lib/workplace/hr-questions";
import { Plus, Edit2, Trash2, Check, Sparkles } from "lucide-react";

const COMPETENCY_OPTIONS = [
  { key: "communication", label: "Communication" },
  { key: "problemSolving", label: "Problem Solving" },
  { key: "collaboration", label: "Collaboration" },
  { key: "accountability", label: "Accountability" },
  { key: "planning", label: "Planning" },
] as const;

const STANDARD_CATEGORIES = [
  "Communication",
  "Teamwork",
  "Conflict Resolution",
  "Ethical Decision-Making",
  "Prioritization",
];

type HrQuestionItem = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  question: string;
  expectedAnswer: string;
  competencies: string[];
  createdAt: Date | string;
};

export default function HrQuestionsClient({
  initialQuestions,
}: {
  initialQuestions: HrQuestionItem[];
}) {
  const [questions, setQuestions] = useState<HrQuestionItem[]>(initialQuestions);
  const [isOpen, setIsOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<HrQuestionItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Communication");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [questionText, setQuestionText] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState("");
  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([
    "communication",
    "problemSolving",
  ]);

  const openCreateDialog = () => {
    setEditingQuestion(null);
    setTitle("");
    setCategory("Communication");
    setDifficulty("Medium");
    setQuestionText("");
    setExpectedAnswer("");
    setSelectedCompetencies(["communication", "problemSolving"]);
    setFormErrors({});
    setIsOpen(true);
  };

  const openEditDialog = (item: HrQuestionItem) => {
    setEditingQuestion(item);
    setTitle(item.title);
    setCategory(item.category);
    setDifficulty((item.difficulty as "Easy" | "Medium" | "Hard") || "Medium");
    setQuestionText(item.question);
    setExpectedAnswer(item.expectedAnswer);
    setSelectedCompetencies(
      Array.isArray(item.competencies) && item.competencies.length > 0
        ? item.competencies
        : ["communication"]
    );
    setFormErrors({});
    setIsOpen(true);
  };

  const toggleCompetency = (key: string) => {
    setSelectedCompetencies((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("difficulty", difficulty);
    formData.append("question", questionText);
    formData.append("expectedAnswer", expectedAnswer);
    for (const comp of selectedCompetencies) {
      formData.append("competencies", comp);
    }

    try {
      if (editingQuestion) {
        const result = await updateHrQuestionAction(editingQuestion.id, { success: false }, formData);
        if (result.success) {
          toast.success(result.message || "Custom question updated.");
          setQuestions((prev) =>
            prev.map((q) =>
              q.id === editingQuestion.id
                ? {
                    ...q,
                    title,
                    category,
                    difficulty,
                    question: questionText,
                    expectedAnswer,
                    competencies: selectedCompetencies,
                  }
                : q
            )
          );
          setIsOpen(false);
        } else if (result.errors) {
          setFormErrors(result.errors);
          if (result.errors.general) toast.error(result.errors.general);
        }
      } else {
        const result = await createHrQuestionAction({ success: false }, formData);
        if (result.success && result.questionId) {
          toast.success(result.message || "Custom question created.");
          const newQ: HrQuestionItem = {
            id: result.questionId,
            title,
            category,
            difficulty,
            question: questionText,
            expectedAnswer,
            competencies: selectedCompetencies,
            createdAt: new Date().toISOString(),
          };
          setQuestions((prev) => [newQ, ...prev]);
          setIsOpen(false);
        } else if (result.errors) {
          setFormErrors(result.errors);
          if (result.errors.general) toast.error(result.errors.general);
        }
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this custom scenario? Historical completed assessments will retain their recorded copy."
      )
    ) {
      return;
    }
    setIsDeleting(id);
    try {
      const res = await deleteHrQuestionAction(id);
      if (res.success) {
        toast.success("Scenario question deleted.");
        setQuestions((prev) => prev.filter((q) => q.id !== id));
      } else {
        toast.error(res.error || "Failed to delete question.");
      }
    } catch {
      toast.error("An error occurred while deleting.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-medium text-slate-400">
            {questions.length} Custom {questions.length === 1 ? "Scenario" : "Scenarios"} Configured
          </span>
        </div>
        <button
          onClick={openCreateDialog}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-500/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Scenario</span>
        </button>
      </div>

      {questions.length === 0 ? (
        <Card className="rounded-3xl border border-dashed border-white/10 bg-slate-900/60 p-8 sm:p-12 text-center backdrop-blur-md">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg font-bold text-white">No Custom Scenarios Yet</CardTitle>
            <CardDescription className="text-xs text-slate-400 max-w-md mx-auto">
              Create your organization&apos;s first custom workplace scenario with its authoritative expected answer criteria.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <Button
              onClick={openCreateDialog}
              variant="outline"
              className="border-white/10 text-xs text-white hover:bg-white/5"
            >
              Create First Scenario
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {questions.map((q) => (
            <Card
              key={q.id}
              className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 backdrop-blur-md shadow-lg transition hover:border-white/20"
            >
              <CardHeader className="p-0 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <CardTitle className="text-base font-bold text-white">{q.title}</CardTitle>
                    <span className="inline-flex items-center rounded-full border border-violet-500/30 bg-violet-950/40 px-2.5 py-0.5 text-xs font-medium text-violet-300">
                      {q.category}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        q.difficulty === "Easy"
                          ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/30"
                          : q.difficulty === "Hard"
                          ? "bg-rose-950/60 text-rose-300 border-rose-500/30"
                          : "bg-amber-950/60 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditDialog(q)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      disabled={isDeleting === q.id}
                      onClick={() => handleDelete(q.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-rose-800/40 bg-rose-950/30 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-900/40 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>{isDeleting === q.id ? "Deleting…" : "Delete"}</span>
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col gap-3 text-xs">
                <div>
                  <span className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                    Scenario Question Prompt
                  </span>
                  <p className="text-slate-200 bg-slate-800/60 border border-white/5 p-3.5 rounded-xl leading-relaxed">
                    {q.question}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-[10px] text-amber-400 uppercase tracking-wider block mb-1">
                    Authoritative Expected Answer / Strong Response Criteria
                  </span>
                  <p className="text-amber-200/90 bg-amber-950/20 border border-amber-500/25 p-3.5 rounded-xl italic leading-relaxed">
                    {q.expectedAnswer}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-white/5">
                  <span className="text-[11px] font-medium text-slate-400 mr-1">
                    Target Competencies:
                  </span>
                  {q.competencies.map((comp) => (
                    <span
                      key={comp}
                      className="inline-flex items-center rounded-full bg-slate-800/80 border border-white/10 px-2.5 py-0.5 text-[11px] text-slate-300 capitalize"
                    >
                      {comp.replace(/([A-Z])/g, " $1")}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-slate-900/95 p-6 backdrop-blur-xl text-white shadow-2xl">
          <DialogHeader className="border-b border-white/10 pb-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              Scenario Authoring
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight text-white">
              {editingQuestion ? "Edit Custom Scenario" : "Create New Workplace Scenario"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Define the scenario prompt, authoritative rubric response, and target competencies for local Ollama evaluation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scenario-title" className="text-xs font-medium text-slate-300">
                Scenario Title *
              </Label>
              <Input
                id="scenario-title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="e.g. Cross-Functional Deadline Negotiation"
                required
                maxLength={100}
                className="h-10 rounded-xl border border-white/10 bg-slate-800/80 text-sm text-white placeholder:text-slate-500"
              />
              {formErrors.title && <p className="text-xs text-rose-400">{formErrors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="scenario-category" className="text-xs font-medium text-slate-300">
                  Category *
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="scenario-category" className="h-10 rounded-xl border border-white/10 bg-slate-800/80 text-sm text-white">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-white/10 bg-slate-900 text-white shadow-2xl">
                    <SelectGroup>
                      {STANDARD_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="hover:bg-white/10 focus:bg-white/10">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formErrors.category && <p className="text-xs text-rose-400">{formErrors.category}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="scenario-difficulty" className="text-xs font-medium text-slate-300">
                  Difficulty Level *
                </Label>
                <Select
                  value={difficulty}
                  onValueChange={(val) => setDifficulty(val as "Easy" | "Medium" | "Hard")}
                >
                  <SelectTrigger id="scenario-difficulty" className="h-10 rounded-xl border border-white/10 bg-slate-800/80 text-sm text-white">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-white/10 bg-slate-900 text-white shadow-2xl">
                    <SelectGroup>
                      <SelectItem value="Easy" className="hover:bg-white/10 focus:bg-white/10">Easy</SelectItem>
                      <SelectItem value="Medium" className="hover:bg-white/10 focus:bg-white/10">Medium</SelectItem>
                      <SelectItem value="Hard" className="hover:bg-white/10 focus:bg-white/10">Hard</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formErrors.difficulty && <p className="text-xs text-rose-400">{formErrors.difficulty}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scenario-question" className="text-xs font-medium text-slate-300">
                Scenario Question Prompt * (10–1000 characters)
              </Label>
              <textarea
                id="scenario-question"
                rows={4}
                value={questionText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestionText(e.target.value)}
                placeholder="Describe the authentic workplace challenge or dilemma presented to the participant..."
                required
                minLength={10}
                maxLength={1000}
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 leading-relaxed"
              />
              <span className="text-[10px] text-slate-500 text-right">
                {questionText.length}/1000
              </span>
              {formErrors.question && <p className="text-xs text-rose-400">{formErrors.question}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scenario-expected" className="text-xs font-medium text-slate-300">
                Authoritative Expected Answer / Strong Response Criteria * (10–5000 characters)
              </Label>
              <textarea
                id="scenario-expected"
                rows={5}
                value={expectedAnswer}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setExpectedAnswer(e.target.value)}
                placeholder="Specify the key actions, stakeholder communication, and reasoning a high-performing employee should demonstrate..."
                required
                minLength={10}
                maxLength={5000}
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-3 text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 leading-relaxed font-mono"
              />
              <span className="text-[10px] text-slate-500 text-right">
                {expectedAnswer.length}/5000
              </span>
              {formErrors.expectedAnswer && (
                <p className="text-xs text-rose-400">{formErrors.expectedAnswer}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-xs font-medium text-slate-300">
                Target Competencies Evaluated * (Select at least 1)
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COMPETENCY_OPTIONS.map((c) => {
                  const isChecked = selectedCompetencies.includes(c.key);
                  return (
                    <button
                      type="button"
                      key={c.key}
                      onClick={() => toggleCompetency(c.key)}
                      className={`text-left text-xs px-3 py-2 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? "bg-violet-950/60 border-violet-500/50 font-semibold text-violet-200 shadow-sm"
                          : "bg-slate-800/60 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span>{c.label}</span>
                      {isChecked && <Check className="h-3 w-3 text-violet-400" />}
                    </button>
                  );
                })}
              </div>
              {formErrors.competencies && (
                <p className="text-xs text-rose-400">{formErrors.competencies}</p>
              )}
            </div>

            {formErrors.general && (
              <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-xl">
                {formErrors.general}
              </p>
            )}

            <DialogFooter className="pt-3 border-t border-white/5 flex gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-full border border-white/10 bg-slate-800 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-semibold text-white shadow-md shadow-violet-500/25 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting
                  ? "Saving…"
                  : editingQuestion
                  ? "Update Scenario"
                  : "Create Scenario"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
