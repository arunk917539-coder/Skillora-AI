export type QuestionStatus = "draft" | "published" | "archived";

export type HrScenarioCriteria = {
  version: number;
  expectedAnswer: string;
  contextInstructions?: string;
  requiredConcepts: string[];
  acceptableAlternatives: string[];
  criticalErrors: string[];
  scoringGuidance?: string;
  isArchived: boolean;
  status: QuestionStatus;
  competencies?: string[];
};

/**
 * Safely parses the structured criteria envelope from an HrQuestion.expectedAnswer string.
 * Supports backward-compatible fallback for plain text records.
 */
export function parseHrScenarioCriteria(raw: string): HrScenarioCriteria {
  if (typeof raw !== "string" || !raw.trim()) {
    return {
      version: 1,
      expectedAnswer: "",
      requiredConcepts: [],
      acceptableAlternatives: [],
      criticalErrors: [],
      isArchived: false,
      status: "published",
    };
  }

  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object" && typeof parsed.expectedAnswer === "string") {
        const isArchived = Boolean(parsed.isArchived || parsed.status === "archived");
        const status: QuestionStatus =
          parsed.status === "draft" || parsed.status === "archived" || parsed.status === "published"
            ? parsed.status
            : isArchived
            ? "archived"
            : "published";

        const competencies = Array.isArray(parsed.competencies)
          ? parsed.competencies.map(String).filter(Boolean)
          : undefined;

        return {
          version: typeof parsed.version === "number" ? parsed.version : 1,
          expectedAnswer: parsed.expectedAnswer,
          contextInstructions: typeof parsed.contextInstructions === "string" ? parsed.contextInstructions : undefined,
          requiredConcepts: Array.isArray(parsed.requiredConcepts) ? parsed.requiredConcepts.map(String).filter(Boolean) : [],
          acceptableAlternatives: Array.isArray(parsed.acceptableAlternatives) ? parsed.acceptableAlternatives.map(String).filter(Boolean) : [],
          criticalErrors: Array.isArray(parsed.criticalErrors) ? parsed.criticalErrors.map(String).filter(Boolean) : [],
          scoringGuidance: typeof parsed.scoringGuidance === "string" ? parsed.scoringGuidance : undefined,
          isArchived,
          status,
          competencies,
        };
      }
    } catch {
      // Fall through to plain-text fallback
    }
  }

  return {
    version: 1,
    expectedAnswer: raw,
    requiredConcepts: [],
    acceptableAlternatives: [],
    criticalErrors: [],
    isArchived: false,
    status: "published",
  };
}

/**
 * Serializes custom scenario criteria into the storage envelope.
 */
export function serializeHrScenarioCriteria(
  criteria: Partial<HrScenarioCriteria> & { expectedAnswer: string }
): string {
  const isArchived = Boolean(criteria.isArchived || criteria.status === "archived");
  const status: QuestionStatus = criteria.status
    ? criteria.status
    : isArchived
    ? "archived"
    : "published";

  const payload: HrScenarioCriteria = {
    version: criteria.version ?? 1,
    expectedAnswer: criteria.expectedAnswer,
    contextInstructions: criteria.contextInstructions?.trim() || undefined,
    requiredConcepts: criteria.requiredConcepts || [],
    acceptableAlternatives: criteria.acceptableAlternatives || [],
    criticalErrors: criteria.criticalErrors || [],
    scoringGuidance: criteria.scoringGuidance?.trim() || undefined,
    isArchived,
    status,
    competencies: criteria.competencies || undefined,
  };
  return JSON.stringify(payload);
}
