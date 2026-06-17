import { hasRole } from "@/lib/auth/roles";
import type { AuthUser, BlogRole } from "@/types/blog";

const BLOG_ADMIN_PREFIX = "/admin";
const ADMISSIONS_ADMIN_PREFIX = "/admin/admisiones";

export function canAccessAdminPath(roles: BlogRole[], path: string): boolean {
  if (path.startsWith(ADMISSIONS_ADMIN_PREFIX)) {
    return hasRole(roles, "editor");
  }

  if (path.startsWith(BLOG_ADMIN_PREFIX)) {
    return hasRole(roles, "author");
  }

  return path === "/" || !path.startsWith("/admin");
}

export function getPostLoginRedirect(
  user: AuthUser,
  options?: {
    explicitRedirect?: string | null;
    staffDepartment?: string | null;
  },
): string {
  const explicit = options?.explicitRedirect?.trim();

  if (explicit && explicit !== "/" && canAccessAdminPath(user.roles, explicit)) {
    return explicit;
  }

  const isAdmin = hasRole(user.roles, "admin");
  const isEditor = hasRole(user.roles, "editor");
  const isAuthor = hasRole(user.roles, "author");
  const isAdmissionsStaff = options?.staffDepartment === "Admisiones";

  if (isAdmissionsStaff || (isEditor && !isAuthor && !isAdmin)) {
    return ADMISSIONS_ADMIN_PREFIX;
  }

  if (isAuthor || isAdmin) {
    return BLOG_ADMIN_PREFIX;
  }

  if (isEditor) {
    return ADMISSIONS_ADMIN_PREFIX;
  }

  return "/";
}

export function getAdminPanelLabel(
  user: AuthUser,
  staffDepartment?: string | null,
): "blog" | "admisiones" | "ninguno" {
  const redirect = getPostLoginRedirect(user, { staffDepartment });
  if (redirect.startsWith(ADMISSIONS_ADMIN_PREFIX)) return "admisiones";
  if (redirect.startsWith(BLOG_ADMIN_PREFIX)) return "blog";
  return "ninguno";
}
