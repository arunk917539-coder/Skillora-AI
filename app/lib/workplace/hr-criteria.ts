export type HrScenarioCriteria = {
  version: number;
  expectedAnswer: string;
  contextInstructions?: string;
  requiredConcepts: string[];
  acceptableAlternatives: string[];
  criticalErrors: string[];
  scoringGuidance?: string;
  isArchived: boolean;
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
    };
  }

  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === "object" && typeof parsed.expectedAnswer === "string") {
        return {
          version: typeof parsed.version === "number" ? parsed.version : 1,
          expectedAnswer: parsed.expectedAnswer,
          contextInstructions: typeof parsed.contextInstructions === "string" ? parsed.contextInstructions : undefined,
          requiredConcepts: Array.isArray(parsed.requiredConcepts) ? parsed.requiredConcepts.map(String).filter(Boolean) : [],
          acceptableAlternatives: Array.isArray(parsed.acceptableAlternatives) ? parsed.acceptableAlternatives.map(String).filter(Boolean) : [],
          criticalErrors: Array.isArray(parsed.criticalErrors) ? parsed.criticalErrors.map(String).filter(Boolean) : [],
          scoringGuidance: typeof parsed.scoringGuidance === "string" ? parsed.scoringGuidance : undefined,
          isArchived: Boolean(parsed.isArchived),
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
  };
}

/**
 * Serializes custom scenario criteria into the storage envelope.
 */
export function serializeHrScenarioCriteria(
  criteria: Partial<HrScenarioCriteria> & { expectedAnswer: string }
): string {
  const payload: HrScenarioCriteria = {
    version: criteria.version ?? 1,
    expectedAnswer: criteria.expectedAnswer,
    contextInstructions: criteria.contextInstructions?.trim() || undefined,
    requiredConcepts: criteria.requiredConcepts || [],
    acceptableAlternatives: criteria.acceptableAlternatives || [],
    criticalErrors: criteria.criticalErrors || [],
    scoringGuidance: criteria.scoringGuidance?.trim() || undefined,
    isArchived: Boolean(criteria.isArchived),
  };
  return JSON.stringify(payload);
}
