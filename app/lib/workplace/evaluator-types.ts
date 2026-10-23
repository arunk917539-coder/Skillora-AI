import type { CompetencyKey } from "./scenarios";
export const EVALUATOR_VERSION = "ollama-workplace-evaluator-v1";
export type CriterionEvaluation = { competency: CompetencyKey; score: number; evidence: string[]; missingEvidence: string[]; rationale: string };
export type SemanticAnswerEvaluation = {
  score: number;
  competencies: Partial<Record<CompetencyKey, number>>;
  evidence: string[];
  strengths: string[];
  improvements: string[];
  criterionEvaluations: CriterionEvaluation[];
  evaluator: string;
  rubricVersion: string;
  exampleStrongResponse: string;
};
export function getEvaluationValidationError(value: unknown, expected: CompetencyKey[]): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "Evaluation output is not a JSON object.";
  const v = value as Record<string, unknown>;
  const scoreOk = (n: unknown) => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 100;
  if (!scoreOk(v.score)) return `Invalid or missing overall score (expected number 0–100, received ${String(v.score)}).`;
  if (!v.competencies || typeof v.competencies !== "object" || Array.isArray(v.competencies)) return "Missing or malformed competencies object.";
  const comps = v.competencies as Record<string, unknown>;
  for (const key of expected) {
    if (!scoreOk(comps[key])) return `Competency '${key}' is missing or has invalid score (${String(comps[key])}).`;
  }
  const extraKeys = Object.keys(comps).filter((key) => !expected.includes(key as CompetencyKey));
  if (extraKeys.length > 0) return `Unexpected unrequested competencies present: ${extraKeys.join(", ")}.`;
  if (!Array.isArray(v.evidence) || !v.evidence.every((x) => typeof x === "string")) return "Field 'evidence' must be an array of strings.";
  if (!Array.isArray(v.strengths) || !v.strengths.every((x) => typeof x === "string")) return "Field 'strengths' must be an array of strings.";
  if (!Array.isArray(v.improvements) || !v.improvements.every((x) => typeof x === "string")) return "Field 'improvements' must be an array of strings.";
  if (!Array.isArray(v.criterionEvaluations)) return "Field 'criterionEvaluations' must be an array.";
  if (v.criterionEvaluations.length !== expected.length) {
    return `criterionEvaluations has ${v.criterionEvaluations.length} items, expected ${expected.length}.`;
  }
  const seen = new Set<string>();
  for (let i = 0; i < v.criterionEvaluations.length; i++) {
    const item = v.criterionEvaluations[i];
    if (!item || typeof item !== "object") return `criterionEvaluations[${i}] is not an object.`;
    const c = item as Record<string, unknown>;
    const compStr = String(c.competency);
    if (seen.has(compStr)) return `criterionEvaluations contains duplicate competency '${compStr}'.`;
    seen.add(compStr);
    if (!expected.includes(c.competency as CompetencyKey)) return `criterionEvaluations competency '${compStr}' is not in expected competencies.`;
    if (!scoreOk(c.score)) return `criterionEvaluations competency '${compStr}' has invalid score (${String(c.score)}).`;
    if (!Array.isArray(c.evidence) || !c.evidence.every((x) => typeof x === "string")) return `criterionEvaluations competency '${compStr}' evidence must be an array of strings.`;
    if (!Array.isArray(c.missingEvidence) || !c.missingEvidence.every((x) => typeof x === "string")) return `criterionEvaluations competency '${compStr}' missingEvidence must be an array of strings.`;
    if (typeof c.rationale !== "string") return `criterionEvaluations competency '${compStr}' rationale must be a string.`;
  }
  return null;
}

export function isSemanticEvaluation(value: unknown, expected: CompetencyKey[]): value is Omit<SemanticAnswerEvaluation, "evaluator" | "rubricVersion" | "exampleStrongResponse"> {
  return getEvaluationValidationError(value, expected) === null;
}

/** Defensively normalizes LLM outputs (e.g. numeric strings, casing, unrequested keys) without fabricating missing data */
export function normalizeEvaluationPayload(raw: unknown, expected: CompetencyKey[]): unknown {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const obj = { ...(raw as Record<string, unknown>) };

  if (typeof obj.score === "string" && !isNaN(Number(obj.score))) {
    obj.score = Number(obj.score);
  }

  if (obj.competencies && typeof obj.competencies === "object" && !Array.isArray(obj.competencies)) {
    const rawComps = obj.competencies as Record<string, unknown>;
    const normalizedComps: Partial<Record<CompetencyKey, number>> = {};

    for (const expKey of expected) {
      const foundKey = Object.keys(rawComps).find(
        (k) => k.toLowerCase().replace(/[^a-z]/g, "") === expKey.toLowerCase().replace(/[^a-z]/g, "")
      );
      if (foundKey !== undefined) {
        const val = rawComps[foundKey];
        const num = typeof val === "number" ? val : typeof val === "string" && !isNaN(Number(val)) ? Number(val) : NaN;
        if (!isNaN(num)) {
          normalizedComps[expKey] = num;
        }
      }
    }
    obj.competencies = normalizedComps;
  }

  const ensureStringArray = (val: unknown): string[] => {
    if (Array.isArray(val)) return val.map((x) => String(x ?? "")).filter(Boolean);
    if (typeof val === "string" && val.trim()) return [val.trim()];
    return [];
  };

  obj.evidence = ensureStringArray(obj.evidence);
  obj.strengths = ensureStringArray(obj.strengths);
  obj.improvements = ensureStringArray(obj.improvements);

  if (Array.isArray(obj.criterionEvaluations)) {
    const normalizedCriteria: CriterionEvaluation[] = [];
    const seen = new Set<string>();

    for (const item of obj.criterionEvaluations) {
      if (!item || typeof item !== "object") continue;
      const c = { ...(item as Record<string, unknown>) };

      const compStr = String(c.competency ?? "");
      const matchedComp = expected.find(
        (exp) => exp.toLowerCase().replace(/[^a-z]/g, "") === compStr.toLowerCase().replace(/[^a-z]/g, "")
      );
      if (!matchedComp || seen.has(matchedComp)) continue;
      seen.add(matchedComp);

      const scoreNum = typeof c.score === "number" ? c.score : typeof c.score === "string" && !isNaN(Number(c.score)) ? Number(c.score) : NaN;

      normalizedCriteria.push({
        competency: matchedComp,
        score: scoreNum,
        evidence: ensureStringArray(c.evidence),
        missingEvidence: ensureStringArray(c.missingEvidence),
        rationale: typeof c.rationale === "string" ? c.rationale : String(c.rationale ?? ""),
      });
    }

    obj.criterionEvaluations = normalizedCriteria;
  }

  return obj;
}
