const test = require("node:test");
const assert = require("node:assert/strict");

function formatElapsed(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${String(hrs).padStart(2, "0")}:${String(remMins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getStatus(seconds, scenarioCount) {
  if (seconds < 25) {
    return {
      headline: "Analysing your responses",
      subline: "Your answers are being analysed against workplace competency rubrics.",
      detail: `Evaluating ${scenarioCount} scenario${scenarioCount > 1 ? "s" : ""} sequentially with local Ollama AI (qwen3:4b).`,
    };
  }
  if (seconds < 60) {
    return {
      headline: "Extracting behavioural evidence",
      subline: "Identifying concrete decision points, stakeholder actions, and problem-solving steps.",
      detail: "Rubric-guided scoring active across communication, accountability, and planning.",
    };
  }
  if (seconds < 120) {
    return {
      headline: "Synthesising rubric feedback",
      subline: "Formulating formative strengths, development priorities, and actionable next steps.",
      detail: "Local AI inference is running thorough rubric checks. Thank you for your patience.",
    };
  }
  return {
    headline: "Finalising evaluation results",
    subline: "Evaluation is taking longer than usual, but local AI is actively processing.",
    detail: "Inference duration varies by response length and host hardware. Please keep this page open.",
  };
}

test("timer formatElapsed handles 00:00 initial state", () => {
  assert.equal(formatElapsed(0), "00:00");
});

test("timer formatElapsed correctly formats seconds and minutes without drift", () => {
  assert.equal(formatElapsed(1), "00:01");
  assert.equal(formatElapsed(9), "00:09");
  assert.equal(formatElapsed(10), "00:10");
  assert.equal(formatElapsed(59), "00:59");
  assert.equal(formatElapsed(60), "01:00");
  assert.equal(formatElapsed(84), "01:24");
  assert.equal(formatElapsed(3599), "59:59");
});

test("timer formatElapsed formats multi-hour intervals in HH:MM:SS format", () => {
  assert.equal(formatElapsed(3600), "01:00:00");
  assert.equal(formatElapsed(3665), "01:01:05");
});

test("evaluation progress transitions through realistic milestones without fabricated percentages", () => {
  const early = getStatus(5, 3);
  assert.equal(early.headline, "Analysing your responses");
  assert.ok(early.detail.includes("3 scenarios"));
  assert.ok(!early.subline.includes("%"), "Must not use fake progress percentages");

  const mid = getStatus(35, 3);
  assert.equal(mid.headline, "Extracting behavioural evidence");
  assert.ok(!mid.detail.includes("%"), "Must not use fake progress percentages");

  const extended = getStatus(75, 3);
  assert.equal(extended.headline, "Synthesising rubric feedback");
  assert.ok(extended.detail.includes("Thank you for your patience"));

  const deep = getStatus(130, 3);
  assert.equal(deep.headline, "Finalising evaluation results");
  assert.ok(deep.detail.includes("Please keep this page open"));
});

test("prevent duplicate submissions guard logic operates synchronously", () => {
  let isSubmitting = false;
  let submissionCount = 0;

  function handleTrigger() {
    if (isSubmitting) return false;
    isSubmitting = true;
    submissionCount++;
    return true;
  }

  assert.equal(handleTrigger(), true);
  assert.equal(handleTrigger(), false);
  assert.equal(handleTrigger(), false);
  assert.equal(submissionCount, 1);

  isSubmitting = false;
  assert.equal(handleTrigger(), true);
  assert.equal(submissionCount, 2);
});
