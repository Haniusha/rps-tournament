# Clipwards Arena

The original eight-player rock-paper-scissors tournament, built with React,
Vinext/Vite, and Cloudflare Workers/D1. The 16-player MVP is a future target;
this setup does not change the current game.

Read [AGENTS.md](AGENTS.md) before development. See the [product specification](docs/product-spec.md)
for rules and [architecture](docs/architecture.md) for known limitations.

## Prerequisites

- Node.js >=22.13.0 (local validation used 24.22.1).
- Exactly pnpm 11.25.0, matching `packageManager`. Use your existing Node/pnpm
  installation or version manager; do not convert the lockfile to npm.
- Git. No Cloudflare login or production credentials are required for local use.

Run commands from the repository root. Check `node --version` and `pnpm --version`.
A clean checkout defaults to the portable execution profile; no profile file is needed.

## Install and check

```sh
pnpm run install:ci
pnpm exec tsc --noEmit --incremental false
pnpm run lint
pnpm run build
```

The installer uses the frozen pnpm lockfile, includes development and optional
packages, and retains `pnpm-workspace.yaml` release-age and build-script policies.
It preserves the portable caller's HOME, cache, and proxy configuration. Do not
run simultaneous installers. Do not bypass policies or regenerate the lockfile to
hide an installation error. See [verification results](docs/local-setup.md) for
known check failures; the baseline has no automated game test command.

The managed-Linux profile continues to use `scripts/install-pnpm.sh` and requires
modern Bash (including `coproc`), `flock`, GNU `timeout`, and the existing managed
environment. It is not the macOS install path. Old npm-specific helper files are
legacy and are not invoked by the active install entrypoint.

## Initialize local D1

Build first to generate `dist/server/wrangler.json`. On a fresh local database,
apply the existing migration once:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_mean_shadow_king.sql
```

Do not add `--remote`. Do not rerun this CREATE TABLE migration on an initialized
database. Inspect the local schema if uncertain:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --command "SELECT name FROM sqlite_master WHERE type='table' AND name='rooms';"
```

Use `.wrangler/state`, not `.wrangler/state/v3`; Wrangler adds version directories.
This procedure affects only local state and does not apply a production migration.

## Preview

```sh
pnpm run dev
```

Open the loopback URL printed by the server (normally `http://localhost:5173`).
To test the built Worker instead, stop development preview and run:

```sh
pnpm run start
```

The built preview binds to `127.0.0.1` and uses the same local D1 persistence.
Use its printed URL. For another port, use `pnpm run start -- --port 8788`.
Stop with Ctrl+C. Neither command deploys the site.

## Multiplayer smoke check

1. Verify the landing page, move artwork, responsive layout, and rules dialog.
2. Select Quick play: confirm one human and seven labelled bots; make moves and
   observe lock, reveal animations, scores, and bracket progression.
3. Create a friend room in a separate session. Join its code from a different
   browser/profile or independently opened tab with a distinct session token.
   Avoid duplicating a tab: sessionStorage may copy the player identity.
4. Confirm both names appear, nonhosts cannot start, and the host can fill the
   remaining seats with bots. For an all-human check, use eight distinct sessions.
5. Confirm choices remain hidden until resolution, both views converge, and the
   bracket progresses through quarterfinals, semifinals, and final.
6. Check mobile-width layout and reduced-motion mode. Record any failures;
   known timing/reconnect/state issues are separate from local setup.

These are manual smoke instructions, not a claim of automated coverage. See
[local verification](docs/local-setup.md) for what was actually exercised.

## Configuration and safety

`.openai/hosting.json`, `.gitignore`, and `.npmrc` were recovered from the original
source archive and verified against `SOURCE-MANIFEST.json`. The hosting manifest
retains its original project ID and `DB` binding; do not repurpose it for a new
production project. Vite already uses a local placeholder database ID.

No credentials belong in tracked files. `.env*`, `.dev.vars*`, keys, dependencies,
build output, and local runtime/database state are ignored. The restored `.npmrc`
disables automatic audit/funding/notifier output; this is not a security scan.

This repository uses a Worker build, not a conventional Next.js production
server. `dist/` is generated. Publication, production bindings, migrations,
access controls, and dependency changes require a separately approved plan.
Do not deploy as part of local setup. Optional connector/auth starter plumbing
is not required to play the anonymous local game.
