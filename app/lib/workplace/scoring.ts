export const RUBRIC_VERSION = "workplace-rubric-v1";
export type CompetencyKey = "communication" | "problemSolving" | "collaboration" | "accountability" | "planning";
export type CompetencyScores = Record<CompetencyKey, number>;
export type AnswerScore = { score: number; competencies: CompetencyScores; evidence: string[]; wordCount: number };
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/** Deterministic practice rubric. Keyword signals are explainable proxies, not validated behavioural measurements. */
export function scoreAnswer(answer: string): AnswerScore {
  const text = answer.trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
  const signals = {
    plan: /first|then|next|finally|step|plan|prioriti|deadline|timeline|follow.?up/i.test(text),
    communication: /listen|ask|clarif|explain|communicat|discuss|confirm|feedback|respect|align/i.test(text),
    collaboration: /team|colleague|stakeholder|collaborat|support|together|perspective|impact|involve/i.test(text),
    accountability: /own|responsib|document|follow.?up|escalat|report|correct|transparent|honest|acknowledge/i.test(text),
    reasoning: /because|reason|risk|option|evidence|trade.?off|consequence|solution|impact/i.test(text),
  };
  const base = text.length === 0 ? 0 : 25 + (words >= 40 ? 20 : words >= 20 ? 15 : words >= 10 ? 10 : words >= 5 ? 5 : 0);
  const competencies: CompetencyScores = text.length === 0 ? { communication: 0, problemSolving: 0, collaboration: 0, accountability: 0, planning: 0 } : {
    communication: clamp(base + (signals.communication ? 25 : 0) + (signals.collaboration ? 8 : 0)),
    problemSolving: clamp(base + (signals.reasoning ? 25 : 0) + (signals.plan ? 12 : 0)),
    collaboration: clamp(base + (signals.collaboration ? 25 : 0) + (signals.communication ? 10 : 0)),
    accountability: clamp(base + (signals.accountability ? 25 : 0) + (signals.reasoning ? 8 : 0)),
    planning: clamp(base + (signals.plan ? 25 : 0) + (signals.accountability ? 8 : 0)),
  };
  const score = clamp(Object.values(competencies).reduce((a, b) => a + b, 0) / 5);
  const evidence = [
    words >= 20 ? "The response contains enough detail to evaluate more than a brief statement." : "Add more detail so your reasoning and actions are clear.",
    signals.communication ? "Mentions clarification or respectful communication." : "Explain how you would communicate and clarify the situation.",
    signals.collaboration ? "Considers teammates or other stakeholders." : "Consider who is affected and involve relevant people.",
    signals.accountability ? "Includes an accountability or follow-up signal." : "State how you would take responsibility and follow up.",
    signals.reasoning ? "Includes reasoning, risks, options or consequences." : "Explain why you chose the approach and what risks you considered.",
  ];
  return { score, competencies, evidence, wordCount: words };
}
export function averageScores(rows: AnswerScore[]): CompetencyScores {
  const keys: CompetencyKey[] = ["communication", "problemSolving", "collaboration", "accountability", "planning"];
  return Object.fromEntries(keys.map(key => [key, rows.length ? clamp(rows.reduce((sum, row) => sum + row.competencies[key], 0) / rows.length) : 0])) as CompetencyScores;
}
