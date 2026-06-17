import { requireAuth } from "@/lib/api/auth";
import { jsonCreated, jsonError, jsonOk } from "@/lib/api/response";
import { slugify } from "@/lib/api/slug";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const createTagSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50).optional(),
});

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .select("*")
    .order("name", { ascending: true });

  if (error) return jsonError(error.message, 500);
  return jsonOk(data ?? []);
}

export async function POST(request: Request) {
  const auth = await requireAuth("editor");
  if (!auth.user) return jsonError(auth.error!, auth.status);

  const body = await request.json();
  const parsed = createTagSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Datos inválidos");
  }

  const slug = slugify(parsed.data.slug ?? parsed.data.name);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tags")
    .insert({ name: parsed.data.name, slug })
    .select("*")
    .single();

  if (error) return jsonError(error.message, 500);
  return jsonCreated(data);
}
