import { getAuthUser, hasRole } from "@/lib/api/auth";
import type { AuthUser, BlogRole } from "@/types/blog";
import { redirect } from "next/navigation";

export async function requireAnyAdminAccess(): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const canAccessBlog = hasRole(user.roles, "author");
  const canAccessAdmissions = hasRole(user.roles, "editor");

  if (!canAccessBlog && !canAccessAdmissions) {
    redirect("/?error=unauthorized");
  }

  return user;
}

export async function requireAdminAccess(
  minRole: BlogRole = "author",
): Promise<AuthUser> {
  const user = await getAuthUser();

  if (!user) {
    const loginPath =
      minRole === "editor"
        ? "/login?redirect=/admin/admisiones"
        : "/login?redirect=/admin";
    redirect(loginPath);
  }

  if (!hasRole(user.roles, minRole)) {
    redirect("/?error=unauthorized");
  }

  return user;
}
