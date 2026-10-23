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
    if (!confirm("Are you sure you want to delete this custom scenario? Historical completed assessments will retain their recorded copy.")) {
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
      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm font-medium text-muted-foreground">
            {questions.length} Custom {questions.length === 1 ? "Scenario" : "Scenarios"} Configured
          </span>
        </div>
        <Button onClick={openCreateDialog} className="bg-dark text-white hover:bg-dark/90">
          + Add Custom Scenario
        </Button>
      </div>

      {questions.length === 0 ? (
        <Card className="border border-dashed p-8 text-center bg-white/60">
          <CardHeader>
            <CardTitle>No Custom Scenarios Yet</CardTitle>
            <CardDescription>
              Create your organization&apos;s first custom workplace scenario with its authoritative expected answer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={openCreateDialog} variant="outline">
              Create First Scenario
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {questions.map((q) => (
            <Card key={q.id} className="border bg-white/70 shadow-sm transition hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CardTitle className="text-lg font-bold">{q.title}</CardTitle>
                    <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-900">
                      {q.category}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        q.difficulty === "Easy"
                          ? "bg-green-50 text-green-900 border-green-200"
                          : q.difficulty === "Hard"
                          ? "bg-rose-50 text-rose-900 border-rose-200"
                          : "bg-amber-50 text-amber-900 border-amber-200"
                      }`}
                    >
                      {q.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(q)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      disabled={isDeleting === q.id}
                      onClick={() => handleDelete(q.id)}
                    >
                      {isDeleting === q.id ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div>
                  <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                    Scenario Question Prompt
                  </span>
                  <p className="text-dark bg-slate-50 border p-3 rounded-md">
                    {q.question}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                    Authoritative Expected Answer / Strong Response
                  </span>
                  <p className="text-muted-foreground bg-amber-50/50 border border-amber-200/60 p-3 rounded-md italic">
                    {q.expectedAnswer}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-xs font-semibold text-muted-foreground mr-1">
                    Competencies:
                  </span>
                  {q.competencies.map((comp) => (
                    <span
                      key={comp}
                      className="inline-flex items-center rounded-full bg-slate-100 border px-2 py-0.5 text-xs text-slate-700 font-normal"
                    >
                      {comp}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? "Edit Custom Scenario" : "Create New Workplace Scenario"}
            </DialogTitle>
            <DialogDescription>
              Define the scenario prompt, expected response, and target competencies for AI evaluation.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scenario-title">Scenario Title *</Label>
              <Input
                id="scenario-title"
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                placeholder="e.g. Cross-Functional Deadline Negotiation"
                required
                maxLength={100}
              />
              {formErrors.title && <p className="text-xs text-red-600">{formErrors.title}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="scenario-category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="scenario-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {STANDARD_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formErrors.category && <p className="text-xs text-red-600">{formErrors.category}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="scenario-difficulty">Difficulty Level *</Label>
                <Select
                  value={difficulty}
                  onValueChange={(val) => setDifficulty(val as "Easy" | "Medium" | "Hard")}
                >
                  <SelectTrigger id="scenario-difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formErrors.difficulty && <p className="text-xs text-red-600">{formErrors.difficulty}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scenario-question">Scenario Question Prompt * (10–1000 characters)</Label>
              <textarea
                id="scenario-question"
                rows={4}
                value={questionText}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setQuestionText(e.target.value)}
                placeholder="Describe the realistic workplace challenge or dilemma presented to the participant..."
                required
                minLength={10}
                maxLength={1000}
                className="w-full rounded-md border border-input bg-background p-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-xs text-muted-foreground text-right">
                {questionText.length}/1000
              </span>
              {formErrors.question && <p className="text-xs text-red-600">{formErrors.question}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scenario-expected">
                Authoritative Expected Answer / Strong Response * (10–5000 characters)
              </Label>
              <textarea
                id="scenario-expected"
                rows={5}
                value={expectedAnswer}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setExpectedAnswer(e.target.value)}
                placeholder="Specify the key actions, communication steps, and reasoning a high-performing employee should demonstrate..."
                required
                minLength={10}
                maxLength={5000}
                className="w-full rounded-md border border-input bg-background p-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span className="text-xs text-muted-foreground text-right">
                {expectedAnswer.length}/5000
              </span>
              {formErrors.expectedAnswer && (
                <p className="text-xs text-red-600">{formErrors.expectedAnswer}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Target Competencies Evaluated * (Select at least 1)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COMPETENCY_OPTIONS.map((c) => {
                  const isChecked = selectedCompetencies.includes(c.key);
                  return (
                    <button
                      type="button"
                      key={c.key}
                      onClick={() => toggleCompetency(c.key)}
                      className={`text-left text-xs px-3 py-2 rounded-lg border transition ${
                        isChecked
                          ? "bg-blue-100 border-blue-400 font-semibold text-blue-900"
                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {isChecked ? "✓ " : "+ "} {c.label}
                    </button>
                  );
                })}
              </div>
              {formErrors.competencies && (
                <p className="text-xs text-red-600">{formErrors.competencies}</p>
              )}
            </div>

            {formErrors.general && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{formErrors.general}</p>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Saving…"
                  : editingQuestion
                  ? "Update Scenario"
                  : "Create Scenario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
