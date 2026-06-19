import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const localBinary = path.join(projectRoot, ".tools", "cloudflared");
const port = process.env.TUNNEL_PORT ?? "3000";
const targetUrl = `http://localhost:${port}`;

function resolveCloudflaredBinary() {
  const which = spawnSync("which", ["cloudflared"], { encoding: "utf8" });

  if (which.status === 0 && which.stdout.trim()) {
    return which.stdout.trim();
  }

  return localBinary;
}

async function ensureCloudflared(binary) {
  if (binary !== localBinary) return;

  const setup = spawnSync("node", ["scripts/setup-cloudflared.mjs"], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  if (setup.status !== 0) {
    process.exit(setup.status ?? 1);
  }
}

async function main() {
  const binary = resolveCloudflaredBinary();
  await ensureCloudflared(binary);

  console.log(`Iniciando Cloudflare Tunnel → ${targetUrl}`);
  console.log("Comparte la URL que aparezca abajo (termina en .trycloudflare.com)\n");

  const child = spawn(binary, ["tunnel", "--url", targetUrl], {
    cwd: projectRoot,
    stdio: "inherit",
  });

  child.on("exit", (code) => process.exit(code ?? 0));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
