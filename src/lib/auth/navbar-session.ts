import { hasRole } from "@/lib/auth/roles";
import type { AuthUser } from "@/types/blog";

export interface NavbarSession {
  firstName: string;
  initial: string;
  panelHref: string | null;
}

export function buildNavbarSession(user: AuthUser): NavbarSession {
  const displayName =
    user.profile?.full_name ??
    user.profile?.username ??
    user.email?.split("@")[0] ??
    "Usuario";
  const firstName = displayName.trim().split(/\s+/)[0] ?? "Usuario";
  const initial = firstName.charAt(0).toUpperCase();

  let panelHref: string | null = null;

  if (hasRole(user.roles, "author") || hasRole(user.roles, "admin")) {
    panelHref = "/admin";
  } else if (hasRole(user.roles, "editor")) {
    panelHref = "/admin/admisiones";
  }

  return { firstName, initial, panelHref };
}
