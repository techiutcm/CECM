import { emailBrand } from "@/lib/email/brand";
import { createServiceClient } from "@/lib/supabase/service";

function parseFallbackEmails() {
  return (process.env.BLOG_MODERATOR_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export async function getBlogModeratorEmails(postAuthorId?: string | null) {
  const supabase = createServiceClient();
  const userIds = new Set<string>();

  const { data: roleRows } = await supabase
    .from("user_roles")
    .select("user_id")
    .in("role", ["admin", "editor"]);

  for (const row of roleRows ?? []) {
    userIds.add(row.user_id);
  }

  if (postAuthorId) {
    userIds.add(postAuthorId);
  }

  const emails = new Set<string>(parseFallbackEmails());

  if (userIds.size > 0) {
    const { data: authData } = await supabase.auth.admin.listUsers({ perPage: 1000 });

    for (const user of authData.users) {
      if (!user.email || !userIds.has(user.id)) continue;
      emails.add(user.email);
    }
  }

  if (emails.size === 0) {
    emails.add(emailBrand.contactEmail);
  }

  return Array.from(emails);
}
