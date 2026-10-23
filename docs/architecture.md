# Architecture and technical audit baseline

Audited source: [53f50e3](https://github.com/Haniusha/rps-tournament/tree/53f50e39574d66a58f78cc433ddf6f3919eda0c9), 2026-10-23. This document describes existing implementation and separates recommendations from shipped capabilities.

## Current request flow

1. [app/page.tsx](../app/page.tsx) renders the client UI and stores an anonymous player token in sessionStorage.
2. The client posts create, join, start, move, and poll actions to [app/api/game/route.ts](../app/api/game/route.ts); polling runs every 850 ms.
3. The route hashes the token, loads room JSON from D1, advances game state using [lib/game.ts](../lib/game.ts), applies the action, and conditionally writes the new state.
4. The write matches the stored version and increments it. On contention, the handler reloads and retries up to eight times.
5. publicRoom removes unrevealed moves and the host field, adds viewer-specific move/host information, and returns the room to the client.

There is no WebSocket channel, background game scheduler, or server-side presence system in the audited application.

## Components and data

| Surface | Responsibility |
| --- | --- |
| app/page.tsx | Entry, lobby, match view, bracket, rules modal, polling, sound, browser-local trophy count. |
| app/globals.css; components/throw-art.tsx | Responsive arcade styling, SVG artwork, move reveal choreography, reduced-motion treatment. |
| lib/game.ts | Room/match types, random pairing, move resolution, timeout/forfeit logic, advancement, public projection. |
| app/api/game/route.ts | HTTP actions, validation, token hashing, authorization checks for host/move actions, D1 optimistic updates. |
| db/schema.ts; drizzle/0000_mean_shadow_king.sql | rooms table: primary-key id, JSON state text, integer version. |
| db/index.ts | Optional Drizzle wrapper; game route uses direct parameterized D1 SQL instead. |
| worker/index.ts | Vinext Worker fetch entrypoint and request-scoped connector plumbing. |
| vite.config.ts; scripts/ | Vinext/Vite/Cloudflare integration and runtime/install/build helpers. |

Room JSON includes players, host, status, round, match arrays, and creation time. Matches include scores, pending moves, miss counts, deadlines, reveal times, last choices, winner, and history. Status/action contracts are loosely typed; frontend and request parsing rely extensively on any.

## Runtime and dependency baseline

[package.json](../package.json) declares Node >=22.13.0 and pnpm 11.25.0. Major pinned components include React/React DOM 19.2.6, Next 16.3.4, Vinext 1.0.0-beta.5, Vite 8.0.13, Wrangler 4.92.0, TypeScript 5.9.3, Tailwind 4.2.1, and Drizzle ORM 0.45.2.

Next-style source runs through Vinext on Cloudflare Workers. The large starter UI library introduces dependencies beyond the arena's direct imports. Do not remove or upgrade packages without usage analysis and an approved issue. A pnpm lockfile and release-age/build policies exist. No dependency vulnerability scan or full installation/build was performed in the audit; no specific CVE is asserted.

## Strengths to preserve

- Server-side outcome calculation and cryptographic random choices/shuffling.
- Hidden opponent moves before resolution.
- Host checks for starting and participant checks for moving.
- Parameterized SQL and version-conditional updates.
- Existing SVG assets, responsive styling, and reduced-motion support.

Public hashed player IDs are not directly usable as bearer tokens because incoming tokens are hashed again. Browser-generated UUID credentials are high entropy, but the endpoint also accepts arbitrary client-chosen strings.

## Prioritized audit findings

| ID | Priority | Evidence and consequence |
| --- | --- | --- |
| A01 | P1 | vite.config.ts imports missing .openai/hosting.json. SOURCE-MANIFEST.json lists that file, .gitignore, and .npmrc, all absent from the audited tree. Clean checkout deployment setup is incomplete. |
| A02 | P1 | tick advances only on requests and resets deadlines relative to the processing time. Long gaps extend the schedule. |
| A03 | P1 | Move requests contain match ID but no throw ID. An old request can be accepted after that match opens another throw. |
| A04 | P1 | Client poll/action responses overwrite room state without version or room-generation checks; stale responses can restore obsolete UI/rooms. |
| A05 | P1 | No application-level request rate limits; polling has no participant gate; arbitrary tokens permit multiple identities and seat occupation. Spectator access policy is undefined. |
| A06 | P2 | Every successful poll writes complete room JSON, even unchanged/terminal state. Eight clients produce roughly 9.4 reads and attempted writes per second per room before retries. |
| A07 | P2 | No room expiry, presence, seat release, host transfer, or bounded throw history. Abandoned rooms persist and lobbies can become stranded. |
| A08 | P2 | No committed test suite/test script or CI workflow. Critical behavior lacks regression protection. |
| A09 | P2 | Unknown actions fall through to polling; validation is partial; raw exception messages reach clients; 32-bit room codes lack guessing controls and collision retries. |
| A10 | P2 | Client clock is unsynchronized; fetches lack timeout/cancellation; a hung poll can stop future polling. Trophy storage is editable and not deduplicated across reloads. |
| A11 | P2 | README installation claims disagree with the pnpm Bash/Linux helper. Missing ignore rules undermine the stated local-secret/runtime exclusions. |
| A12 | P3 | Rules modal lacks focus trap, Escape dismissal, and focus restoration; its navigation entry is hidden on narrow screens. |

No direct SQL injection or nickname HTML injection path was identified in reviewed game code. This is not a penetration-test certification.

## Proposed direction, not implemented architecture

Retain the existing stack initially. Introduce explicit action/response types, runtime validation, throw sequence IDs, response versions/server time, and a deterministic clock boundary. Define elapsed-time progression and any scheduling mechanism in an approved design. Reduce no-op writes and add lifecycle/abuse controls. A different persistence model or real-time transport requires evidence and Product Owner approval; neither is selected here.

## Deployment requirements and verification limits

A functioning deployment needs the intended non-secret hosting manifest, a D1 binding named DB, the rooms migration, and a verified Worker build. Existing scripts generate deployment output and local Wrangler state. Production binding IDs, migration execution, credentials, release process, and rollback need environment-specific verification.

The audit used source review and in-memory checks of the game functions with TypeScript annotations removed and deterministic randomness. Checks covered nine move combinations, hidden opponent moves, delayed timing, and match ID reuse. They were not a committed suite, real D1 concurrency tests, browser QA, or a full build.

The foundation PR changes documentation only. It does not repair the missing configuration or configure CI/deployment.
