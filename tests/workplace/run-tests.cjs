const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { SCENARIOS, CATEGORIES, selectScenarios } = require("../../.test-build/scenarios.js");
const { isSemanticEvaluation, normalizeEvaluationPayload, getEvaluationValidationError } = require("../../.test-build/evaluator-types.js");
const { evaluateWithOllama, extractJsonContent, normalizeForEvidenceCheck, buildEvaluationMessages, isNonResponsiveAnswer, detectEvaluationContradiction } = require("../../.test-build/ollama-evaluator.js");
const { evaluateWorkplaceAnswer } = require("../../.test-build/evaluation-service.js");
const { parseHrScenarioCriteria, serializeHrScenarioCriteria } = require("../../.test-build/hr-criteria.js");
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
  assert.equal(selectScenarios("Communication", 100).length, 5);
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

test("scenario selection supports up to 5 scenarios across categories without duplicates", () => {
  for (const category of CATEGORIES) {
    const rows = selectScenarios(category, 5);
    assert.equal(rows.length, 5);
    assert.equal(new Set(rows.map((r) => r.id)).size, 5);
    assert.ok(rows.every((r) => r.category === category));
  }
});

test("HR scenario criteria parser correctly envelopes rich criteria with versioning and archive state", () => {
  const criteria = {
    version: 2,
    expectedAnswer: "Align stakeholders, establish timeline, and communicate early.",
    contextInstructions: "Tight budget constraint.",
    requiredConcepts: ["stakeholder alignment", "early communication"],
    acceptableAlternatives: ["phased release"],
    criticalErrors: ["concealing the delay"],
    scoringGuidance: "Award high score only if early communication is explicitly mentioned.",
    isArchived: true,
  };

  const serialized = serializeHrScenarioCriteria(criteria);
  const parsed = parseHrScenarioCriteria(serialized);

  assert.equal(parsed.version, 2);
  assert.equal(parsed.expectedAnswer, criteria.expectedAnswer);
  assert.equal(parsed.contextInstructions, "Tight budget constraint.");
  assert.deepEqual(parsed.requiredConcepts, ["stakeholder alignment", "early communication"]);
  assert.deepEqual(parsed.acceptableAlternatives, ["phased release"]);
  assert.deepEqual(parsed.criticalErrors, ["concealing the delay"]);
  assert.equal(parsed.scoringGuidance, criteria.scoringGuidance);
  assert.equal(parsed.isArchived, true);
});

test("HR criteria parser gracefully handles plain text legacy answers", () => {
  const plainText = "Standard legacy answer string.";
  const parsed = parseHrScenarioCriteria(plainText);
  assert.equal(parsed.version, 1);
  assert.equal(parsed.expectedAnswer, plainText);
  assert.equal(parsed.isArchived, false);
  assert.deepEqual(parsed.requiredConcepts, []);
  assert.deepEqual(parsed.criticalErrors, []);
});

test("scoring heavily penalizes hostile or toxic responses", () => {
  const toxicAnswer = "I will never listen to the team because they are stupid and I will fire them all.";
  const result = scoreAnswer(toxicAnswer);
  assert.ok(result.score <= 15, `Expected score <= 15 for toxic answer, got ${result.score}`);
  assert.ok(result.evidence[0].includes("hostile, dismissive, or counter-productive"));
});

test("buildEvaluationMessages includes reference answer, required concepts, and critical errors in prompt", () => {
  const scenario = SCENARIOS.find((item) => item.id === "comm-med-1");
  assert.ok(scenario, "Scenario comm-med-1 must exist");

  const messages = buildEvaluationMessages(scenario, "I would communicate the delay early.");
  assert.equal(messages.length, 2);

  const systemMsg = messages[0].content;
  const userMsg = messages[1].content;

  assert.ok(systemMsg.includes("SEMANTIC ACCURACY OVER LENGTH"));
  assert.ok(systemMsg.includes("CRITICAL ERRORS"));
  assert.ok(userMsg.includes("Authoritative Reference Answer"));
  assert.ok(userMsg.includes(scenario.exampleStrongResponse));
  assert.ok(userMsg.includes("Required Essential Concepts"));
  assert.ok(userMsg.includes("Critical Errors / Unsafe Actions"));
});

test("isNonResponsiveAnswer identifies non-responsive and evasive filler answers", () => {
  assert.equal(isNonResponsiveAnswer("all is well"), true);
  assert.equal(isNonResponsiveAnswer("all is well."), true);
  assert.equal(isNonResponsiveAnswer("ok"), true);
  assert.equal(isNonResponsiveAnswer("OK!"), true);
  assert.equal(isNonResponsiveAnswer("I don't know"), true);
  assert.equal(isNonResponsiveAnswer("i dont know."), true);
  assert.equal(isNonResponsiveAnswer("idk"), true);
  assert.equal(isNonResponsiveAnswer("none"), true);
  assert.equal(isNonResponsiveAnswer("test"), true);

  // Substantive answers must not be flagged as non-responsive
  assert.equal(isNonResponsiveAnswer("I would immediately notify finance in writing and return the extra payment."), false);
  assert.equal(isNonResponsiveAnswer("I would thank the client and ask clarifying questions on scope."), false);
});

test("detectEvaluationContradiction flags high scores for non-responsive answers or zero evidence", () => {
  const contradictory = {
    score: 80,
    competencies: { communication: 80 },
    criterionEvaluations: [
      {
        competency: "communication",
        score: 80,
        evidence: [],
        missingEvidence: ["Acknowledge timeline empathetically"],
        rationale: "Candidate failed to address client expectations."
      }
    ]
  };

  const reasonNonResp = detectEvaluationContradiction(contradictory, "all is well");
  assert.ok(reasonNonResp && reasonNonResp.includes("non-responsive"), "Must flag non-responsive answer with score 80");

  const reasonZeroEvidence = detectEvaluationContradiction(contradictory, "A lengthy answer that nonetheless provides zero evidence.");
  assert.ok(reasonZeroEvidence && reasonZeroEvidence.includes("no demonstrated positive evidence"), "Must flag zero evidence with score 80");

  // Consistent evaluation must not be flagged
  const consistent = {
    score: 10,
    competencies: { communication: 10 },
    criterionEvaluations: [
      {
        competency: "communication",
        score: 10,
        evidence: [],
        missingEvidence: ["Everything"],
        rationale: "No relevant communication demonstrated."
      }
    ]
  };
  assert.equal(detectEvaluationContradiction(consistent, "all is well"), null);
});

test("evaluateWithOllama penalizes non-responsive answers like 'all is well' to <= 15", async () => {
  const scenario = SCENARIOS.find((item) => item.id === "comm-easy-3");
  const answer = "all is well";

  // Simulate an LLM that attempts to award 80 to "all is well"
  const flawedPayload = {
    score: 80,
    competencies: { communication: 80, problemSolving: 80 },
    evidence: ["all is well"],
    strengths: ["Short response"],
    improvements: ["Clarify requirements"],
    criterionEvaluations: [
      { competency: "communication", score: 80, evidence: ["all is well"], missingEvidence: ["Clarifying questions"], rationale: "Too vague" },
      { competency: "problemSolving", score: 80, evidence: ["all is well"], missingEvidence: ["Propose MVP"], rationale: "No problem solving" }
    ]
  };

  const originalFetch = global.fetch;
  let callCount = 0;
  global.fetch = async () => {
    callCount++;
    return new Response(JSON.stringify({ message: { content: JSON.stringify(flawedPayload) } }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  };

  try {
    const result = await evaluateWithOllama(scenario, answer);
    assert.ok(result.score <= 15, `Expected overall score <= 15 for 'all is well', got ${result.score}`);
    assert.ok(result.competencies.communication <= 15, `Expected communication <= 15, got ${result.competencies.communication}`);
    assert.ok(result.competencies.problemSolving <= 15, `Expected problemSolving <= 15, got ${result.competencies.problemSolving}`);
    assert.equal(result.evidence.length, 0, "Non-responsive answers must have 0 evidence");
    assert.equal(result.strengths.length, 0, "Non-responsive answers must have 0 strengths");
    assert.equal(result.meetsSubstantiveIntent, false);
    assert.equal(result.reviewRequired, true);
  } finally {
    global.fetch = originalFetch;
  }
});

test("evaluateWithOllama awards appropriate high credit to short but genuinely correct answers", async () => {
  const scenario = SCENARIOS.find((item) => item.id === "ethic-easy-1");
  const answer = "I would immediately notify finance in writing and return the extra payment.";

  const strongPayload = {
    score: 90,
    competencies: { accountability: 90 },
    evidence: ["notify finance in writing", "return the extra payment"],
    strengths: ["Immediate transparent notification", "Refuses unearned funds"],
    improvements: ["Keep a personal copy of transaction log"],
    criterionEvaluations: [
      {
        competency: "accountability",
        score: 90,
        evidence: ["notify finance in writing", "return the extra payment"],
        missingEvidence: [],
        rationale: "Exemplary personal accountability and proactive ethical remediation."
      }
    ]
  };

  const originalFetch = global.fetch;
  global.fetch = async () => new Response(JSON.stringify({ message: { content: JSON.stringify(strongPayload) } }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });

  try {
    const result = await evaluateWithOllama(scenario, answer);
    assert.ok(result.score >= 85, `Expected score >= 85 for correct response, got ${result.score}`);
    assert.ok(result.competencies.accountability >= 85);
    assert.ok(result.evidence.length >= 1);
  } finally {
    global.fetch = originalFetch;
  }
});

test("evaluateWithOllama handles partial responses with proportionate partial credit", async () => {
  const scenario = SCENARIOS.find((item) => item.id === "comm-easy-3");
  const answer = "I would ask the client for clarification on their requirements.";

  const partialPayload = {
    score: 45,
    competencies: { communication: 50, problemSolving: 40 },
    evidence: ["ask the client for clarification"],
    strengths: ["Asks clarifying questions"],
    improvements: ["Acknowledge tight timeline", "Propose rapid discovery call or MVP"],
    criterionEvaluations: [
      { competency: "communication", score: 50, evidence: ["ask the client for clarification"], missingEvidence: ["Acknowledge timeline"], rationale: "Clarifies requirements but misses empathy." },
      { competency: "problemSolving", score: 40, evidence: [], missingEvidence: ["Propose MVP"], rationale: "Lacks concrete delivery trade-offs." }
    ]
  };

  const originalFetch = global.fetch;
  global.fetch = async () => new Response(JSON.stringify({ message: { content: JSON.stringify(partialPayload) } }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });

  try {
    const result = await evaluateWithOllama(scenario, answer);
    assert.ok(result.score >= 35 && result.score <= 55, `Expected score between 35 and 55, got ${result.score}`);
    assert.ok(result.evidence.includes("ask the client for clarification"));
  } finally {
    global.fetch = originalFetch;
  }
});

test("HR question lifecycle supports draft, published, and archived statuses", () => {
  // Test Draft status
  const draftCriteria = {
    version: 1,
    expectedAnswer: "Align on delivery milestones with team.",
    status: "draft",
    isArchived: false,
    competencies: ["collaboration", "planning"],
  };
  const serializedDraft = serializeHrScenarioCriteria(draftCriteria);
  const parsedDraft = parseHrScenarioCriteria(serializedDraft);
  assert.equal(parsedDraft.status, "draft");
  assert.equal(parsedDraft.isArchived, false);
  assert.deepEqual(parsedDraft.competencies, ["collaboration", "planning"]);

  // Test Published status
  const publishedCriteria = {
    version: 2,
    expectedAnswer: "Proactively communicate deadline trade-offs.",
    status: "published",
    isArchived: false,
    competencies: ["communication", "problemSolving"],
  };
  const serializedPublished = serializeHrScenarioCriteria(publishedCriteria);
  const parsedPublished = parseHrScenarioCriteria(serializedPublished);
  assert.equal(parsedPublished.status, "published");
  assert.equal(parsedPublished.isArchived, false);
  assert.deepEqual(parsedPublished.competencies, ["communication", "problemSolving"]);

  // Test Archived status
  const archivedCriteria = {
    version: 3,
    expectedAnswer: "Legacy expected response.",
    status: "archived",
    isArchived: true,
  };
  const serializedArchived = serializeHrScenarioCriteria(archivedCriteria);
  const parsedArchived = parseHrScenarioCriteria(serializedArchived);
  assert.equal(parsedArchived.status, "archived");
  assert.equal(parsedArchived.isArchived, true);

  // Backward compatibility: default status for unannotated payload is published
  const legacyPayload = JSON.stringify({ version: 1, expectedAnswer: "Legacy payload answer.", isArchived: false });
  const parsedLegacy = parseHrScenarioCriteria(legacyPayload);
  assert.equal(parsedLegacy.status, "published");
  assert.equal(parsedLegacy.isArchived, false);
});

test("evaluateWorkplaceAnswer with HR snapshot uses authored reference answer and competencies", async () => {
  const customQuestion = "A team member repeatedly misses deadlines due to undefined requirements. How do you intervene?";
  const hrSnapshot = serializeHrScenarioCriteria({
    version: 2,
    expectedAnswer: "Meet 1-on-1 to clarify scope, establish a RACI matrix, and schedule bi-weekly check-ins.",
    competencies: ["collaboration", "planning"],
    requiredConcepts: ["1-on-1 meeting", "clarify scope", "check-ins"],
  });
  const candidateAnswer = "I will schedule a 1-on-1 meeting to clarify scope and establish regular check-ins.";

  const mockPayload = {
    score: 88,
    competencies: { collaboration: 90, planning: 86 },
    evidence: ["schedule a 1-on-1 meeting to clarify scope"],
    strengths: ["Direct proactive resolution"],
    improvements: ["Consider RACI framework"],
    criterionEvaluations: [
      { competency: "collaboration", score: 90, evidence: ["schedule a 1-on-1 meeting to clarify scope"], missingEvidence: [], rationale: "Collaborative 1-on-1" },
      { competency: "planning", score: 86, evidence: ["establish regular check-ins"], missingEvidence: [], rationale: "Planning structured check-ins" },
    ],
  };

  const originalFetch = global.fetch;
  global.fetch = async () => new Response(JSON.stringify({ message: { content: JSON.stringify(mockPayload) } }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  try {
    const result = await evaluateWorkplaceAnswer(customQuestion, candidateAnswer, hrSnapshot);
    assert.equal(result.score, 88);
    assert.equal(result.exampleStrongResponse, "Meet 1-on-1 to clarify scope, establish a RACI matrix, and schedule bi-weekly check-ins.");
    assert.equal(result.competencies.collaboration, 90);
    assert.equal(result.competencies.planning, 86);
  } finally {
    global.fetch = originalFetch;
  }
});

test("evaluateWorkplaceAnswer rejects missing reference answer safely", async () => {
  const customQuestion = "Some unknown situation";
  const emptySnapshot = serializeHrScenarioCriteria({
    version: 1,
    expectedAnswer: "",
  });

  await assert.rejects(
    async () => {
      await evaluateWorkplaceAnswer(customQuestion, "Some answer", emptySnapshot);
    },
    { message: /Authoritative reference answer is missing/ }
  );
});




