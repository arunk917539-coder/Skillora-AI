import type { CompetencyScores, CompetencyKey } from "./scoring";
export type DevelopmentAction = { competency: CompetencyKey; label: string; score: number; priority: "high" | "medium" | "maintain"; reason: string; actions: string[] };
const library: Record<CompetencyKey, { label: string; reason: string; actions: string[] }> = {
  communication: { label: "Communication", reason: "Make your message, questions and next steps explicit.", actions: ["Practise summarising a disagreement neutrally.", "Confirm shared understanding and ownership in writing."] },
  problemSolving: { label: "Problem solving", reason: "Show how you evaluate options, risks and consequences.", actions: ["Write down two options and the trade-offs for each.", "Explain the reason behind your chosen solution."] },
  collaboration: { label: "Collaboration", reason: "Demonstrate how you involve and support affected people.", actions: ["Identify stakeholders and ask for their perspectives.", "Agree shared ownership and a follow-up point."] },
  accountability: { label: "Accountability", reason: "State how you own actions, communicate issues and close the loop.", actions: ["Practise acknowledging an error and proposing a correction.", "Define who needs an update and when you will follow up."] },
  planning: { label: "Planning and prioritisation", reason: "Make the sequence, constraints and deadlines visible.", actions: ["List urgency, impact and dependencies before choosing priorities.", "Communicate trade-offs early and agree a realistic timeline."] },
};
export function buildDevelopmentPlan(scores: CompetencyScores): DevelopmentAction[] {
  return (Object.keys(library) as CompetencyKey[]).map(key => {
    const score = scores[key];
    const priority: DevelopmentAction["priority"] = score < 55 ? "high" : score < 75 ? "medium" : "maintain";
    return { competency: key, label: library[key].label, score, priority, reason: library[key].reason, actions: library[key].actions };
  }).sort((a, b) => a.score - b.score);
}
