import { jsonError, jsonOk } from "@/lib/api/response";
import { POST_SELECT, mapPost } from "@/lib/blog/posts";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) return jsonError(error.message, 500);
  if (!data) return jsonError("Post no encontrado", 404);

  return jsonOk(mapPost(data as Record<string, unknown>));
}
