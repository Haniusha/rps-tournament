import { spawnSync } from "node:child_process";
import { accessSync, constants, readFileSync } from "node:fs";
import path from "node:path";
import { projectRoot } from "./sites-env.mjs";
import { readExecutionProfile } from "./execution-profile.mjs";

const { packageManager } = JSON.parse(readFileSync(path.join(projectRoot, "package.json"), "utf8"));
const expectedVersion = packageManager.replace(/^pnpm@/, "");
if (!process.env.npm_execpath || !process.env.npm_config_user_agent?.startsWith(`pnpm/${expectedVersion} `)) {
  throw new Error(`Run this installer with ${packageManager}: pnpm run install:ci.`);
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: projectRoot, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.signal) {
    process.kill(process.pid, result.signal);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (readExecutionProfile() === "managed-linux") {
  run("bash", [path.join(projectRoot, "scripts/install-pnpm.sh")]);
} else {
  // Use the invoking pinned pnpm entrypoint, without a shell or global install.
  // Keep caller HOME/proxy/cache settings and the workspace's build allowlist.
  run(process.execPath, [process.env.npm_execpath, "install", "--frozen-lockfile",
    "--prod=false", "--optional", "--prefer-offline"]);
}

accessSync(path.join(projectRoot, "node_modules", ".bin",
  process.platform === "win32" ? "vinext.cmd" : "vinext"),
process.platform === "win32" ? constants.F_OK : constants.X_OK);
