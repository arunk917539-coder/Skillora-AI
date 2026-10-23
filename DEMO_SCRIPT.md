# Workplace Compass — 5-Minute Demo Script

## Before the demo
- Confirm the app starts and the configured PostgreSQL database is reachable.
- Use a prepared demo account or register one before the judging slot.
- Confirm at least one completed assessment appears in history.
- Keep this project README and the limitations note available for questions.
- Do not use real employee names or confidential workplace details in the demo.

## 0:00–0:40 — Problem and solution
"The Nexathon workplace-assessment problem asks for structured workplace situations, responses, behavioural insights, and suitable training. Workplace Compass turns that into a repeatable practice loop: scenario, response, explainable feedback, development activity, and retest."

## 0:40–1:20 — Create an assessment
- Open the dashboard.
- Choose a category such as Conflict Resolution or Ethical Decision-Making.
- Select a difficulty and scenario count.
- Explain that scenarios and rubrics are curated locally; evaluation uses a local Ollama model and no hosted AI API key.

## 1:20–2:20 — Answer a scenario
- Read the scenario aloud.
- Enter a response that explains actions, reasoning, stakeholders, accountability, and follow-up.
- Submit the assessment.

## 2:20–3:20 — Explain the result
- Show the overall score and five competency dimensions.
- Explain that the rubric looks for transparent text signals and response structure.
- Open the development plan and show how a weaker competency maps to concrete practice actions.
- State clearly that this is a practice rubric, not a validated employee evaluation.

## 3:20–4:10 — History and improvement
- Open assessment history.
- Show the saved result and recommendations.
- If two comparable completed assessments are available, show the progress comparison. Otherwise explain the empty state and create a second assessment if time allows.

## 4:10–5:00 — Technical design and responsible use
"The stack is Next.js, TypeScript, Prisma, and PostgreSQL. The workflow uses local Ollama inference and scenario-specific rubric criteria. We prioritise explainability and learning, and would never use these scores as an automated HR decision. The next validation steps are real-user testing, rubric validation, bias review, and security/privacy review."

## Demo recovery plan
- If the database fails, do not pretend the workflow is working. Explain the configured persistence architecture and use screenshots only if they are clearly labelled as screenshots, not live data.
- If no progress data exists, use the empty state honestly instead of fabricating results.
- If an API error appears, capture it and explain that the live workflow needs troubleshooting; do not claim end-to-end success.
