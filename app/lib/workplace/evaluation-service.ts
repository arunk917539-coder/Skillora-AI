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
  let scenario: WorkplaceScenario | undefined = scenarioForQuestion(question);

  if (!scenario && expectedAnswerFallback) {
    const criteria = parseHrScenarioCriteria(expectedAnswerFallback);
    const defaultCompetencies: CompetencyKey[] = ["communication", "problemSolving", "accountability"];
    const promptText = criteria.contextInstructions
      ? `${question}\n\nContext & Instructions: ${criteria.contextInstructions}`
      : question;

    scenario = {
      id: "custom-hr-scenario",
      category: "HR Custom Scenario",
      difficulty: "Medium",
      prompt: promptText,
      competencies: defaultCompetencies,
      rubric: rubricFor(defaultCompetencies),
      exampleStrongResponse: criteria.expectedAnswer,
      requiredConcepts: criteria.requiredConcepts,
      acceptableAlternatives: criteria.acceptableAlternatives,
      criticalErrors: criteria.criticalErrors,
    };
  }

  if (!scenario) throw new Error("The scenario rubric was not found. Recreate this assessment before submitting.");
  return evaluateWithOllama(scenario, answer);
}
