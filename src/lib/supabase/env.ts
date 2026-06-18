function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function getSupabasePublishableKey(): string | undefined {
  return (
    readEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") ??
    readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}

export function getSupabaseEnvOptional():
  | { url: string; publishableKey: string }
  | null {
  const url = readEnv("NEXT_PUBLIC_SUPABASE_URL");
  const publishableKey = getSupabasePublishableKey();

  if (!url || !publishableKey) return null;

  return { url, publishableKey };
}

export function getSupabaseEnv() {
  const env = getSupabaseEnvOptional();

  if (!env) {
    throw new Error(
      "Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (o NEXT_PUBLIC_SUPABASE_ANON_KEY)",
    );
  }

  return env;
}
