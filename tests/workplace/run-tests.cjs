const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { SCENARIOS, CATEGORIES, selectScenarios } = require("../../.test-build/scenarios.js");
const { isSemanticEvaluation, normalizeEvaluationPayload, getEvaluationValidationError } = require("../../.test-build/evaluator-types.js");
const { evaluateWithOllama, extractJsonContent, normalizeForEvidenceCheck } = require("../../.test-build/ollama-evaluator.js");
const { evaluateWorkplaceAnswer } = require("../../.test-build/evaluation-service.js");
const { scoreAnswer, averageScores, RUBRIC_VERSION } = require("../../.test-build/scoring.js");
const { buildDevelopmentPlan } = require("../../.test-build/development-plans.js");
const { compareProgress } = require("../../.test-build/progress.js");
const { parseStoredJson, parseStoredArray, parseStoredNumberRecord } = require("../../.test-build/safe-json.js");

test("scenario bank covers all categories and each scenario has rubric and sample response", () => {
  for (const category of CATEGORIES) {
    assert.ok(SCENARIOS.some((scenario) => scenario.category === category), `missing ${category}`);
    for (const difficulty of ["Easy", "Medium", "Hard"]) assert.ok(SCENARIOS.filter((s) => s.category === category && s.difficulty === difficulty).length >= 3, `${category} lacks ${difficulty} variety`);
  }
  for (const scenario of SCENARIOS) {
    assert.ok(scenario.rubric.length > 0);
    assert.ok(scenario.rubric.every((criterion) => scenario.competencies.includes(criterion.competency)));
    assert.ok(scenario.exampleStrongResponse.length > 30);
  }
});

test("scenario selection returns requested count at the requested difficulty without duplicates", () => {
  for (const category of CATEGORIES) {
    for (const difficulty of ["Easy", "Medium", "Hard"]) {
      const rows = selectScenarios(category, 3, difficulty);
      assert.equal(rows.length, 3);
      assert.equal(new Set(rows.map((row) => row.id)).size, 3);
      assert.ok(rows.every((row) => row.category === category && row.difficulty === difficulty));
    }
  }
});

test("scenario selection prefers requested difficulty", () => {
  for (const category of CATEGORIES) {
    const rows = selectScenarios(category, 1, "Hard");
    assert.equal(rows.length, 1);
    assert.equal(rows[0].difficulty, "Hard");
  }
});

test("invalid scenario count is clamped safely by selector", () => {
  assert.equal(selectScenarios("Communication", 0).length, 1);
  assert.equal(selectScenarios("Communication", 100).length, 3);
});

test("scoring returns bounded scores and evidence", () => {
  const empty = scoreAnswer("");
  assert.equal(empty.score, 0);
  assert.ok(Object.values(empty.competencies).every((score) => score === 0));
  const detailed = scoreAnswer("First I would listen and clarify the issue with the team, compare options and risks, agree a plan, take responsibility, document the decision, and follow up with stakeholders.");
  assert.ok(detailed.score >= 0 && detailed.score <= 100);
  assert.ok(Object.values(detailed.competencies).every((score) => score >= 0 && score <= 100));
  assert.ok(detailed.evidence.length >= 4);
  assert.equal(detailed.wordCount > 0, true);
});

test("averageScores handles rows and empty input", () => {
  const rows = [scoreAnswer("I will listen, clarify, plan and follow up with the team."), scoreAnswer("I will explain the risks and communicate the next steps.")];
  const average = averageScores(rows);
  assert.equal(Object.keys(average).length, 5);
  assert.ok(Object.values(average).every((score) => score >= 0 && score <= 100));
  assert.ok(Object.values(averageScores([])).every((score) => score === 0));
  assert.ok(RUBRIC_VERSION.length > 0);
});

test("development plan sorts weakest competency first", () => {
  const plan = buildDevelopmentPlan({ communication: 90, problemSolving: 40, collaboration: 60, accountability: 70, planning: 50 });
  assert.equal(plan[0].competency, "problemSolving");
  assert.equal(plan[0].priority, "high");
  assert.ok(plan.every((item) => item.actions.length > 0));
});

test("progress compares same category rather than unrelated scenarios", () => {
  const result = compareProgress([
    { createdAt: "2026-01-01", category: "Communication", scores: { communication: 40 } },
    { createdAt: "2026-01-02", category: "Teamwork", scores: { communication: 90 } },
    { createdAt: "2026-01-03", category: "Communication", scores: { communication: 65 } },
  ]);
  assert.equal(result.available, true);
  assert.equal(result.category, "Communication");
  assert.equal(result.changes.find((row) => row.competency === "communication").change, 25);
  assert.equal(compareProgress([{ createdAt: "2026-01-01", category: "Ethics", scores: { accountability: 50 } }, { createdAt: "2026-01-02", category: "Ethics", scores: { communication: 90 } }]).available, false);
  assert.equal(compareProgress([{ createdAt: "2026-01-01", category: "Communication", scores: {} }]).available, false);
});

test("malformed persisted JSON uses fallback", () => {
  assert.deepEqual(parseStoredJson("not-json", []), []);
  assert.deepEqual(parseStoredJson('[1,2]', []), [1, 2]);
  assert.equal(parseStoredJson(null, "fallback"), "fallback");
  assert.deepEqual(parseStoredNumberRecord('{"communication":72}'), { communication: 72 });
  assert.equal(parseStoredNumberRecord('[1,2]'), null);
  assert.equal(parseStoredNumberRecord('{"communication":"high"}'), null);
  assert.deepEqual(parseStoredArray('[{"label":"ok"}, "bad"]', (item) => Boolean(item && typeof item === "object" && typeof item.label === "string")), [{ label: "ok" }]);
});


test("semantic evaluator schema rejects malformed or out-of-scope results", () => {
  const valid = {
    score: 72,
    competencies: { communication: 72, collaboration: 70 },
    evidence: ["I would clarify the issue"],
    strengths: ["Clarifies before acting"],
    improvements: ["Set a follow-up date"],
    criterionEvaluations: [
      { competency: "communication", score: 72, evidence: ["clarify the issue"], missingEvidence: ["confirm ownership"], rationale: "The answer identifies clarification but lacks a follow-up." },
      { competency: "collaboration", score: 70, evidence: ["with the team"], missingEvidence: [], rationale: "The answer considers teammates." }
    ]
  };
  assert.equal(isSemanticEvaluation(valid, ["communication", "collaboration"]), true);
  assert.equal(isSemanticEvaluation({ ...valid, score: 101 }, ["communication", "collaboration"]), false);
  assert.equal(isSemanticEvaluation(valid, ["communication", "accountability"]), false);
});


test("human-review benchmark includes short, irrelevant, unsafe and prompt-injection cases", () => {
  const benchmark = JSON.parse(fs.readFileSync(path.join(__dirname, "evaluator-cases.json"), "utf8"));
  assert.equal(benchmark.version, "workplace-benchmark-v1");
  assert.ok(benchmark.cases.length >= 5);
  for (const item of benchmark.cases) {
    assert.ok(typeof item.answer === "string" && item.answer.length > 0);
    assert.ok(Array.isArray(item.expectedEvidence) && item.expectedEvidence.length > 0);
    assert.ok(typeof item.reviewNote === "string" && item.reviewNote.length > 0);
  }
});


test("Ollama evaluator accepts schema-valid scenario-aware output and verifies evidence quotes", async () => {
  const scenario = SCENARIOS.find((item) => item.id === "team-1");
  const answer = "I would ask what is blocking the work, agree priorities, offer help, and notify the lead early.";
  const payload = {
    score: 78,
    competencies: Object.fromEntries(scenario.competencies.map((key) => [key, 78])),
    evidence: ["The answer proposes clarifying the blocker and communicating risk."],
    strengths: ["Identifies the blocker before acting"],
    improvements: ["Confirm owners and a follow-up time"],
    criterionEvaluations: scenario.competencies.map((competency) => ({ competency, score: 78, evidence: ["agree priorities"], missingEvidence: ["confirm owners"], rationale: "A practical next step is identified, but ownership could be clearer." }))
  };
  const originalFetch = global.fetch;
  let sentRequest;
  global.fetch = async (_url, init) => {
    sentRequest = JSON.parse(init.body);
    return new Response(JSON.stringify({ message: { content: JSON.stringify(payload) } }), { status: 200, headers: { "Content-Type": "application/json" } });
  };
  try {
    const result = await evaluateWithOllama(scenario, answer);
    assert.equal(sentRequest.model, process.env.OLLAMA_MODEL || "qwen3:4b");
    assert.equal(sentRequest.think, false);
    assert.equal(sentRequest.format, "json");
    assert.equal(result.score, 78);
    assert.equal(result.evaluator, "ollama-workplace-evaluator-v1");
    assert.equal(Object.keys(result.competencies).length, scenario.competencies.length);
    global.fetch = async () => new Response(JSON.stringify({ message: { content: JSON.stringify({ ...payload, criterionEvaluations: payload.criterionEvaluations.map((x) => ({ ...x, evidence: ["I never said this"] })) }) } }), { status: 200, headers: { "Content-Type": "application/json" } });
    await assert.rejects(() => evaluateWithOllama(scenario, answer), /evidence that could not be verified/);
  } finally {
    global.fetch = originalFetch;
  }
});

test("Ollama evaluator rejects empty and oversized answers before making a request", async () => {
  const scenario = SCENARIOS.find((item) => item.id === "team-1");
  const originalFetch = global.fetch;
  let called = false;
  global.fetch = async () => { called = true; throw new Error("must not call Ollama"); };
  try {
    await assert.rejects(() => evaluateWithOllama(scenario, "   "), /1–5000 characters/);
    await assert.rejects(() => evaluateWithOllama(scenario, "x".repeat(5001)), /1–5000 characters/);
    assert.equal(called, false);
  } finally {
    global.fetch = originalFetch;
  }
});

test("Ollama evaluator reports service unavailability instead of creating a fallback score", async () => {
  const scenario = SCENARIOS.find((item) => item.id === "team-1");
  const originalFetch = global.fetch;
  global.fetch = async () => { throw new TypeError("fetch failed"); };
  try {
    await assert.rejects(() => evaluateWithOllama(scenario, "I would clarify the blocker and agree next steps."), /fetch failed/);
  } finally {
    global.fetch = originalFetch;
  }
});

test("extractJsonContent strips Qwen <think> tags and markdown code blocks defensively", () => {
  const rawWithThink = "<think>Analyzing the user answer... The user demonstrates clear communication.</think> {\"score\": 85, \"competencies\": {\"communication\": 85}}";
  assert.equal(extractJsonContent(rawWithThink), '{"score": 85, "competencies": {"communication": 85}}');

  const rawWithMarkdown = "```json\n{\"score\": 90}\n```";
  assert.equal(extractJsonContent(rawWithMarkdown), '{"score": 90}');

  const rawWithBoth = "<think>Let me evaluate this.</think>\n```json\n{\"score\": 80, \"feedback\": \"good\"}\n```";
  assert.equal(extractJsonContent(rawWithBoth), '{"score": 80, "feedback": "good"}');
});

test("normalizeForEvidenceCheck normalizes harmless quote variations while verifying presence", () => {
  const rawAnswer = 'I said, "We need to agree on priorities" and then moved forward.';
  const normalized = normalizeForEvidenceCheck(rawAnswer);
  assert.ok(normalized.includes(normalizeForEvidenceCheck('"We need to agree on priorities"')));
  assert.ok(normalized.includes(normalizeForEvidenceCheck('“We need to agree on priorities”')));
  assert.ok(normalized.includes(normalizeForEvidenceCheck('agree on priorities.')));

  // Absent evidence must still be rejected
  assert.ok(!normalized.includes(normalizeForEvidenceCheck('completely absent statement')));
});

test("evaluateWorkplaceAnswer supports HR custom scenarios with expected answers", async () => {
  const customQuestion = "How do you coordinate cross-functional delivery under a tight deadline?";
  const expectedAnswer = "I would align stakeholders, define critical path, and communicate early.";
  const candidateAnswer = "I would align stakeholders and define the critical path for our team.";

  const originalFetch = global.fetch;
  global.fetch = async () => new Response(JSON.stringify({
    message: {
      content: JSON.stringify({
        score: 82,
        competencies: { communication: 82, problemSolving: 80, accountability: 84 },
        evidence: ["align stakeholders"],
        strengths: ["Clear coordination"],
        improvements: ["Confirm owners"],
        criterionEvaluations: [
          { competency: "communication", score: 82, evidence: ["align stakeholders"], missingEvidence: [], rationale: "Communicated with stakeholders." },
          { competency: "problemSolving", score: 80, evidence: ["define the critical path"], missingEvidence: [], rationale: "Identified delivery path." },
          { competency: "accountability", score: 84, evidence: ["for our team"], missingEvidence: [], rationale: "Took ownership." }
        ]
      })
    }
  }), { status: 200, headers: { "Content-Type": "application/json" } });

  try {
    const evaluation = await evaluateWorkplaceAnswer(customQuestion, candidateAnswer, expectedAnswer);
    assert.equal(evaluation.score, 82);
    assert.equal(evaluation.exampleStrongResponse, expectedAnswer);
    assert.ok(evaluation.competencies.communication >= 80);
  } finally {
    global.fetch = originalFetch;
  }
});

test("normalizeEvaluationPayload normalizes stringified numbers, array wrapping, and casing without fabricating data", () => {
  const raw = {
    score: "78",
    competencies: {
      communication: "78",
      collaboration: "80",
      unrequestedCompetency: 99,
    },
    evidence: "I would clarify the requirements",
    strengths: "Listens well",
    improvements: "Confirm timeline",
    criterionEvaluations: [
      { competency: "Communication", score: "78", evidence: "clarify the requirements", missingEvidence: [], rationale: "Good communication" },
      { competency: "collaboration", score: "80", evidence: ["with teammates"], missingEvidence: "none", rationale: "Team player" },
    ],
  };

  const normalized = normalizeEvaluationPayload(raw, ["communication", "collaboration"]);
  assert.equal(isSemanticEvaluation(normalized, ["communication", "collaboration"]), true);
  assert.equal(normalized.score, 78);
  assert.equal(normalized.competencies.communication, 78);
  assert.equal(normalized.competencies.collaboration, 80);
  assert.equal(normalized.competencies.unrequestedCompetency, undefined);
  assert.deepEqual(normalized.evidence, ["I would clarify the requirements"]);
  assert.deepEqual(normalized.strengths, ["Listens well"]);
  assert.deepEqual(normalized.improvements, ["Confirm timeline"]);

  // Must not fabricate missing required fields
  const missingCriterion = { ...raw, criterionEvaluations: [raw.criterionEvaluations[0]] };
  const normalizedMissing = normalizeEvaluationPayload(missingCriterion, ["communication", "collaboration"]);
  assert.equal(isSemanticEvaluation(normalizedMissing, ["communication", "collaboration"]), false);

  // Must not accept out of range scores
  const outOfRange = { ...raw, score: "150" };
  const normalizedOutOfRange = normalizeEvaluationPayload(outOfRange, ["communication", "collaboration"]);
  assert.equal(isSemanticEvaluation(normalizedOutOfRange, ["communication", "collaboration"]), false);
});

test("getEvaluationValidationError produces descriptive reasons for schema failures", () => {
  assert.ok(getEvaluationValidationError(null, ["communication"]).includes("not a JSON object"));
  assert.ok(getEvaluationValidationError({ score: -5 }, ["communication"]).includes("overall score"));
  assert.ok(getEvaluationValidationError({ score: 50, competencies: {} }, ["communication"]).includes("Competency 'communication' is missing"));
  assert.ok(getEvaluationValidationError({
    score: 50,
    competencies: { communication: 50, planning: 50 },
    evidence: [],
    strengths: [],
    improvements: [],
    criterionEvaluations: []
  }, ["communication"]).includes("Unexpected unrequested competencies"));
});

test("evaluateWithOllama recovers via a single bounded retry if the first attempt fails schema validation", async () => {
  const scenario = SCENARIOS.find((item) => item.id === "team-1");
  const answer = "I would ask what is blocking the work, agree priorities, offer help, and notify the lead early.";
  let callCount = 0;

  const validPayload = {
    score: 80,
    competencies: Object.fromEntries(scenario.competencies.map((key) => [key, 80])),
    evidence: ["ask what is blocking the work"],
    strengths: ["Proactive"],
    improvements: ["Timeline check"],
    criterionEvaluations: scenario.competencies.map((competency) => ({
      competency,
      score: 80,
      evidence: ["ask what is blocking the work"],
      missingEvidence: [],
      rationale: "Shows initiative.",
    })),
  };

  const originalFetch = global.fetch;
  global.fetch = async (_url, init) => {
    callCount++;
    if (callCount === 1) {
      // First attempt outputs malformed response with missing criterion evaluations
      return new Response(JSON.stringify({
        message: { content: JSON.stringify({ score: 80, competencies: { collaboration: 80 } }) }
      }), { status: 200, headers: { "Content-Type": "application/json" } });
    }
    // Second attempt (retry) outputs valid schema
    return new Response(JSON.stringify({
      message: { content: JSON.stringify(validPayload) }
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  try {
    const result = await evaluateWithOllama(scenario, answer);
    assert.equal(callCount, 2);
    assert.equal(result.score, 80);
    assert.equal(result.evaluator, "ollama-workplace-evaluator-v1");
  } finally {
    global.fetch = originalFetch;
  }
});

test("evaluateWithOllama strictly throws after bounded retry if schema remains invalid", async () => {
  const scenario = SCENARIOS.find((item) => item.id === "team-1");
  const answer = "I would ask what is blocking the work, agree priorities, offer help, and notify the lead early.";
  let callCount = 0;

  const originalFetch = global.fetch;
  global.fetch = async () => {
    callCount++;
    return new Response(JSON.stringify({
      message: { content: JSON.stringify({ score: 80, competencies: {} }) }
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  try {
    await assert.rejects(
      () => evaluateWithOllama(scenario, answer),
      /Ollama output failed evaluation schema validation; no score was saved\./
    );
    assert.equal(callCount, 2); // 1 initial + 1 retry = 2 calls max
  } finally {
    global.fetch = originalFetch;
  }
});

