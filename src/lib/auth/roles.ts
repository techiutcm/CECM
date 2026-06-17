import type { BlogRole } from "@/types/blog";

export function hasRole(roles: BlogRole[], required: BlogRole): boolean {
  const hierarchy: Record<BlogRole, BlogRole[]> = {
    reader: ["reader", "author", "editor", "admin"],
    author: ["author", "editor", "admin"],
    editor: ["editor", "admin"],
    admin: ["admin"],
  };

  return roles.some((role) => hierarchy[required].includes(role));
}
