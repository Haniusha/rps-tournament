# Local setup verification — Issue #2

Verified on 2026-10-23 against main baseline `55348274b80d1893e7d950a028e930e7e3a1b404`
plus the focused setup changes in this PR. Environment: macOS arm64, Node 24.22.1,
pnpm 11.25.0, Wrangler 4.92.0. Node/pnpm/Git were supplied by the desktop's bundled
runtime; contributors can use their own installations at the documented versions.
System `/usr/bin/python3` and Git stubs required unavailable Xcode tools; those
stubs were not used for validation. Python is not required to run the game.

## Provenance of restored files

Archive: `clipwards-arena-github-import.zip` from commit
[`a9d4227c4d64efe7601e7d0fb56b5e6836958403`](https://github.com/Haniusha/rps-tournament/tree/a9d4227c4d64efe7601e7d0fb56b5e6836958403).
ZIP Git blob: `9c7b156ea94d1b4e2eca0d8758f153657cf3b6b1`.
Each file was restored byte-for-byte and checked against the tracked
`SOURCE-MANIFEST.json`; that manifest remains a historical import record.

| File | Verified SHA-256 |
| --- | --- |
| .gitignore | 5ca3c39bdc1288c108a1931b3f6bc5795464b6253e9457390617774259deed0c |
| .npmrc | a3909ac0447c469fda12c57374993be70f47ce73e49fd3124678c7c047f2214d |
| .openai/hosting.json | bcffe177f0238ba5dbfde93c91cd330e762d3d552810b8336a283d1e4c3630bb |

The manifest contains the original project ID, `d1: "DB"`, and `r2: null`.
No credentials or production database IDs were added. The restored `.npmrc`
contains only `audit=false`, `fund=false`, and `update-notifier=false`.

## Results

| Command/check | Result |
| --- | --- |
| `pnpm run install:ci` on a clean checkout without node_modules | PASS; frozen install, 641 packages, pnpm 11.25.0; lockfile policy verification remained enabled. |
| `pnpm exec tsc --noEmit --incremental false` | PASS, exit 0. |
| `pnpm run lint` | FAIL, exit 1: 19 errors and 4 warnings in unchanged app/api/game/route.ts, app/page.tsx, and lib/game.ts. Includes explicit any, hook rules, unescaped text, unused imports, and prefer-const. No rules were disabled. |
| `pnpm run build` | PASS, exit 0; generated Worker output and dist/server/wrangler.json. Vinext emitted its route-classification informational notice. |
| Local D1 migration command in README | PASS, exit 0; one SQL command executed against local placeholder DB. |
| Local schema query in README | PASS; returned rooms. |
| `pnpm run start` without sandbox overrides | FAIL in this desktop sandbox: filesystem watcher EMFILE and denied write to user Library/Preferences/.wrangler. |
| Built preview with environment overrides below | PASS; HTTP 200 at 127.0.0.1:8787 and working DB-backed API. |
| Development preview with overrides below | PASS; HTTP 200 at 127.0.0.1:5173 and eight-player practice creation. |
| `pnpm exec eslint scripts/install-ci.mjs` | PASS. |
| `node --check scripts/install-ci.mjs` | PASS. |
| `bash -n scripts/sites-env.sh scripts/build-verified.sh` | PASS. The managed-Linux installer needs modern Bash; macOS Bash 3.2 is not its target. |
| Installer guard checks | PASS; direct/no package manager, npm, and incorrect pnpm-version invocations rejected before installation. |
| Local API smoke | PASS; eight distinct identities, nonhost start rejected, unrevealed opponent move hidden, 4/2/1 match progression, finished champion, quick play and host bot fill. |
| Browser smoke | PASS for landing page, quick play, move submission, disabled reveal controls, tie text and SVG reveal presentation at the available narrow viewport. |

The API smoke used sequential local HTTP clients and real local D1; it was not
an eight-browser concurrency/load test. Full desktop/mobile visual regression,
reduced-motion QA, all animation variants, and managed-Linux execution were not
verified. No automated game test suite exists yet; that remains F02. Existing
lint failures and known gameplay/state defects remain outside this setup PR.

## Restricted macOS preview

If native file watching or the normal per-user Wrangler config directory is
unavailable, run either preview with these process-local settings:

```sh
XDG_CONFIG_HOME="$PWD/.sites-runtime/xdg-config" CHOKIDAR_USEPOLLING=true pnpm run start
# Or, after stopping the built preview:
XDG_CONFIG_HOME="$PWD/.sites-runtime/xdg-config" CHOKIDAR_USEPOLLING=true pnpm run dev
```

These overrides were verified in this desktop sandbox. They do not change HOME,
tracked deployment settings, production bindings, or application behavior.
Only use them when needed; normal host execution without overrides was not
verified outside the sandbox. Keep preview on loopback.

## Review perspectives and remaining limits

- **Architecture:** retains the Vinext/Workers/D1 stack and existing schema. Portable
  and managed-Linux installation use the same pinned pnpm ecosystem. Only the
  installation command changes in package.json; dependencies and lockfile stay intact.
- **Security:** restored files are provenance-checked and non-secret. Ignore rules
  cover environment files, PEM keys, database/runtime state, build output, and
  dependencies. No package policies were disabled and no remote D1 command ran.
  The npm audit setting is historical, not proof of dependency safety.
- **QA:** distinguishes setup success from failing repository lint and partial
  browser coverage. The README includes repeatable local migration/preview and
  multiplayer smoke instructions. No claim of production readiness is made.

These perspectives were applied by the lead agent; they are not independent
human or multi-agent sign-offs. The managed-Linux path retains its existing
logic with corrected executable modes, but needs verification in its target
Linux environment before anyone claims it passed there.

Approval: the Product Owner approved the concrete Issue #2 plan in the task
conversation (“I am approving”), including exact configuration restoration and
installer/script changes. The PR records this approval and links Issue #2.
There was no authorization to deploy, merge, change dependencies, or modify the game.
