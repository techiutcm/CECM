#!/usr/bin/env node
/**
 * Crea un usuario administrativo (blog o admisiones).
 *
 * Uso:
 *   pnpm create:staff-user -- --email admisiones@colegio.com --password "TuClave123" --panel admisiones
 *   pnpm create:staff-user -- --email blog@colegio.com --password "TuClave123" --panel blog --name "Editor Blog"
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
    // .env.local opcional si las variables ya están exportadas
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
const panel = getArg("panel") ?? "admisiones";
const fullName = getArg("name") ?? (panel === "blog" ? "Admin Blog" : "Admin Admisiones");
const title = getArg("title") ?? (panel === "blog" ? "Editor de Contenido" : "Coordinador de Admisiones");

if (!email || !password) {
  console.error(`
Uso:
  pnpm create:staff-user -- --email correo@dominio.com --password "ClaveSegura" --panel admisiones
  pnpm create:staff-user -- --email correo@dominio.com --password "ClaveSegura" --panel blog

Opciones:
  --email      Correo del usuario (requerido)
  --password   Contraseña (requerido, mín. 6 caracteres)
  --panel      admisiones | blog (default: admisiones)
  --name       Nombre completo
  --title      Cargo en staff_users
`);
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local");
  process.exit(1);
}

const role = panel === "blog" ? "author" : "editor";
const department = panel === "blog" ? "Blog" : "Admisiones";

const supabase = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createError) {
    console.error("Error al crear usuario:", createError.message);
    process.exit(1);
  }

  const userId = created.user.id;

  await supabase.from("profiles").upsert({
    id: userId,
    full_name: fullName,
    username: email.split("@")[0],
  });

  const { error: roleError } = await supabase.from("user_roles").insert({
    user_id: userId,
    role,
  });

  if (roleError && !roleError.message.includes("duplicate")) {
    console.error("Error al asignar rol:", roleError.message);
    process.exit(1);
  }

  const { error: staffError } = await supabase.from("staff_users").upsert({
    profile_id: userId,
    department,
    title,
    is_active: true,
  });

  if (staffError) {
    console.error("Error al registrar staff_users:", staffError.message);
    process.exit(1);
  }

  const dashboard = panel === "blog" ? "/admin" : "/admin/admisiones";

  console.log("\n✓ Usuario creado correctamente\n");
  console.log(`  Email:     ${email}`);
  console.log(`  Rol:       ${role}`);
  console.log(`  Panel:     ${panel}`);
  console.log(`  Dashboard: http://localhost:3000${dashboard}`);
  console.log(`  Login:     http://localhost:3000/login\n`);
}

main();
