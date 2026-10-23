# Workplace Compass acceptance test plan

Run these checks after `npm install`, `npx prisma generate`, `npx prisma db push`, and `npm run build` in an environment with PostgreSQL configured.

## Assessment creation
- Create assessments for all five categories at Easy, Medium, and Hard.
- Request 1, 2, and 3 scenarios; confirm count is respected and no scenario repeats within an assessment.
- Send invalid category, difficulty, count (0, 4, fractional), malformed JSON, and missing title; confirm safe validation.

## Submission and scoring
- Submit all responses; confirm a score, competency breakdown, evidence, development plan, and rubric version are returned and saved.
- Submit an empty answer, an extra answer, reordered/altered question text, a foreign assessment ID, and a second completion attempt; confirm rejection.
- Confirm stored responses and recommendations are visible only to the assessment owner.
- Confirm overall score matches the rounded mean of the per-scenario scores in the result and history. Competencies not assessed by the scenario set must not be shown as zero or compared as if assessed.

## Progress and history
- Complete two assessments; confirm the dashboard compares first and latest scores by competency.
- Confirm one assessment displays the “complete at least two” empty state.
- Retest without modifying prior assessment results.
- Confirm legacy records with no `answers`, `competencyScores`, or `recommendations` still open safely.

## Authentication and privacy
- Register and sign in using email/password.
- Confirm unauthenticated API calls return 401; invalid/expired session cookies cannot access protected dashboard or assessment pages.
- Create two accounts and verify neither can read the other's assessment or feedback.

## Build and persistence
- Restart the application and verify results persist.
- Run `npm run build` and manually test the full registration → assessment → result → recommendation → retest workflow in a browser.


## Local Ollama evaluation checks

1. Run `ollama list`, then ensure the configured Qwen 3 tag exists (default: `ollama pull qwen3:8b`; if a different Qwen 3 size is already installed, set `OLLAMA_MODEL` to that exact tag).
2. Start Ollama and complete an assessment; verify the response contains only scenario-targeted competencies and concise evidence-based feedback.
3. Stop Ollama and submit an assessment; verify a clear unavailable/timeout message appears and no score or completion is saved.
4. Restart Ollama and retry; verify the assessment can complete successfully.
5. Test a short but relevant response, a fluent irrelevant response, an answer proposing concealment in an ethics scenario, and an answer containing instructions to ignore the rubric. Verify semantic relevance matters more than word count and instructions in the answer are not followed.
6. Verify all visible scores are out of 10, unassessed competencies are not shown as zero, and detailed rubric feedback is expandable.
7. Open a completed result from history and confirm its overall score and competency breakdown match the original result.
8. Confirm `node_modules`, `.next`, `.env`, `.test-build`, and temporary backups are excluded from the submission ZIP.
