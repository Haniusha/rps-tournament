# Clipwards Arena product specification

Status date: 2026-10-23. Baseline: [53f50e3](https://github.com/Haniusha/rps-tournament/tree/53f50e39574d66a58f78cc433ddf6f3919eda0c9).

## Product purpose

A free, browser-based rock-paper-scissors tournament with friend rooms and clearly labelled practice bots. Preserve the existing Clipwards identity, playful arcade palette, SVG move art, reveal animations, and responsive presentation. The current UI states: no wallet and no cash prizes.

## Existing implemented game: 8 players

The following describes current code, not the future MVP.

| Area | Implemented behavior |
| --- | --- |
| Entry | Quick play creates one human plus seven labelled bots and starts immediately. Friend rooms start with their creator. |
| Capacity/start | Exactly eight players are required. Only the host starts a waiting room; the host can fill remaining seats with bots and start. |
| Bracket | Random shuffle; eight-player single elimination: quarterfinals, semifinals, final. No byes or third-place match. |
| Match victory | First to three scoring throws. This is not a fixed total-throw limit; ties replay. |
| Moves | Rock beats scissors, scissors beats paper, paper beats rock. A submitted move locks for the current throw. |
| Timing | Nominal seven-second choice window and 3.2-second reveal. Both submitted choices resolve early. |
| One missed move | A player who submits receives a point when the opponent misses; if both miss, neither receives a point. |
| Consecutive misses | Two consecutive misses forfeit a match. Submitting resets that player's miss streak during resolution. |
| Both miss twice | Any match with both players missing twice consecutively cancels the entire tournament. |
| Advancement | All current-round matches must have winners and complete their reveals before the next round begins. |
| Visibility | Unrevealed opponent choices are omitted from public responses; lock status is visible. Choices appear on resolution. |
| Identity | Browser-session token, hashed server-side; no required account sign-in. |
| Leave/rejoin | Leave view is local only; there is no server-side removal, presence, or host transfer. Existing identities can rejoin a room. Active room selection is not restored automatically on reload. |
| Statistics | Browser-local trophy counter, not authoritative. Although labelled practice wins, it also counts friend-room wins. |

Sources: [game engine](../lib/game.ts), [API](../app/api/game/route.ts), [frontend](../app/page.tsx).

### Known differences between intent and implementation

The UI says leaving does not pause timers, but progress occurs only on requests. Long request gaps extend the effective schedule. Match IDs persist across throws, allowing delayed move requests to affect a later throw. Client responses are not version-ordered. These are audit findings to address through approved issues, not new desired rules.

## Approved MVP target: 16 players

The Product Owner explicitly identified a **16-player MVP target** in the request establishing this workflow. This approval establishes target capacity; the current source still implements eight players.

The target must be documented, planned, tested, and reviewed before implementation. Existing presentation should be preserved. A 16-player single-elimination bracket would have four rounds and 15 matches if the current elimination format is retained; this is a proposed derivation, not evidence that a new round structure has already shipped.

### Proposed carry-forward rules — require confirmation

- Retain single elimination, first-to-three scoring, ties replaying, seven-second choices, and 3.2-second reveals.
- Use round of 16 → quarterfinals → semifinals → final, with no byes.
- Require 16 entrants to start; allow the host to fill empty seats with labelled bots.
- Adapt quick play to one human plus 15 bots.
- Preserve one-miss point loss, two-miss forfeits, and the existing whole-tournament double-inactivity cancellation rule.

Only capacity is explicitly approved for the MVP target. Approval of this documentation does not silently approve these proposed rules.

### Decisions required before MVP implementation

- Confirm the carry-forward rules above, especially global cancellation versus a local match outcome.
- Confirm whether to support byes, partial starts, variable capacity, or only exactly 16 entrants.
- Define leave, reconnect grace, host departure, spectator admission, and abandoned-room behavior.
- Decide whether trophies remain cosmetic and browser-local.
- Approve the bracket layout adaptation while retaining the existing visual language.

No accounts, cash prizes, paid entry, rankings, chat, or matchmaking service are approved by the 16-player capacity target.

## Acceptance framework

For current-game hardening: demonstrate unchanged scoring and styling, server-authoritative decisions, hidden moves, stable multiplayer synchronization, and correct elapsed-time behavior.

For the 16-player MVP: record approved rules first; verify all 16 distinct seats, the approved bot policy, all bracket transitions, exactly one champion, reconnect/timeout outcomes, and mobile/desktop readability. Tests must cover the approved policy rather than choose a policy implicitly.

See [roadmap](roadmap.md) for proposed implementation order and [decisions](decisions.md) for approval status.
