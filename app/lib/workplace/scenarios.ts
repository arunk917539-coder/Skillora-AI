/** Curated workplace scenarios with explicit rubric guidance for semantic evaluation. */
export type CompetencyKey = "communication" | "problemSolving" | "collaboration" | "accountability" | "planning";
export type RubricCriterion = { competency: CompetencyKey; description: string; strongEvidence: string[]; weakSignals: string[] };
export type WorkplaceScenario = {
  id: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prompt: string;
  competencies: CompetencyKey[];
  rubric: RubricCriterion[];
  exampleStrongResponse: string;
};
export const rubricLibrary: Record<CompetencyKey, RubricCriterion> = {
  communication: { competency: "communication", description: "Communicates clearly, respectfully, and with appropriate updates.", strongEvidence: ["clarifies facts or expectations", "adapts message to the people involved", "confirms next steps or shared understanding"], weakSignals: ["assumes others understand", "uses blame or vague promises", "does not communicate relevant risk"] },
  problemSolving: { competency: "problemSolving", description: "Understands the problem and chooses a reasoned, proportionate response.", strongEvidence: ["identifies the cause or missing information", "considers options and consequences", "checks whether the solution worked"], weakSignals: ["jumps to a conclusion", "ignores likely consequences", "offers no way to verify the outcome"] },
  collaboration: { competency: "collaboration", description: "Considers affected colleagues and works constructively with them.", strongEvidence: ["listens to affected people", "offers appropriate support or shared ownership", "handles disagreement respectfully"], weakSignals: ["blames or excludes others", "makes unilateral assumptions", "ignores relevant stakeholders"] },
  accountability: { competency: "accountability", description: "Takes responsibility, acts transparently, and follows through.", strongEvidence: ["acknowledges responsibility or risk", "communicates errors or concerns honestly", "sets an owner and follow-up"], weakSignals: ["hides mistakes", "shifts blame", "makes no commitment to follow through"] },
  planning: { competency: "planning", description: "Sets a practical sequence, priorities, owners, and timelines.", strongEvidence: ["prioritizes based on impact and urgency", "identifies dependencies and constraints", "sets a realistic timeline and check-in"], weakSignals: ["treats every task as equally urgent", "ignores dependencies", "offers no timeline or next step"] },
};
export function rubricFor(keys: CompetencyKey[]): RubricCriterion[] { return keys.map((key) => rubricLibrary[key]); }
export function strongResponse(category: string): string {
  const examples: Record<string, string> = {
    Communication: "I would first clarify what was misunderstood and the intended outcome. I would explain the requirements respectfully, ask the teammate to confirm their understanding, agree on any corrections and owners, and follow up to make sure the work meets the agreed standard.",
    Teamwork: "I would speak with my teammate privately to understand the blocker, then assess remaining work and the deadline. I would agree on the highest-priority tasks, offer targeted help where possible, and tell the team lead early if the timeline is at risk. We would confirm ownership and check progress.",
    "Conflict Resolution": "I would hear each person's perspective, restate the shared goal, and separate facts from assumptions. We would compare options against agreed criteria, decide on a fair next step, document responsibilities, and check whether the disagreement is resolved.",
    "Ethical Decision-Making": "I would pause the risky action, protect any sensitive information, and explain the concern respectfully. I would correct the issue through the appropriate channel, notify the responsible person when needed, document relevant facts, and follow policy rather than conceal the problem.",
    Prioritization: "I would compare urgency, impact, dependencies, and deadlines, then clarify trade-offs with the stakeholders. I would agree on a realistic order of work, communicate any risk early, confirm ownership and timing, and revisit the plan if priorities change.",
  };
  return examples[category] ?? "I would clarify the facts, consider who is affected, choose a proportionate action, communicate the decision and its risks, agree on owners and timing, and follow up to confirm the outcome.";
}
const raw: Omit<WorkplaceScenario, "rubric" | "exampleStrongResponse">[] = [
  { id: "comm-1", category: "Communication", difficulty: "Easy", prompt: "A teammate misunderstands an important task and delivers work that does not meet the agreed requirements. How would you address the issue constructively?", competencies: ["communication", "accountability", "collaboration"] },
  { id: "comm-2", category: "Communication", difficulty: "Medium", prompt: "You need to explain a complex change to a colleague who has limited context. How would you make sure they understand the impact and next steps?", competencies: ["communication", "planning"] },
  { id: "comm-3", category: "Communication", difficulty: "Hard", prompt: "Two colleagues have different interpretations of a project update. What would you do to establish a shared understanding?", competencies: ["communication", "collaboration", "problemSolving"] },
  { id: "team-1", category: "Teamwork", difficulty: "Easy", prompt: "A teammate is falling behind and the team's deadline is at risk. How would you support them while keeping the work on track?", competencies: ["collaboration", "planning", "communication"] },
  { id: "team-2", category: "Teamwork", difficulty: "Medium", prompt: "Two team members disagree strongly about how to complete a task. How would you help the team move forward?", competencies: ["collaboration", "problemSolving", "communication"] },
  { id: "team-3", category: "Teamwork", difficulty: "Hard", prompt: "You notice a quieter colleague's idea is being overlooked in a meeting. What would you do?", competencies: ["collaboration", "communication", "accountability"] },
  { id: "conflict-1", category: "Conflict Resolution", difficulty: "Easy", prompt: "A colleague criticizes your work in front of the team. How would you respond and resolve the underlying issue?", competencies: ["communication", "accountability", "collaboration"] },
  { id: "conflict-2", category: "Conflict Resolution", difficulty: "Medium", prompt: "A disagreement between colleagues is affecting delivery. What steps would you take to resolve it fairly?", competencies: ["problemSolving", "communication", "collaboration"] },
  { id: "conflict-3", category: "Conflict Resolution", difficulty: "Hard", prompt: "You receive feedback that you believe is unfair. How would you respond professionally?", competencies: ["communication", "accountability", "problemSolving"] },
  { id: "ethics-1", category: "Ethical Decision-Making", difficulty: "Easy", prompt: "You notice a teammate is about to share confidential information in an inappropriate channel. What would you do?", competencies: ["accountability", "communication", "problemSolving"] },
  { id: "ethics-2", category: "Ethical Decision-Making", difficulty: "Medium", prompt: "A deadline is close, and someone suggests hiding a mistake from a stakeholder. How would you handle the situation?", competencies: ["accountability", "problemSolving", "communication"] },
  { id: "ethics-3", category: "Ethical Decision-Making", difficulty: "Hard", prompt: "You discover an error in a report that has already been shared. What actions would you take?", competencies: ["accountability", "planning", "communication"] },
  { id: "priority-1", category: "Prioritization", difficulty: "Easy", prompt: "You have two urgent tasks from different stakeholders and cannot finish both on time. How would you decide what to do first?", competencies: ["planning", "communication", "problemSolving"] },
  { id: "priority-2", category: "Prioritization", difficulty: "Medium", prompt: "A new urgent request arrives while you are working on a committed deadline. How would you handle the competing priorities?", competencies: ["planning", "accountability", "communication"] },
  { id: "priority-3", category: "Prioritization", difficulty: "Hard", prompt: "Your workload becomes unrealistic for the week. How would you communicate and make a plan?", competencies: ["planning", "communication", "accountability"] },
];
const additionalPrompts: Record<string, Record<"Easy" | "Medium" | "Hard", string[]>> = {
  Communication: {
    Easy: ["A project instruction is unclear and you are unsure what deliverable is expected. What would you do before starting?", "You need to tell a colleague that a small part of their work needs correction. How would you explain it constructively?"],
    Medium: ["A change to a project deadline affects two teams that have not yet heard about it. How would you communicate the change and confirm alignment?", "A stakeholder says your update was confusing and missed important details. How would you respond and improve the next update?"],
    Hard: ["A high-pressure meeting has produced conflicting commitments from several teams. How would you establish a reliable shared plan?", "You must communicate a serious delivery risk to a stakeholder who strongly expects the original deadline. How would you handle the conversation?"]
  },
  Teamwork: {
    Easy: ["A new teammate is unsure how to contribute to a shared task. How would you help them get started?", "A team task is nearly complete, but one small piece has no clear owner. What would you do?"],
    Medium: ["A teammate repeatedly misses handoffs and this affects other people's work. How would you address the pattern?", "Your team has limited capacity and two colleagues need help at the same time. How would you coordinate support?"],
    Hard: ["A cross-functional project is stalled because teams disagree on ownership and success criteria. How would you get progress moving?", "A senior colleague dismisses feedback from junior teammates and the team is losing trust. How would you respond constructively?"]
  },
  "Conflict Resolution": {
    Easy: ["A colleague disagrees with your suggested approach during a routine task. How would you work through the disagreement?", "You and a teammate have duplicated work because you made different assumptions. How would you resolve it?"],
    Medium: ["Two colleagues blame each other for a missed handoff. How would you establish facts and agree on a repair?", "A disagreement is becoming personal in a team chat. What would you do to de-escalate it and reach a decision?"],
    Hard: ["A long-running conflict between two specialists is putting a critical delivery at risk. How would you facilitate a fair resolution?", "A decision-maker rejects your concerns without discussing the evidence. How would you challenge the decision professionally while preserving progress?"]
  },
  "Ethical Decision-Making": {
    Easy: ["You notice a shared document contains information that should not be visible to the whole team. What would you do?", "A colleague asks you to mark a task complete even though one required check has not been done. How would you respond?"],
    Medium: ["You discover a small data error in a report shortly before it is used in a meeting. How would you handle the correction and communication?", "A teammate proposes skipping a required review to meet a deadline. How would you respond and keep work moving responsibly?"],
    Hard: ["A manager asks you to omit a material limitation from a report because it could delay approval. What would you do?", "You find evidence that a process repeatedly exposes confidential information, but fixing it may delay a launch. How would you escalate and mitigate the risk?"]
  },
  Prioritization: {
    Easy: ["You have a routine task due today and an unexpected request from your manager. How would you decide what to do first?", "You realize you cannot finish every item on your daily list. How would you reset your plan?"],
    Medium: ["Three stakeholders label their requests urgent, but you have capacity for only one today. How would you prioritize and communicate the decision?", "A dependency is delayed and may affect your committed deadline. How would you revise the plan?"],
    Hard: ["A critical incident arrives while your team is preparing a major delivery with fixed commitments. How would you reallocate work and manage expectations?", "Several high-impact projects compete for the same limited resources and no stakeholder will reduce scope. How would you create a defensible plan?"]
  }
};
const additions = Object.entries(additionalPrompts).flatMap(([category, levels]) =>
  (Object.entries(levels) as ["Easy" | "Medium" | "Hard", string[]][]).flatMap(([difficulty, prompts]) =>
    prompts.map((prompt, index) => {
      const original = raw.find((item) => item.category === category && item.difficulty === difficulty)!;
      return { id: `${category.toLowerCase().replace(/[^a-z]+/g, "-")}-${difficulty.toLowerCase()}-${index + 1}`, category, difficulty, prompt, competencies: original.competencies };
    })
  )
);
export const SCENARIOS: WorkplaceScenario[] = [...raw, ...additions].map((scenario) => ({ ...scenario, rubric: rubricFor(scenario.competencies), exampleStrongResponse: strongResponse(scenario.category) }));
export const CATEGORIES = ["Communication", "Teamwork", "Conflict Resolution", "Ethical Decision-Making", "Prioritization"] as const;
export function selectScenarios(category: string, count: number, difficulty?: string): WorkplaceScenario[] {
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) return [];
  const requestedCount = Number.isFinite(count) ? Math.min(Math.max(Math.trunc(count), 1), 3) : 1;
  const pool = SCENARIOS.filter((scenario) => scenario.category === category);
  if (difficulty && !["Easy", "Medium", "Hard"].includes(difficulty)) return [];
  // Do not silently mix levels: only return scenarios at the requested level.
  const matching = difficulty ? pool.filter((scenario) => scenario.difficulty === difficulty) : pool;
  return matching.slice(0, requestedCount);
}
export function scenarioForQuestion(question: string): WorkplaceScenario | undefined {
  return SCENARIOS.find((scenario) => scenario.prompt.trim() === question.trim());
}
