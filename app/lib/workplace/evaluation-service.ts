import { scenarioForQuestion, rubricFor, type CompetencyKey, type WorkplaceScenario } from "./scenarios";
import { evaluateWithOllama } from "./ollama-evaluator";
import type { SemanticAnswerEvaluation } from "./evaluator-types";

/** Ollama is the primary evaluator. Failure is explicit; we never silently substitute keyword scoring. */
export async function evaluateWorkplaceAnswer(
  question: string,
  answer: string,
  expectedAnswerFallback?: string
): Promise<SemanticAnswerEvaluation> {
  let scenario: WorkplaceScenario | undefined = scenarioForQuestion(question);

  if (!scenario && expectedAnswerFallback) {
    const defaultCompetencies: CompetencyKey[] = ["communication", "problemSolving", "accountability"];
    scenario = {
      id: "custom-hr-scenario",
      category: "HR Custom Scenario",
      difficulty: "Medium",
      prompt: question,
      competencies: defaultCompetencies,
      rubric: rubricFor(defaultCompetencies),
      exampleStrongResponse: expectedAnswerFallback,
    };
  }

  if (!scenario) throw new Error("The scenario rubric was not found. Recreate this assessment before submitting.");
  return evaluateWithOllama(scenario, answer);
}
