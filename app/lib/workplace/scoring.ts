export const RUBRIC_VERSION = "workplace-rubric-v1";
export type CompetencyKey = "communication" | "problemSolving" | "collaboration" | "accountability" | "planning";
export type CompetencyScores = Record<CompetencyKey, number>;
export type AnswerScore = { score: number; competencies: CompetencyScores; evidence: string[]; wordCount: number };
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/**
 * Deterministic practice rubric evaluation for fallback/local heuristics.
 * Evaluates constructive professional practice without rewarding mere word volume
 * or awarding high scores to toxic or negligent answers.
 */
export function scoreAnswer(answer: string): AnswerScore {
  const text = answer.trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;

  if (words === 0) {
    return {
      score: 0,
      competencies: { communication: 0, problemSolving: 0, collaboration: 0, accountability: 0, planning: 0 },
      evidence: ["No response provided."],
      wordCount: 0,
    };
  }

  // Detect counter-productive, hostile, or unethical indicators
  const isHostileOrToxic =
    /stupid|fire (?:them|everyone|all)|never listen|refuse to listen|ignore (?:the )?(?:team|stakeholders|client|rules|lead)|not my (?:problem|job)|blame (?:others|them)|fake (?:the )?(?:data|numbers|report)|threaten/i.test(
      text
    );

  if (isHostileOrToxic) {
    return {
      score: 10,
      competencies: { communication: 10, problemSolving: 10, collaboration: 5, accountability: 10, planning: 10 },
      evidence: [
        "Response contains hostile, dismissive, or counter-productive actions that violate professional workplace conduct.",
      ],
      wordCount: words,
    };
  }

  // Identify substantive constructive practices
  const signals = {
    communication: /listen|ask|clarif|explain|communicat|discuss|confirm|feedback|respect|align|reach out|transparent/i.test(text),
    problemSolving: /root cause|trade.?off|risk|analyz|option|consequence|alternative|evaluat|solution|mitigat|priorit/i.test(text),
    collaboration: /team|colleague|stakeholder|collaborat|partner|together|perspective|cross.?functional|involve|support/i.test(text),
    accountability: /own|responsib|document|follow.?up|escalat|report|correct|transparent|honest|acknowledge|remediat/i.test(text),
    planning: /first|then|next|finally|milestone|schedule|timeline|buffer|deadline|step|contingency|phase/i.test(text),
  };

  // Base score requires substantive content (not inflated by word fluff)
  const substantiveHits = Object.values(signals).filter(Boolean).length;
  const base = substantiveHits > 0 ? 30 : 15;

  const competencies: CompetencyScores = {
    communication: clamp(base + (signals.communication ? 40 : 0) + (signals.collaboration ? 15 : 0)),
    problemSolving: clamp(base + (signals.problemSolving ? 40 : 0) + (signals.planning ? 15 : 0)),
    collaboration: clamp(base + (signals.collaboration ? 40 : 0) + (signals.communication ? 15 : 0)),
    accountability: clamp(base + (signals.accountability ? 40 : 0) + (signals.problemSolving ? 15 : 0)),
    planning: clamp(base + (signals.planning ? 40 : 0) + (signals.accountability ? 15 : 0)),
  };

  const score = clamp(Object.values(competencies).reduce((a, b) => a + b, 0) / 5);

  const evidence = [
    signals.communication
      ? "Demonstrates clear communication, clarification, or stakeholder alignment."
      : "Clarify expectations and communicate proactively with stakeholders.",
    signals.problemSolving
      ? "Analyzes trade-offs, options, or root causes before deciding."
      : "Include explicit reasoning, trade-offs, or risk mitigations.",
    signals.collaboration
      ? "Considers teammates, cross-functional partners, or collaborative input."
      : "Engage affected colleagues and consider cross-functional impact.",
    signals.accountability
      ? "Demonstrates ownership, transparent escalation, or concrete follow-through."
      : "Establish clear personal ownership and documented follow-up steps.",
    signals.planning
      ? "Organizes actions with structured sequencing, milestones, or contingency steps."
      : "Structure your response into clear, sequenced phases or actionable steps.",
  ];

  return { score, competencies, evidence, wordCount: words };
}

/**
 * Calculates the arithmetic mean across competencies, strictly bounded between 0 and 100.
 */
export function averageScores(rows: AnswerScore[]): CompetencyScores {
  const keys: CompetencyKey[] = ["communication", "problemSolving", "collaboration", "accountability", "planning"];
  return Object.fromEntries(
    keys.map((key) => [
      key,
      rows.length ? clamp(rows.reduce((sum, row) => sum + row.competencies[key], 0) / rows.length) : 0,
    ])
  ) as CompetencyScores;
}
