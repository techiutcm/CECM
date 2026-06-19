import { chmod, mkdir, stat } from "node:fs/promises";
import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toolsDir = path.join(__dirname, "..", ".tools");
const binaryPath = path.join(toolsDir, "cloudflared");

const DOWNLOAD_URL =
  "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64";

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function downloadWithFetch() {
  const response = await fetch(DOWNLOAD_URL);

  if (!response.ok || !response.body) {
    throw new Error(`No se pudo descargar cloudflared (${response.status})`);
  }

  const { createWriteStream } = await import("node:fs");
  const { pipeline } = await import("node:stream/promises");

  await mkdir(toolsDir, { recursive: true });
  await pipeline(response.body, createWriteStream(binaryPath));
}

function downloadWithCurl() {
  mkdirSync(toolsDir, { recursive: true });

  const result = spawnSync(
    "curl",
    ["-fsSL", "-o", binaryPath, DOWNLOAD_URL],
    { stdio: "inherit" },
  );

  if (result.status !== 0) {
    throw new Error("No se pudo descargar cloudflared con curl");
  }
}

async function downloadCloudflared() {
  console.log("Descargando cloudflared...");

  try {
    await downloadWithFetch();
  } catch {
    downloadWithCurl();
  }

  await chmod(binaryPath, 0o755);
  console.log(`cloudflared instalado en: ${binaryPath}`);
}

async function main() {
  if (await fileExists(binaryPath)) {
    console.log(`cloudflared ya está listo: ${binaryPath}`);
    return;
  }

  await downloadCloudflared();
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
