import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");

function run(command, args, label) {
  const child = spawn(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    env: process.env,
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[${label}] terminó con código ${code}`);
    }
    shutdown(code ?? 0);
  });

  return child;
}

const children = [];
let isShuttingDown = false;

function shutdown(code = 0) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }

  setTimeout(() => process.exit(code), 300);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("Levantando Next.js + Cloudflare Tunnel...\n");

children.push(run("pnpm", ["dev"], "dev"));
setTimeout(() => {
  children.push(run("node", ["scripts/tunnel.mjs"], "tunnel"));
}, 4000);
