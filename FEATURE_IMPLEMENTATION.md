# Workplace Compass feature implementation notes

## Implemented in this revision
- Central local scenario library: `app/lib/workplace/scenarios.ts`.
- Scenario-aware local Ollama evaluation and per-response evidence: `app/lib/workplace/ollama-evaluator.ts`, `evaluation-service.ts`, and `scenarios.ts`.
- Competency-specific development actions: `app/lib/workplace/development-plans.ts`.
- Historical score comparison helper: `app/lib/workplace/progress.ts`.
- Development plan UI: `app/components/dashboard/development-plan.tsx`.
- Dashboard first-versus-latest comparison: `app/components/dashboard/assessment-improvement.tsx`.
- Completion API stores response details, competency scores, recommendations and rubric version in the existing feedback model.
- History feedback dialog shows score and recommendations.
- Prisma feedback model has optional fields for new result data; existing records remain compatible after schema sync.

## Important constraints
- Existing route and Prisma model names are retained to protect imports and existing user history.
- AI evaluation is a practice aid, not validated HR/psychometric science.
- This environment did not have project dependencies or a configured PostgreSQL database available. The production build, Prisma generation/database sync and browser end-to-end flow must be run locally using the acceptance checklist.
