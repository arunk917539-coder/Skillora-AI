import { scenarioForQuestion, rubricFor, type CompetencyKey, type WorkplaceScenario } from "./scenarios";
import { evaluateWithOllama } from "./ollama-evaluator";
import type { SemanticAnswerEvaluation } from "./evaluator-types";
import { parseHrScenarioCriteria } from "./hr-criteria";

/** Ollama is the primary evaluator. Failure is explicit; we never silently substitute keyword scoring. */
export async function evaluateWorkplaceAnswer(
  question: string,
  answer: string,
  expectedAnswerFallback?: string
): Promise<SemanticAnswerEvaluation> {
  let scenario: WorkplaceScenario | undefined;

  // Check if expectedAnswerFallback contains an HR question criteria envelope
  const isHrEnvelope = expectedAnswerFallback && expectedAnswerFallback.trim().startsWith("{");
  if (!isHrEnvelope) {
    scenario = scenarioForQuestion(question);
  }

  if (!scenario && expectedAnswerFallback) {
    const criteria = parseHrScenarioCriteria(expectedAnswerFallback);
    if (!criteria.expectedAnswer || !criteria.expectedAnswer.trim()) {
      throw new Error("Authoritative reference answer is missing for this question. Evaluation cannot proceed without a valid rubric reference.");
    }

    const validCompetencyKeys: CompetencyKey[] = ["communication", "problemSolving", "collaboration", "accountability", "planning"];
    const targetCompetencies = criteria.competencies
      ? (criteria.competencies.filter((c) => validCompetencyKeys.includes(c as CompetencyKey)) as CompetencyKey[])
      : [];

    const resolvedCompetencies: CompetencyKey[] = targetCompetencies.length > 0
      ? targetCompetencies
      : ["communication", "problemSolving", "accountability"];

    const promptText = criteria.contextInstructions
      ? `${question}\n\nContext & Instructions: ${criteria.contextInstructions}`
      : question;

    scenario = {
      id: "custom-hr-scenario",
      category: "HR Questions",
      difficulty: "Medium",
      prompt: promptText,
      competencies: resolvedCompetencies,
      rubric: rubricFor(resolvedCompetencies),
      exampleStrongResponse: criteria.expectedAnswer,
      requiredConcepts: criteria.requiredConcepts,
      acceptableAlternatives: criteria.acceptableAlternatives,
      criticalErrors: criteria.criticalErrors,
    };
  }

  if (!scenario) throw new Error("The scenario rubric was not found. Recreate this assessment before submitting.");
  return evaluateWithOllama(scenario, answer);
}
