# Skillora AI — System Architecture & Technical Simulator Reference

> **Authoritative Technical Documentation & Hackathon Presentation Reference**  
> Verified against repository source code on Next.js 15.2.4, React 19, TypeScript, PostgreSQL, Prisma 6.6, and local Ollama (`qwen3:4b`).

---

## 1. Discovered Stack & Configuration

| Layer | Discovered Technology | Version / Configuration | Verified Source File |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js App Router | `15.2.4` | `package.json` |
| **UI Library** | React & React DOM | `19.0.0` | `package.json` |
| **Styling** | Tailwind CSS & TW Animate | `4.0.0` / `@tailwindcss/postcss 4.1.3` | `package.json`, `app/globals.css` |
| **Database** | PostgreSQL | Port `5433` (Relational) | `prisma/schema.prisma` |
| **ORM** | Prisma Client | `6.6.0` | `prisma/prisma.ts` |
| **Authentication** | NextAuth.js | `5.0.0-beta.25` (JWT strategy) | `app/(auth-pages)/auth.ts` |
| **Password Security** | Bcrypt | `5.1.1` (10 salt rounds) | `app/lib/users.ts` |
| **AI Runtime** | Local Ollama Daemon | `http://127.0.0.1:11434` (Zero Cloud) | `app/lib/workplace/ollama-evaluator.ts` |
| **LLM Model** | Qwen 3 (4B Parameters) | `qwen3:4b` (`process.env.OLLAMA_MODEL`) | `app/lib/workplace/ollama-evaluator.ts` |
| **Validation** | Zod | `3.24.2` | `package.json` |
| **Rate Limiter** | Sliding Window In-Memory | 6 req/min/user (Eval), 5 req/5min (Signup) | `app/lib/security/rate-limiter.ts` |

---

## 2. Component Topology (Layer A to Layer E)

### Layer A — Frontend Client
* **`FE_AUTH_PAGES`** (`app/(pages)/(auth-pages)/signup/page.tsx, login/page.tsx`):
  * *Tech*: React 19, `useActionState`, Tailwind CSS 4.
  * *Responsibility*: Renders credentials form, manages client validation feedback, dispatches Server Actions.
* **`FE_DASHBOARD`** (`app/(pages)/(dashboard-pages)/dashboard/page.tsx, layout.tsx`):
  * *Tech*: Next.js 15 Server Components, Radix Tabs, Recharts.
  * *Responsibility*: Evaluates `isAuthorizedHr()`, syncs active tab with `/dashboard?tab=...`, renders radar competency charts.
* **`FE_BUILDER`** (`app/components/dashboard/create-interview-form.tsx`):
  * *Tech*: React 19 Client Component, Radix Select, Sonner Toast.
  * *Responsibility*: Configures scenario count (1–5), difficulty, and question source (Curated vs. HR Question Bank).
* **`FE_INTERVIEW_VIEW`** (`app/components/interview/interview-content.tsx`):
  * *Tech*: React 19, Next.js Dynamic Route `/interview/[id]`.
  * *Responsibility*: Presents scenarios sequentially, captures written responses, prevents duplicate submissions.
* **`FE_EVAL_TIMER`** (`app/components/interview/evaluation-progress.tsx`):
  * *Tech*: Fixed `z-[100]` Modal Overlay, ARIA live regions, `motion-reduce:animate-none`.
  * *Responsibility*: Shows real-time running timer starting at `00:00` from `Date.now() - startTime` with honest completion notices.

### Layer B — Authentication & Access Control
* **`AUTH_NEXTAUTH`** (`app/(auth-pages)/auth.ts, auth.config.ts`):
  * *Tech*: NextAuth 5 Beta, PrismaAdapter, JWT session strategy.
  * *Responsibility*: Credentials authorization via `compareHash()`, JWT token signing, role assignment.
* **`AUTH_HR_GUARD`** (`app/lib/workplace/hr-authorization.ts`):
  * *Tech*: Multi-source RBAC.
  * *Responsibility*: Single source of truth: user is HR if database role is `'hr'` OR email is in `process.env.HR_EMAILS`.
* **`AUTH_SECURITY`** (`app/lib/security/rate-limiter.ts, audit-logger.ts`):
  * *Tech*: Sliding window in-memory limiter, structured audit logging.
  * *Responsibility*: Prevents brute-force signup and GPU queue exhaustion; logs security events without passwords or full answers.

### Layer C — Backend Actions & API Endpoints
* **`BE_SIGNUP_ACTION`** (`app/(auth-pages)/lib/form-actions.ts, app/lib/users.ts`):
  * *Responsibility*: Validates registration schema, checks existing email, hashes password with Bcrypt, creates `User`.
* **`BE_ASSESSMENT_ACTION`** (`app/lib/form-actions.ts`):
  * *Responsibility*: Parses builder parameters, loads curated or published HR scenarios, inserts `Interview` row.
* **`BE_COMPLETE_API`** (`app/api/interview/complete/route.ts`):
  * *Responsibility*: Pre-persists answers with status `'evaluating'`, runs sequential Ollama evaluation, atomic `$transaction`.
* **`BE_HISTORY_API`** (`app/api/interview/getall/route.ts, get/[id]/route.ts`):
  * *Responsibility*: Returns assessments joined with `InterviewFeedback`, strictly scoped to authenticated user ID.

### Layer D — Data & Persistence
* **`DB_PRISMA`** (`prisma/prisma.ts, schema.prisma`):
  * *Responsibility*: Type-safe query engine for PostgreSQL.
* **`DB_POSTGRES`** (`PostgreSQL on Port 5433`):
  * *Models*: `User`, `Account`, `Interview`, `InterviewFeedback`, `HrQuestion`.

### Layer E — Local AI Evaluation Pipeline
* **`AI_EVAL_SERVICE`** (`app/lib/workplace/evaluation-service.ts`):
  * *Responsibility*: Unpacks scenario criteria snapshot and dispatches prompt assembly.
* **`AI_PROMPT_BUILDER`** (`app/lib/workplace/ollama-evaluator.ts`):
  * *Responsibility*: Formulates system & user prompts enforcing JSON-only output with zero score anchoring.
* **`AI_OLLAMA_RUNTIME`** (`http://127.0.0.1:11434/api/chat`):
  * *Responsibility*: Runs local Qwen3:4b model inference without cloud transmission.
* **`AI_VALIDATOR`** (`app/lib/workplace/evaluator-types.ts, ollama-evaluator.ts`):
  * *Responsibility*: Strips `<think>` tags, validates JSON schema, triggers single bounded retry on malformed outputs.
* **`AI_SCORING_ENGINE`** (`app/lib/workplace/scoring.ts, ollama-evaluator.ts`):
  * *Responsibility*: Verifies evidence quotes against candidate text, caps non-responsive filler answers (e.g. `'all is well'` &le; 15).
* **`AI_DEV_PLANS`** (`app/lib/workplace/development-plans.ts`):
  * *Responsibility*: Translates weakest competency scores into prioritized professional development actions.

---

## 3. The Five Verified End-to-End Scenarios

### Scenario 1: Student Signs Up
1. Student fills form on `/signup` (`fe_auth_pages`).
2. Browser dispatches `FormData` to `handleSignUpUser` Server Action (`be_signup_action`).
3. Rate limiter checks `checkRateLimit('signup:${email}', 5, 5min)` (`auth_security`).
4. Schema validated with `signUpFormSchema`; queries `getUserByEmail()` (`db_prisma`).
5. Password hashed using `bcrypt.hash(password, 10)` (`be_signup_action`).
6. User row inserted into PostgreSQL with `role: 'user'` (`db_postgres`).
7. `logSecurityEvent('AUTH_SIGNUP_SUCCESS')` records domain (`auth_security`).
8. Client receives `{ success: true }` and navigates to `/login` (`fe_auth_pages`).

### Scenario 2: User Logs In & Opens Dashboard
1. User enters credentials on `/login` (`fe_auth_pages`).
2. NextAuth `Credentials.authorize()` calls `getUserByEmail()` (`auth_nextauth`).
3. Bcrypt verifies hash with `compareHash()` (`auth_nextauth`).
4. NextAuth `jwt` and `session` callbacks evaluate `HR_EMAILS` to assign `'hr'` role (`auth_hr_guard`).
5. Client receives session cookie and pushes to `/dashboard` (`fe_dashboard`).
6. Async Server Layout runs `isAuthorizedHr()` to guard administrative tabs (`fe_dashboard`).
7. Dashboard queries user interviews and renders competency averages (`db_postgres`).

### Scenario 3: HR Creates an Assessment
1. User opens Create Assessment tab on `/dashboard` (`fe_builder`).
2. Selects configuration (Curated category or published HR question bank).
3. Form submits to `handleCreateInterviewFormAction` Server Action (`be_assessment_action`).
4. Action queries database to verify published criteria status or selects curated scenarios (`db_prisma`).
5. Inserts `Interview` row with `isCompleted: false` and locked expected answers (`db_postgres`).
6. Server invalidates `/dashboard` cache via `revalidatePath()` (`be_assessment_action`).
7. Returns `{ success: true, assessmentId }` and client redirects to `/interview/[id]` (`fe_interview_view`).

### Scenario 4: Candidate Answers & Local AI Evaluation Pipeline
1. Candidate opens `/interview/[id]`. Server page verifies session and strips `expectedAnswers` for fairness (`fe_interview_view`).
2. Candidate clicks 'Submit Assessment'. State triggers `busy = true`; Live Timer Overlay (`z-[100]`) mounts at `00:00` (`fe_eval_timer`).
3. HTTP POST to `/api/interview/complete` verified by rate limiter (6 req/min) (`be_complete_api`).
4. Preliminary candidate answers immediately saved to `InterviewFeedback` with `status: 'evaluating'` to guarantee zero data loss (`db_postgres`).
5. For each scenario, `evaluateWorkplaceAnswer` resolves scenario rubric and expected answers (`ai_eval_service`).
6. Prompt builder formats JSON-only schema constraints with zero hardcoded score anchoring (`ai_prompt_builder`).
7. Backend sends HTTP POST to local Ollama daemon at `127.0.0.1:11434` with `model: 'qwen3:4b'` (`ai_ollama_runtime`).
8. Local Qwen3 generates structured evaluation JSON.
9. `extractJsonContent` strips `<think>` tags; `isSemanticEvaluation` checks schema with 1-retry fallback (`ai_validator`).
10. `normalizeForEvidenceCheck` verifies candidate quotes; `isNonResponsiveAnswer` caps filler responses &le; 15 (`ai_scoring_engine`).
11. Bounded averages and prioritized recommendations calculated (`ai_dev_plans`).
12. Atomic Prisma `$transaction` updates `Interview.isCompleted = true` and upserts final `InterviewFeedback` (`db_postgres`).
13. Backend sends HTTP 200 response; overlay closes and rich Assessment Results screen renders smoothly (`fe_interview_view`).

### Scenario 5: HR Reviews Candidate Results & History
1. User opens Interview History tab on `/dashboard` (`fe_dashboard`).
2. Client queries `/api/interview/getall` (`fe_dashboard`).
3. Route handler verifies `auth()` session identity (`be_history_api`).
4. PostgreSQL queries `Interview` records left-joined with `InterviewFeedback` (`db_postgres`).
5. Backend returns assessment array with scores and competency badges (`be_history_api`).
6. Candidate or HR clicks assessment to review full formative breakdown and development actions (`fe_interview_view`).

---

## 4. Verification Matrix

| Component / Flow | Status | Evidence / Verification Method |
| :--- | :--- | :--- |
| **Bcrypt Salt Rounds (10)** | `Runtime Verified` | `tests/security/run-security-tests.cjs` |
| **Rate Limiter (Sliding Window)** | `Runtime Verified` | `tests/security/run-security-tests.cjs` (Passed) |
| **Dual HR Authorization (DB + Env)** | `Runtime Verified` | Live server execution & `app/lib/workplace/hr-authorization.ts` |
| **Live Timer Overlay (`z-[100]`)** | `Runtime Verified` | `tests/workplace/timer-tests.cjs` (Passed 5/5) |
| **Qwen `<think>` Tag Stripping** | `Runtime Verified` | `tests/workplace/run-tests.cjs` (Passed) |
| **Filler Answer Penalty ('all is well' &le; 15)**| `Runtime Verified` | `tests/workplace/run-tests.cjs` (Passed) |
| **Atomic $transaction Idempotency** | `Source Confirmed` | `app/api/interview/complete/route.ts` (L183–L196) |
| **Preliminary Answer Pre-Save** | `Source Confirmed` | `app/api/interview/complete/route.ts` (L65–L84) |
| **Candidate Expected Answer Masking** | `Source Confirmed` | `app/(pages)/(interview-pages)/interview/[id]/page.tsx` (L14–L17) |

---

## 5. How to Demonstrate to Hackathon Judges

1. **Launch the Simulator**:
   * Navigate in browser to: **`http://localhost:3000/architecture-simulator`**
2. **Present Fullscreen**:
   * Click the **Presentation Mode** button in the top right to expand the simulator for clear visibility on a projector.
3. **Walk Through Scenario 4 (Flagship AI Pipeline)**:
   * Select **Workflow 4: AI Evaluation Pipeline**.
   * Click **Auto Play** or use the **Next Step** arrow to guide judges step-by-step through the local inference, schema defense, evidence validation, and atomic database persistence.
4. **Highlight Key Differentiators**:
   * Click **Judge Pitch Highlights** to display the four core architectural differentiators:
     1. 100% On-Device Privacy (Zero cloud leak).
     2. Defense-in-depth Schema & Evidence Verification.
     3. Fault-tolerant answer pre-persistence.
     4. Real-time live evaluation overlay with zero fake progress bars.
