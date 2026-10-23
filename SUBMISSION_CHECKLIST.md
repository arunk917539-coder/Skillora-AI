# Nexathon Submission Checklist

## Project and problem fit
- [ ] Confirm the team is entering the relevant Nexathon track/problem statement.
- [ ] Explain the problem, target user, scenario-to-feedback workflow and intended impact.
- [ ] Clearly disclose this as an adaptation of an existing technical foundation; do not claim all inherited code is original.
- [ ] Verify upstream licence and asset terms before public redistribution.

## Environment and build (complete on the demo PC)
- [ ] Install Node.js 20+ and Docker Desktop or configure PostgreSQL another way.
- [ ] Copy `.env.example` to `.env` and replace the local placeholder secret.
- [ ] Start PostgreSQL using `docker compose up -d db`, or confirm the configured database is available.
- [ ] Run `npm ci` (or `npm install` if the lockfile cannot be used).
- [ ] Run `npx prisma generate`.
- [ ] Back up any existing database, then run `npx prisma db push`.
- [ ] Run `npm run test:workplace`.
- [ ] Run `npm run build` and fix all errors before judging.
- [ ] Run `npm run dev` and complete the browser acceptance test.

## Live acceptance test
- [ ] Register and log in with email/password.
- [ ] Create assessments for all categories and available difficulty settings.
- [ ] Submit responses and inspect scores, evidence, strengths, and recommendations.
- [ ] Confirm results persist after a restart.
- [ ] Confirm history is newest-first and old records open safely.
- [ ] Confirm a user cannot access another user's assessment.
- [ ] Complete two comparable assessments and verify the progress state.
- [ ] Confirm Ollama is installed, the configured local model is pulled, and no hosted AI API key is required.

## Presentation
- [ ] Use `DEMO_SCRIPT.md` and `JUDGING_ALIGNMENT.md`.
- [ ] Do not use real or confidential employee information.
- [ ] Do not claim validated psychological/HR scoring.
- [ ] Have a recovery plan if network/database access fails.
