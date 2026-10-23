"use client";

import React, { useState, useMemo } from "react";
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
  archiveHrQuestionAction,
  publishHrQuestionAction,
  unpublishHrQuestionAction,
  type QuestionStatus,
} from "@/app/lib/workplace/hr-questions";
import { parseHrScenarioCriteria, serializeHrScenarioCriteria } from "@/app/lib/workplace/hr-criteria";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  Sparkles,
  Archive,
  ArchiveRestore,
  Layers,
  Search,
  CheckCircle2,
  FileText,
  Calendar,
} from "lucide-react";

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
  const [isArchiving, setIsArchiving] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "archived">("all");
  const [competencyFilter, setCompetencyFilter] = useState<string>("all");

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Communication");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [questionText, setQuestionText] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState("");
  const [contextInstructions, setContextInstructions] = useState("");
  const [requiredConceptsText, setRequiredConceptsText] = useState("");
  const [acceptableAlternativesText, setAcceptableAlternativesText] = useState("");
  const [criticalErrorsText, setCriticalErrorsText] = useState("");
  const [scoringGuidance, setScoringGuidance] = useState("");
  const [formStatus, setFormStatus] = useState<QuestionStatus>("published");
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
    setContextInstructions("");
    setRequiredConceptsText("");
    setAcceptableAlternativesText("");
    setCriticalErrorsText("");
    setScoringGuidance("");
    setFormStatus("published");
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

    const criteria = parseHrScenarioCriteria(item.expectedAnswer);
    setExpectedAnswer(criteria.expectedAnswer);
    setContextInstructions(criteria.contextInstructions || "");
    setRequiredConceptsText(criteria.requiredConcepts.join("\n"));
    setAcceptableAlternativesText(criteria.acceptableAlternatives.join("\n"));
    setCriticalErrorsText(criteria.criticalErrors.join("\n"));
    setScoringGuidance(criteria.scoringGuidance || "");
    setFormStatus(criteria.status || (criteria.isArchived ? "archived" : "published"));

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
    formData.append("status", formStatus);
    formData.append("contextInstructions", contextInstructions);
    formData.append("requiredConcepts", requiredConceptsText);
    formData.append("acceptableAlternatives", acceptableAlternativesText);
    formData.append("criticalErrors", criticalErrorsText);
    formData.append("scoringGuidance", scoringGuidance);
    for (const comp of selectedCompetencies) {
      formData.append("competencies", comp);
    }

    try {
      if (editingQuestion) {
        const result = await updateHrQuestionAction(editingQuestion.id, { success: false }, formData);
        if (result.success) {
          toast.success(result.message || "Question updated successfully.");
          const prevCriteria = parseHrScenarioCriteria(editingQuestion.expectedAnswer);
          const isArchived = formStatus === "archived";
          const updatedEnvelope = serializeHrScenarioCriteria({
            version: (prevCriteria.version || 1) + 1,
            expectedAnswer,
            contextInstructions: contextInstructions || undefined,
            requiredConcepts: requiredConceptsText.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),
            acceptableAlternatives: acceptableAlternativesText.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),
            criticalErrors: criticalErrorsText.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),
            scoringGuidance: scoringGuidance || undefined,
            isArchived,
            status: formStatus,
            competencies: selectedCompetencies,
          });

          setQuestions((prev) =>
            prev.map((q) =>
              q.id === editingQuestion.id
                ? {
                    ...q,
                    title,
                    category,
                    difficulty,
                    question: questionText,
                    expectedAnswer: updatedEnvelope,
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
          toast.success(result.message || "Question created successfully.");
          const isArchived = formStatus === "archived";
          const newEnvelope = serializeHrScenarioCriteria({
            version: 1,
            expectedAnswer,
            contextInstructions: contextInstructions || undefined,
            requiredConcepts: requiredConceptsText.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),
            acceptableAlternatives: acceptableAlternativesText.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),
            criticalErrors: criticalErrorsText.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),
            scoringGuidance: scoringGuidance || undefined,
            isArchived,
            status: formStatus,
            competencies: selectedCompetencies,
          });
          const newQ: HrQuestionItem = {
            id: result.questionId,
            title,
            category,
            difficulty,
            question: questionText,
            expectedAnswer: newEnvelope,
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

  const handlePublishToggle = async (id: string, currentStatus: QuestionStatus) => {
    setIsPublishing(id);
    try {
      if (currentStatus === "published") {
        const res = await unpublishHrQuestionAction(id);
        if (res.success) {
          toast.success("Question unpublished (now in Draft).");
          setQuestions((prev) =>
            prev.map((q) => {
              if (q.id !== id) return q;
              const criteria = parseHrScenarioCriteria(q.expectedAnswer);
              return {
                ...q,
                expectedAnswer: serializeHrScenarioCriteria({
                  ...criteria,
                  status: "draft",
                }),
              };
            })
          );
        } else {
          toast.error(res.error || "Failed to unpublish question.");
        }
      } else {
        const res = await publishHrQuestionAction(id);
        if (res.success) {
          toast.success("Question published (ready for assignments).");
          setQuestions((prev) =>
            prev.map((q) => {
              if (q.id !== id) return q;
              const criteria = parseHrScenarioCriteria(q.expectedAnswer);
              return {
                ...q,
                expectedAnswer: serializeHrScenarioCriteria({
                  ...criteria,
                  status: "published",
                  isArchived: false,
                }),
              };
            })
          );
        } else {
          toast.error(res.error || "Failed to publish question.");
        }
      }
    } catch {
      toast.error("An error occurred while changing publication status.");
    } finally {
      setIsPublishing(null);
    }
  };

  const handleArchiveToggle = async (id: string) => {
    setIsArchiving(id);
    try {
      const res = await archiveHrQuestionAction(id);
      if (res.success) {
        toast.success(res.isArchived ? "Question archived." : "Question unarchived.");
        setQuestions((prev) =>
          prev.map((q) => {
            if (q.id !== id) return q;
            const criteria = parseHrScenarioCriteria(q.expectedAnswer);
            return {
              ...q,
              expectedAnswer: serializeHrScenarioCriteria({
                ...criteria,
                isArchived: Boolean(res.isArchived),
                status: res.isArchived ? "archived" : "published",
              }),
            };
          })
        );
      } else {
        toast.error(res.error || "Failed to update archive status.");
      }
    } catch {
      toast.error("An error occurred while archiving.");
    } finally {
      setIsArchiving(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this question? If it was used in past assessments, it will be safely archived to preserve historical audit records."
      )
    ) {
      return;
    }
    setIsDeleting(id);
    try {
      const res = await deleteHrQuestionAction(id);
      if (res.success) {
        toast.success("Question removed.");
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

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const criteria = parseHrScenarioCriteria(q.expectedAnswer);
      const effectiveStatus: QuestionStatus = criteria.status || (criteria.isArchived ? "archived" : "published");

      // Status filter
      if (statusFilter !== "all" && effectiveStatus !== statusFilter) {
        return false;
      }

      // Competency filter
      if (competencyFilter !== "all") {
        if (!q.competencies || !q.competencies.includes(competencyFilter)) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesCategory = q.category.toLowerCase().includes(query);
        const matchesPrompt = q.question.toLowerCase().includes(query);
        const matchesAnswer = criteria.expectedAnswer.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCategory && !matchesPrompt && !matchesAnswer) {
          return false;
        }
      }

      return true;
    });
  }, [questions, searchQuery, statusFilter, competencyFilter]);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Add Question button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-medium text-slate-400">
            {questions.length} Total {questions.length === 1 ? "Question" : "Questions"} in Bank
          </span>
        </div>
        <button
          onClick={openCreateDialog}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-500/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Create Question</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, prompt, or answer…"
            className="pl-9 h-9 text-xs rounded-xl border-white/10 bg-slate-950/70 text-white placeholder:text-slate-500"
          />
        </div>

        {/* Publication Status Filter */}
        <div>
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val as "all" | "published" | "draft" | "archived")}
          >
            <SelectTrigger className="h-9 text-xs rounded-xl border-white/10 bg-slate-950/70 text-white">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-white/10 bg-slate-900 text-white shadow-2xl">
              <SelectGroup>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="published">Published (Ready for assignment)</SelectItem>
                <SelectItem value="draft">Draft (Unpublished)</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Competency Filter */}
        <div>
          <Select
            value={competencyFilter}
            onValueChange={setCompetencyFilter}
          >
            <SelectTrigger className="h-9 text-xs rounded-xl border-white/10 bg-slate-950/70 text-white">
              <SelectValue placeholder="All Competencies" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-white/10 bg-slate-900 text-white shadow-2xl">
              <SelectGroup>
                <SelectItem value="all">All Competencies</SelectItem>
                {COMPETENCY_OPTIONS.map((c) => (
                  <SelectItem key={c.key} value={c.key}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Question List */}
      {questions.length === 0 ? (
        <Card className="rounded-3xl border border-dashed border-white/10 bg-slate-900/60 p-8 sm:p-12 text-center backdrop-blur-md">
          <CardHeader className="p-0 space-y-2">
            <CardTitle className="text-lg font-bold text-white">No HR Questions in Bank</CardTitle>
            <CardDescription className="text-xs text-slate-400 max-w-md mx-auto">
              Create your organization&apos;s first reusable workplace question with reference answers, rubrics, and required concepts.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <Button
              onClick={openCreateDialog}
              variant="outline"
              className="border-white/10 text-xs text-white hover:bg-white/5"
            >
              Create First Question
            </Button>
          </CardContent>
        </Card>
      ) : filteredQuestions.length === 0 ? (
        <Card className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center backdrop-blur-md">
          <p className="text-xs text-slate-400">
            No questions match your current search or filter criteria.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setCompetencyFilter("all");
            }}
            variant="ghost"
            className="mt-3 text-xs text-violet-400 hover:text-violet-300"
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredQuestions.map((q) => {
            const criteria = parseHrScenarioCriteria(q.expectedAnswer);
            const status: QuestionStatus = criteria.status || (criteria.isArchived ? "archived" : "published");

            return (
              <Card
                key={q.id}
                className={`rounded-2xl border bg-slate-900/70 p-6 backdrop-blur-md shadow-lg transition hover:border-white/20 ${
                  status === "archived"
                    ? "border-slate-800 opacity-60"
                    : status === "draft"
                    ? "border-amber-500/20"
                    : "border-white/10"
                }`}
              >
                <CardHeader className="p-0 pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <CardTitle className="text-base font-bold text-white">{q.title}</CardTitle>
                      
                      {/* Publication Status Badge */}
                      {status === "published" ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          Published
                        </span>
                      ) : status === "draft" ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-950/40 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                          <FileText className="h-3 w-3" />
                          Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400">
                          <Archive className="h-3 w-3" />
                          Archived
                        </span>
                      )}

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
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                        <Layers className="h-3 w-3 text-slate-400" />
                        v{criteria.version || 1}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                        <Calendar className="h-3 w-3" />
                        {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Publish / Unpublish Toggle */}
                      {status !== "archived" && (
                        <button
                          disabled={isPublishing === q.id}
                          onClick={() => handlePublishToggle(q.id, status)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                            status === "published"
                              ? "border-amber-500/30 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40"
                              : "border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40"
                          }`}
                          title={status === "published" ? "Unpublish to Draft" : "Publish Question"}
                        >
                          {status === "published" ? (
                            <>
                              <FileText className="h-3 w-3" />
                              <span>Unpublish</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Publish</span>
                            </>
                          )}
                        </button>
                      )}

                      {/* Archive Toggle */}
                      <button
                        disabled={isArchiving === q.id}
                        onClick={() => handleArchiveToggle(q.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                        title={status === "archived" ? "Unarchive Question" : "Archive Question"}
                      >
                        {status === "archived" ? (
                          <>
                            <ArchiveRestore className="h-3 w-3 text-amber-300" />
                            <span>Unarchive</span>
                          </>
                        ) : (
                          <>
                            <Archive className="h-3 w-3 text-slate-400" />
                            <span>Archive</span>
                          </>
                        )}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => openEditDialog(q)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                        <span>Edit</span>
                      </button>

                      {/* Delete */}
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
                      Question Prompt
                    </span>
                    <p className="text-slate-200 bg-slate-800/60 border border-white/5 p-3.5 rounded-xl leading-relaxed">
                      {q.question}
                    </p>
                  </div>

                  {criteria.contextInstructions && (
                    <div>
                      <span className="font-semibold text-[10px] text-indigo-400 uppercase tracking-wider block mb-1">
                        Context & Instructions
                      </span>
                      <p className="text-slate-300 bg-indigo-950/20 border border-indigo-500/20 p-3 rounded-xl leading-relaxed text-xs">
                        {criteria.contextInstructions}
                      </p>
                    </div>
                  )}

                  <div>
                    <span className="font-semibold text-[10px] text-violet-300 uppercase tracking-wider block mb-1">
                      Authoritative Reference Answer / Strong Response
                    </span>
                    <p className="text-violet-200/90 bg-violet-950/20 border border-violet-500/25 p-3.5 rounded-xl italic leading-relaxed">
                      {criteria.expectedAnswer}
                    </p>
                  </div>

                  {criteria.requiredConcepts && criteria.requiredConcepts.length > 0 && (
                    <div>
                      <span className="font-semibold text-[10px] text-emerald-400 uppercase tracking-wider block mb-1">
                        Essential Required Concepts:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {criteria.requiredConcepts.map((concept, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-lg bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 text-[11px] text-emerald-300"
                          >
                            ✓ {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {criteria.acceptableAlternatives && criteria.acceptableAlternatives.length > 0 && (
                    <div>
                      <span className="font-semibold text-[10px] text-sky-400 uppercase tracking-wider block mb-1">
                        Acceptable Alternative Approaches:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {criteria.acceptableAlternatives.map((alt, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-lg bg-sky-950/40 border border-sky-500/30 px-2.5 py-1 text-[11px] text-sky-300"
                          >
                            ↔ {alt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {criteria.criticalErrors && criteria.criticalErrors.length > 0 && (
                    <div>
                      <span className="font-semibold text-[10px] text-rose-400 uppercase tracking-wider block mb-1">
                        Critical Errors (Penalized if Present):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {criteria.criticalErrors.map((err, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center rounded-lg bg-rose-950/40 border border-rose-500/30 px-2.5 py-1 text-[11px] text-rose-300"
                          >
                            ✕ {err}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Competency badges */}
                  <div>
                    <span className="font-semibold text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Target Competencies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {q.competencies?.map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center rounded-lg bg-slate-800/80 border border-white/10 px-2.5 py-0.5 text-[11px] text-slate-300"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 bg-slate-900 text-white shadow-2xl rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-white">
              <Sparkles className="h-4 w-4 text-violet-400" />
              {editingQuestion ? "Edit HR Question" : "Create HR Question"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Configure question prompts, authoritative expected answers, required concepts, and evaluated competencies.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scenario-title" className="text-xs font-medium text-slate-300">
                Question Title *
              </Label>
              <Input
                id="scenario-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cross-Functional Requirement Ambiguity"
                required
                className="h-9 text-xs rounded-xl border-white/10 bg-slate-950 text-white"
              />
              {formErrors.title && <p className="text-xs text-rose-400">{formErrors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="scenario-category" className="text-xs font-medium text-slate-300">
                  Category *
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="scenario-category" className="h-9 text-xs rounded-xl border-white/10 bg-slate-950 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-white/10 bg-slate-900 text-white shadow-2xl">
                    <SelectGroup>
                      {STANDARD_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
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
                  Difficulty *
                </Label>
                <Select
                  value={difficulty}
                  onValueChange={(val) => setDifficulty(val as "Easy" | "Medium" | "Hard")}
                >
                  <SelectTrigger id="scenario-difficulty" className="h-9 text-xs rounded-xl border-white/10 bg-slate-950 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-white/10 bg-slate-900 text-white shadow-2xl">
                    <SelectGroup>
                      {["Easy", "Medium", "Hard"].map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {formErrors.difficulty && <p className="text-xs text-rose-400">{formErrors.difficulty}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="scenario-status" className="text-xs font-medium text-slate-300">
                  Initial Status *
                </Label>
                <Select
                  value={formStatus}
                  onValueChange={(val) => setFormStatus(val as QuestionStatus)}
                >
                  <SelectTrigger id="scenario-status" className="h-9 text-xs rounded-xl border-white/10 bg-slate-950 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border border-white/10 bg-slate-900 text-white shadow-2xl">
                    <SelectGroup>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft (Unpublished)</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scenario-question" className="text-xs font-medium text-slate-300">
                Workplace Situation / Question Prompt *
              </Label>
              <textarea
                id="scenario-question"
                rows={3}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Describe the workplace situation and what response you require from the candidate…"
                required
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-violet-500"
              />
              {formErrors.question && <p className="text-xs text-rose-400">{formErrors.question}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scenario-expected" className="text-xs font-medium text-violet-300">
                Authoritative Reference Answer / Strong Response *
              </Label>
              <textarea
                id="scenario-expected"
                rows={4}
                value={expectedAnswer}
                onChange={(e) => setExpectedAnswer(e.target.value)}
                placeholder="Write the comprehensive, model response that satisfies the evaluation criteria…"
                required
                className="w-full rounded-xl border border-violet-500/30 bg-slate-950 p-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-violet-500"
              />
              {formErrors.expectedAnswer && (
                <p className="text-xs text-rose-400">{formErrors.expectedAnswer}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scenario-context" className="text-xs font-medium text-indigo-300">
                Context & Evaluation Instructions (Optional)
              </Label>
              <Input
                id="scenario-context"
                value={contextInstructions}
                onChange={(e) => setContextInstructions(e.target.value)}
                placeholder="e.g. Candidate is an Engineering Manager speaking to a Business Partner"
                className="h-9 text-xs rounded-xl border-white/10 bg-slate-950 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="scenario-required" className="text-xs font-medium text-emerald-400">
                  Required Concepts (1 per line or comma-separated)
                </Label>
                <textarea
                  id="scenario-required"
                  rows={3}
                  value={requiredConceptsText}
                  onChange={(e) => setRequiredConceptsText(e.target.value)}
                  placeholder="e.g.&#10;Early stakeholder notification&#10;Mitigation timeline"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="scenario-alternatives" className="text-xs font-medium text-sky-400">
                  Acceptable Alternatives (1 per line or comma-separated)
                </Label>
                <textarea
                  id="scenario-alternatives"
                  rows={3}
                  value={acceptableAlternativesText}
                  onChange={(e) => setAcceptableAlternativesText(e.target.value)}
                  placeholder="e.g.&#10;Phased rollout&#10;Feature flag toggle"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="scenario-errors" className="text-xs font-medium text-rose-400">
                Critical Errors / Unsafe Actions to Penalize (1 per line or comma-separated)
              </Label>
              <textarea
                id="scenario-errors"
                rows={2}
                value={criticalErrorsText}
                onChange={(e) => setCriticalErrorsText(e.target.value)}
                placeholder="e.g.&#10;Concealing the delay&#10;Blaming the teammate publicly"
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-2.5 text-xs text-white placeholder:text-slate-600 outline-none focus:border-rose-500"
              />
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
                  ? "Update Question"
                  : "Create Question"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
