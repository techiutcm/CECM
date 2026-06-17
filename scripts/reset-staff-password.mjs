#!/usr/bin/env node
/**
 * Restablece la contraseña de un usuario administrativo.
 *
 * Uso:
 *   pnpm reset:staff-password -- --email blog@colegio.com --password "NuevaClave123"
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvFile() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf8");

    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // variables ya exportadas en el entorno
  }
}

loadEnvFile();

const args = process.argv.slice(2);

function getArg(name) {
  const index = args.findIndex((arg) => arg === `--${name}`);
  if (index === -1) return undefined;
  return args[index + 1];
}

const email = getArg("email");
const password = getArg("password");

if (!email || !password) {
  console.error(`
Uso:
  pnpm reset:staff-password -- --email correo@dominio.com --password "NuevaClaveSegura"

Opciones:
  --email      Correo del usuario (requerido)
  --password   Nueva contraseña (requerido, mín. 6 caracteres)
`);
  process.exit(1);
}

if (password.length < 6) {
  console.error("La contraseña debe tener al menos 6 caracteres.");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error(`
Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local

Descomenta y agrega tu clave secreta:
  SUPABASE_SECRET_KEY=sb_secret_...

O restablece la contraseña desde Supabase Dashboard:
  Authentication → Users → selecciona el usuario → Send password recovery / Update user
`);
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: listData, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    console.error("Error al buscar usuarios:", listError.message);
    process.exit(1);
  }

  const user = listData.users.find(
    (item) => item.email?.toLowerCase() === email.toLowerCase(),
  );

  if (!user) {
    console.error(`No se encontró ningún usuario con el correo: ${email}`);
    process.exit(1);
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password,
  });

  if (updateError) {
    console.error("Error al actualizar contraseña:", updateError.message);
    process.exit(1);
  }

  console.log("\n✓ Contraseña actualizada correctamente\n");
  console.log(`  Email:  ${email}`);
  console.log(`  Login:  http://localhost:3000/login\n`);
}

main();
