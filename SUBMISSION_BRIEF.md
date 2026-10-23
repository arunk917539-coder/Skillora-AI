# Workplace Compass — Nexathon 2026 Submission Brief

## One-line summary
Workplace Compass is a privacy-conscious, local-first workplace scenario practice platform that helps users reflect on professional decisions, see transparent rubric-based feedback, and choose targeted development activities.

## Problem addressed
The Nexathon 2026 brochure's AI-Based Employee Behaviour & Workplace Assessment statement calls for structured workplace scenarios and employee responses that help identify strengths, development areas, and suitable training interventions. Workplace Compass implements a focused prototype of that workflow.

## Intended users
- Employees and students practising workplace communication and decision-making.
- Learning and development facilitators looking for a structured practice exercise.
- HR teams evaluating a prototype workflow for learning support—not making employment decisions from its scores.

## User journey
1. Register or sign in using email and password.
2. Choose a workplace scenario category, difficulty, title, and number of scenarios.
3. Read each scenario and submit a written response.
4. Receive a score breakdown, evidence signals, strengths, and development areas.
5. Review suggested practice activities.
6. Return to assessment history and compare results from comparable assessments.

## Five competency dimensions
- Communication
- Problem solving
- Collaboration
- Accountability
- Planning and prioritisation

## Why this approach
- **Explainability:** feedback is produced by explicit local rules rather than an opaque paid API call.
- **Low integration overhead:** no paid generative-AI key is required for scenario selection, scoring, or recommendations.
- **Learning-oriented:** recommendations are connected to competency scores and intended to suggest practice, not label a person.
- **Data ownership:** accounts and results are stored in the configured PostgreSQL database; operators must protect that database and follow applicable privacy rules.

## Scope and limitations
This is a prototype and practice aid. The evaluator uses local Ollama inference against scenario-specific criteria. It can misinterpret context and does not establish actual on-the-job behaviour; it has not been psychometrically validated. Scores must not be used as the sole basis for hiring, promotion, termination, or other employment decisions. A future HR deployment would require validated instruments, human oversight, privacy/legal review, bias evaluation, and user consent.

## Current implementation scope
- Next.js / React user interface.
- Email/password authentication.
- PostgreSQL persistence through Prisma.
- Curated local scenario bank.
- Local Ollama semantic evaluation against rubric criteria with structured competency scoring.
- Development recommendations and assessment history/progress view.

## Honest demo claim
Describe the product as an **explainable workplace practice prototype powered by a local Ollama model**. Do not claim that it reads emotions, predicts employee performance, or provides a validated psychological assessment.
