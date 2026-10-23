# Clipwards Arena AI development workflow

## Scope and sources of truth

These instructions apply throughout this repository. Read [product-spec](docs/product-spec.md), [architecture](docs/architecture.md), [roadmap](docs/roadmap.md), and [decisions](docs/decisions.md) before changing behavior.

The audited baseline is commit `53f50e39574d66a58f78cc433ddf6f3919eda0c9` (2026-10-23). Source code establishes implemented behavior; the product specification separates that behavior from approved targets and proposals. An audit recommendation is not implementation approval. If code, requirements, and an issue conflict, report the discrepancy and obtain a decision before changing the disputed behavior.

The human Product Owner has final product authority. AI specialists advise and implement within explicitly approved scope; they cannot approve their own significant changes on the Product Owner's behalf.

## Specialist responsibilities

| Role | Responsibility | Required handoff |
| --- | --- | --- |
| Product Manager | Translate Product Owner goals into issues, acceptance criteria, scope, priorities, and open questions. Maintain the product specification and roadmap. | A ready issue distinguishing existing behavior, approved requirements, and proposals; request Product Owner decisions where needed. |
| Software Architect | Trace affected components, define contracts and state transitions, assess concurrency and migration risks. Avoid unnecessary rewrites. | Technical approach, alternatives, test implications, and a decision-record proposal for significant architecture changes. |
| Senior Full-Stack Developer | Implement the approved issue in a focused branch; preserve established UI and game behavior outside scope. | Reviewable PR, appropriate tests, evidence of validation, and updated documentation. |
| Security Engineer | Review identity, room access, hidden moves, replay resistance, input validation, abuse limits, secrets, and dependency risks. | Evidence-backed findings with severity and remediation; distinguish confirmed defects from untested concerns. |
| QA Engineer | Derive tests from acceptance criteria; cover rules, timers, concurrency, reconnects, accessibility, and visual regression. | Reproducible scenarios, automated results, manual evidence where necessary, and explicit untested areas. |
| DevOps Engineer | Assess installation, CI, Worker/D1 configuration, migrations, observability, rollback, and release readiness. | Reproducible validation and release instructions; propose configuration changes for approval before applying them. |

These are responsibilities, not mandatory six-agent execution for every task. Use only relevant roles; document coverage and any lack of independent review. Do not create separate agents or tasks merely because a role exists.

## Issue-to-release workflow

1. **Define an issue.** Record the problem, evidence/source commit, desired outcome, scope/non-goals, acceptance criteria, affected rules, risks, test plan, dependencies, and approval status. Assign a responsible specialist and required reviewers. Use issue links, not undocumented chat assumptions, for durable handoffs.
2. **Make the plan reviewable.** Product Manager and Architect refine the approach. Security, QA, and DevOps contribute where relevant. Significant changes require explicit Product Owner approval of the concrete issue/plan before implementation. Record the approval link and date. The approved 16-player goal does not approve every design choice.
3. **Create a branch from current main.** Use focused names such as `feat/<issue>-<slug>`, `fix/<issue>-<slug>`, or `chore/<slug>`. Respect an explicitly requested name. Never develop directly on main or overwrite another contributor's changes.
4. **Implement only approved scope.** Keep changes small. Add meaningful regression tests for behavior changes. Update the product specification and decision records when an approved requirement changes. If scope expands, revise the plan and obtain approval for the added significant change.
5. **Open a PR against main.** Link the issue and approval record, explain before/after behavior, scope, validation, known limitations, and any migration/rollback steps. Include visual comparisons when UI behavior or layout changes. Use a draft while acceptance criteria are incomplete.
6. **Review and validate.** Relevant specialists review their areas. Automated checks must pass once configured; current missing automation must be reported honestly, never described as passing. Obtain human review and Product Owner acceptance for significant changes.
7. **Merge and release deliberately.** Do not auto-merge. Merge only when the Product Owner or an explicitly delegated human maintainer authorizes it and required reviews/checks are satisfied. Deployment is a separate authorized action. Close the issue with PR and validation links.

Suggested issue states: Backlog → Needs decision → Ready → In progress → In review → Done. These are a documented convention; this change does not configure GitHub Projects, labels, branch protection, or CI.

## Significant changes requiring Product Owner approval

- Tournament capacity implementation, scoring, timers, forfeits, cancellation, bots, bracket structure, or reconnect rules.
- Authentication, authorization, spectator access, retention, or public/private-room semantics.
- Visual redesign, styling, artwork, or animation changes.
- New dependencies, framework upgrades, persistence architecture, schema migrations, or deployment configuration.
- Monetization, accounts, rankings, or external integrations.

Routine fixes already covered by approved acceptance criteria do not need repeated approval. A proposal stays a proposal until an explicit approval is recorded.

## Engineering and validation expectations

- Keep outcome calculation, deadlines, move locking, and bracket advancement authoritative on the server.
- Never expose an opponent's unrevealed move or a bearer credential.
- Treat all client input as untrusted; use typed contracts and runtime validation.
- Preserve concurrency guarantees when changing room persistence; test stale requests and retries.
- Preserve the current arcade styling, SVG art, reveal choreography, and reduced-motion behavior unless a specific change is approved.
- Do not silently alter dependencies, lockfiles, migrations, hosting configuration, or generated files.
- Never commit secrets, tokens, local runtime state, or private user data.
- State exactly what ran and what did not. Do not invent passing build, test, security, or deployment results.
- The baseline has no test script or CI workflow. Establish them through a separately approved issue. See the roadmap for the proposed test matrix.
- For documentation-only PRs, validate links, source claims, approval labels, and the changed-file allowlist; a gameplay build is not required solely for prose edits.

## Current foundation change boundary

The initial foundation PR adds only this file and the four linked documents. It does not implement the 16-player target, audit fixes, tests, CI, deployment changes, or a redesign.
