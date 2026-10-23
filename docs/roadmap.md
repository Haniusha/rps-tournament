# Development roadmap

Status: 2026-10-23. This is a proposed backlog derived from the technical audit, not a blanket implementation authorization. The Product Owner approved documenting a 16-player MVP target and establishing the AI workflow; each significant implementation plan still needs approval.

Follow [AGENTS.md](../AGENTS.md). Create GitHub issues from these entries when implementation work is authorized; the names below are backlog keys, not claims that issues already exist.

| Order / key | Proposed issue | Lead and review | Acceptance criteria |
| --- | --- | --- | --- |
| 1 / F01 | Restore reproducible setup (A01, A11) | DevOps; Architect, Security | Recover intended hosting/ignore/package-manager configuration; align setup instructions; demonstrate clean locked install, type check, lint, Worker build, and local D1 migration. Record environment and outputs. Do not invent production values. |
| 2 / F02 | Establish regression tests and CI (A08) | QA; Developer, DevOps | Approved test tools; automated rule and API tests; CI type/lint/test/build checks; protected-main policy proposed to the owner. Capture current desktop/mobile visual baselines. |
| 3 / F03 | Make timing and throw submission reliable (A02, A03) | Architect + Developer; QA, Security | Approved timing design; explicit throw IDs; stale/duplicate requests cannot affect another throw; elapsed-time transitions remain correct without continuous polling; existing scoring is preserved. |
| 4 / F04 | Make client synchronization reliable (A04, A10) | Developer; QA | Versioned snapshots/server time, stale-response rejection, obsolete-request cancellation, bounded retry/backoff, and approved reconnect behavior. Leaving/creating a room cannot be undone by an old response. |
| 5 / F05 | Harden access and room lifecycle (A05–A07, A09) | Security + Developer; Architect, DevOps, QA | Approved guest/spectator/presence policy, strict schemas, abuse limits, collision retry, retention/history bounds, safe error reporting, and fewer no-op writes. |
| 6 / M01 | Finalize 16-player MVP rules | Product Manager; Architect, QA, Product Owner | Product Owner records all decisions listed in product-spec.md; technical design, test cases, and visual adaptation are reviewable. Capacity approval alone is not treated as approval of all rules. |
| 7 / M02 | Implement the approved 16-player MVP | Developer; Architect, Security, QA | Implement only M01-approved rules. Test 16 distinct participants, every bracket transition, one champion, bot behavior, missed moves, reconnects, and desktop/mobile bracket presentation. Preserve visual identity. |
| 8 / R01 | Verify release readiness | DevOps + QA; Security, Product Owner | Approved release/rollback plan; migration verification; multiplayer load/failure tests; dependency scan; visual/accessibility checks; monitoring and human release authorization. |

F03 and F04 depend on baseline regression coverage. M01 can be refined alongside foundation work; M02 depends on M01 approval and reliable game/state foundations. Changes to deployment configuration, dependencies, or rules belong in separately scoped approved PRs.

## Proposed automated test matrix

- **Game rules:** all nine combinations; ties; first-to-three; single/both timeouts; streak reset; two-miss forfeits; global cancellation; shuffled unique pairings; all advancement boundaries and final winner.
- **Time:** just before/at/after deadlines; reveal boundaries; long request gaps; delayed processing; consistent injected clock.
- **Protocol/security:** invalid bodies/actions/moves; nonparticipant move; nonhost start; concealed moves; stale throw IDs; duplicate submissions; rejected abuse attempts under the approved policy.
- **Persistence/concurrency:** simultaneous joins into the last seat; concurrent start/join; both players moving; version conflicts/retries; lost-response replay; D1 failures.
- **Browser behavior:** poll/action response reordering; leave/create races; reload/rejoin; network loss; clock skew; disabled/locked controls; terminal-state polling.
- **Presentation:** desktop/mobile entry, lobby, match, bracket, and champion views; existing animation and reduced-motion behavior; keyboard/modal accessibility.
- **16-player target:** approved capacity and bot-fill policy, expected bracket shape, unique entrants/winners, approved timeout/cancellation outcomes, readable mobile bracket.
- **Delivery:** clean install/build, schema migration in a disposable database, appropriate dependency scanning, and rollback verification.

Select tools and configure CI in F02 after approval. No test runner, CI workflow, branch protection, dependency update, or deployment change is installed by this documentation PR.

## First milestone recommendation

Prioritize F01–F04. Success means a reproducible environment and tested, reliable existing game before capacity expansion. Confirm unresolved product rules before M02. Do not label the 16-player MVP complete until it has been implemented, tested, reviewed, and accepted.
