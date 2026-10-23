# Architecture Overview

## Request and data flow

```text
Browser UI
  ├── Registration / login
  ├── Dashboard and assessment history
  └── Scenario response UI
          │
          ▼
Next.js server actions and route handlers
  ├── Authentication and ownership checks
  ├── Scenario selection (local scenario bank)
  ├── Deterministic rubric scoring
  └── Development recommendation mapping
          │
          ▼
Prisma ORM
          │
          ▼
PostgreSQL
  ├── User
  ├── Interview (retained legacy model name for compatibility)
  └── InterviewFeedback (retained legacy model name for compatibility)
```

## Main code locations

- `app/lib/workplace/scenarios.ts` — scenario definitions, categories, difficulty and selection.
- `app/lib/workplace/scoring.ts` — rubric version, response scoring and competency averages.
- `app/lib/workplace/development-plans.ts` — competency-to-practice-action mapping.
- `app/lib/workplace/progress.ts` — comparable-result calculations.
- `app/lib/workplace/safe-json.ts` — defensive parsing of optional historical JSON fields.
- `app/api/interview/create/route.ts` — authenticated assessment creation API.
- `app/api/interview/complete/route.ts` — answer validation, scoring and persistence.
- `app/api/interview/get/[id]/route.ts` and `app/api/interview/getall/route.ts` — authorised result/history retrieval.
- `prisma/schema.prisma` — persistent data model.

## Design decisions
- Existing `Interview` and `InterviewFeedback` model names are retained to reduce compatibility risk with the inherited codebase. The user-facing product is Workplace Compass.
- Scenario rubrics are curated locally. Assessment evaluation calls a local Ollama model through a server-only evaluator service; the Next.js build does not require the model to be online.
- `rubricVersion` identifies the scoring-rule version so results from different rubric versions can be excluded from direct comparison.
- Historical records may not contain the optional answer/recommendation fields introduced by this adaptation; the UI must handle those fields safely.

## Security and privacy boundaries
- Assessment APIs require an authenticated user and must scope data reads/writes to that user's ID.
- `.env` secrets and database credentials must not be committed.
- Use test data in demonstrations. Do not store real employee data without a clear legal basis, consent/notice, access controls, retention policy, and appropriate organisational review.
