# Workplace Compass — Nexathon 2026

A local-first workplace scenario practice prototype aligned with Nexathon’s “AI-Based Employee Behaviour & Workplace Assessment” problem statement. It presents structured workplace situations, collects written responses, evaluates them with a local Ollama model against scenario-specific criteria, and suggests targeted practice activities.

> **Important:** Ollama feedback is AI-generated practice guidance and may be incorrect or inconsistent. It is not a validated psychological, clinical, hiring, or employee-performance assessment. Do not use its scores as the sole basis for employment decisions.

## Features

- Email/password registration and sign-in.
- Curated scenarios across Communication, Teamwork, Conflict Resolution, Ethical Decision-Making, and Prioritization.
- Difficulty and scenario-count selection.
- Written responses with competency breakdown, evidence signals, strengths, and development areas.
- Competency-linked development activities.
- Saved assessment history and comparable-result progress view.
- Local Ollama-based semantic evaluation; no paid hosted generative-AI API key is required.
- Per-scenario criteria, evidence-based feedback, example strong-response frameworks, and explicit model-unavailable errors (no silent keyword-score fallback).

## Stack

- Next.js 15, React 19, TypeScript
- NextAuth credentials authentication
- Prisma ORM and PostgreSQL
- Tailwind CSS and Recharts

## Quick start (Windows, macOS, or Linux)

### 1. Requirements

- Node.js 20+ and npm
- Docker Desktop with Compose **or** an independently configured PostgreSQL server

### 2. Configure local environment

Copy `.env.example` to `.env`. The values are local development defaults; replace `AUTH_SECRET` with a long random secret. Do not commit `.env`. If you change the PostgreSQL username/password/database, update `DATABASE_URL` to match.

### 3. Start PostgreSQL (Docker option)

```bash
docker compose up -d db
```

If port 5432 is already in use, configure another port and update `DATABASE_URL`. To stop the database container without deleting data, use `docker compose stop db`. To delete the database volume, `docker compose down -v` is destructive and should only be used when you intentionally want to remove local data.

### 4. Install, generate schema client, and initialise the database

```bash
npm ci --legacy-peer-deps
npx prisma generate
npx prisma db push
```

Back up any existing database before synchronising schema changes. `db push` is convenient for this prototype; use reviewed Prisma migrations before production deployment.

### 5. Install and run the local evaluator

Install Ollama from its official website, then pull Qwen 3 (use the exact tag shown by `ollama list` if you already have another Qwen 3 size installed):

```bash
ollama pull qwen3:8b
ollama serve
```

Ollama commonly runs at `http://127.0.0.1:11434`. The default model is `qwen3:8b`; check `ollama list` and set `OLLAMA_MODEL` to your exact installed Qwen 3 tag (for example, `qwen3:4b`) in `.env` if yours differs. Qwen 3 thinking output is disabled for this structured JSON evaluation request. Configure `OLLAMA_BASE_URL` and `OLLAMA_TIMEOUT_MS` if needed. The model is called only during assessment evaluation; the Next.js production build does not require Ollama to be online. If Ollama is unavailable or returns invalid output, the app reports an error and does not silently save a keyword-based score.

### 6. Run tests and start the app

```bash
npm run test:workplace
npm run lint
npm run dev
```

Open `http://localhost:3000`, register an account, sign in, and create an assessment. To verify a production build, stop the development server and run:

```bash
npm run build
npm run start
```

## Project documentation

- `SUBMISSION_BRIEF.md` — problem, audience, workflow, scope and honest claims.
- `ARCHITECTURE.md` — code/data flow and design decisions.
- `JUDGING_ALIGNMENT.md` — mapping to the brochure’s published judging criteria.
- `DEMO_SCRIPT.md` — suggested five-minute live demonstration.
- `SUBMISSION_CHECKLIST.md` — pre-demo and submission checklist.
- `THIRD_PARTY_NOTICES.md` — upstream attribution and licence review notes.
- `tests/workplace/ACCEPTANCE_TEST_PLAN.md` — manual end-to-end checks.
- `FULL_APP_READINESS_REPORT.md` — scope and verification status from the latest audit.

## Core code map

- `app/lib/workplace/scenarios.ts` — curated scenarios and selection.
- `app/lib/workplace/scenarios.ts` — curated scenarios, rubric criteria, example response frameworks, and difficulty-safe selection.
- `app/lib/workplace/scoring.ts` — shared score types and explicitly legacy deterministic test helper.
- `app/lib/workplace/ollama-evaluator.ts` — server-side local Ollama client and output validation.
- `app/lib/workplace/evaluation-service.ts` — scenario-aware evaluator orchestration.
- `app/lib/workplace/evaluator-types.ts` — validated evaluator response contract.
- `app/lib/workplace/development-plans.ts` — competency-linked practice activities.
- `app/lib/workplace/progress.ts` — comparable-result calculations.
- `app/api/interview/create/route.ts` — assessment creation.
- `app/api/interview/complete/route.ts` — answer validation, scoring and persistence.
- `prisma/schema.prisma` — database schema.

The internal route and Prisma model names retain legacy “interview” terminology for compatibility; the user-facing product is Workplace Compass.

## Privacy, security, and responsible use

- Use fictional or consented test data for demonstrations.
- Keep `.env` and database credentials private.
- The database operator is responsible for backups, access control, retention and deletion.
- This prototype is not production security/privacy certified. Review authentication, rate limits, accessibility, data retention and applicable privacy obligations before deployment.
- Do not use these scores as automated employment decisions.

## Attribution and licensing

This is an adaptation of the TakeInt AI Interview Platform source archive supplied for this project. The supplied archive did not include a root `LICENSE` file in the files inspected. Verify the upstream repository’s current licence and comply with applicable source and asset terms before redistribution. See `THIRD_PARTY_NOTICES.md`. This project does not claim ownership of the upstream code.
