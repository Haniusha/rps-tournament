# Decision log

Updated: 2026-10-23. Approval sources below refer to explicit Product Owner instructions in the development conversation. Future approvals must be linked in the relevant GitHub issue/PR for durable traceability. AI recommendations do not count as Product Owner approval.

## Status definitions

- **Observed:** behavior verified in the audited source; not an endorsement or a newly approved requirement.
- **Approved:** explicitly authorized by the Product Owner, within the stated scope.
- **Proposed:** recommendation awaiting approval; do not implement as a settled requirement.
- **Superseded:** replaced by a later linked decision; preserve the history.

## D001 — Existing game baseline

Status: **Observed**. Date: 2026-10-23.

Source: [commit 53f50e3](https://github.com/Haniusha/rps-tournament/tree/53f50e39574d66a58f78cc433ddf6f3919eda0c9), particularly lib/game.ts, app/api/game/route.ts, and app/page.tsx.

The game currently requires eight players and implements single elimination, first-to-three scoring, seven-second nominal timers, 3.2-second reveals, two-miss forfeits, and whole-tournament cancellation when both players miss twice in a match. See [product specification](product-spec.md) for precise behavior and defects.

Consequence: protect existing behavior with regression tests; do not confuse defects with new desired rules.

## D002 — Documentation-only AI foundation

Status: **Approved**. Date: 2026-10-23.

Approval source: Product Owner request to create chore/ai-team-foundation, add AGENTS.md and four docs files, define six AI specialist roles, establish an issue/branch/PR/test workflow, and open a PR against main without auto-merging.

Consequence: this change is documentation only. Gameplay, styling, animations, dependencies, deployment configuration, and CI configuration remain unchanged. Proposed fixes are not authorized merely by listing them.

## D003 — 16-player MVP capacity target

Status: **Approved (target capacity only)**. Date: 2026-10-23.

Approval source: Product Owner instruction to document “the existing 8-player rules separately from the approved 16-player MVP target.”

Consequence: record a 16-player target separately from the existing implementation. This does not mean 16-player gameplay is implemented or that all supporting rule choices are approved.

## D004 — Carry existing mechanics into a four-round MVP

Status: **Proposed**. Date: 2026-10-23.

Proposal: retain single elimination, first-to-three scoring, existing timers, and reveal behavior; introduce round of 16 before quarterfinals, semifinals, and final; adapt quick play to one human plus 15 bots.

Alternatives: variable capacity/byes, a different bot policy, or different match/timing rules. No alternative is selected.

Required decision: Product Owner confirms exact rules and visual adaptation in M01 before implementation. In particular, the double-inactivity global cancellation rule must not be silently replaced.

## D005 — Multiplayer reliability and access design

Status: **Proposed**. Date: 2026-10-23.

Proposal: add throw IDs, authoritative elapsed-time handling, versioned responses, server-time synchronization, stale-response rejection, runtime request validation, abuse controls, and room retention. Retain the current stack initially.

Open decisions: scheduling mechanism, spectator access, session issuance, leave/reconnect grace, host departure, retention duration, and whether cosmetic trophies remain browser-local.

Consequence: prepare issue-level designs and obtain approval for significant changes. No real-time transport, new datastore, authentication provider, or dependency is selected here.

## D006 — Review and release governance

Status: **Approved (documented workflow)**. Date: 2026-10-23.

Approval source: Product Owner request for GitHub issues, feature branches, pull requests, automated tests, and Product Owner approval for significant changes; explicit instruction not to merge this foundation PR automatically.

Consequence: follow AGENTS.md. Automated tests and CI are required workflow goals to implement in F02; the baseline has neither a test suite nor a CI workflow. This decision does not claim repository settings or automation are already configured.

## Future decision record template

- ID, title, date, and status.
- Problem and source evidence.
- Options, tradeoffs, and recommended approach.
- Exact scope and acceptance criteria.
- Product Owner approval link/date (or “pending”).
- Affected product rules, architecture, security, data, and visuals.
- Implementation issue/PR and validation evidence.
- Rollback/migration considerations; superseded decision if applicable.
