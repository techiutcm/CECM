import { signOut } from "@/app/actions/auth";
import type { AuthUser } from "@/types/blog";
import Link from "next/link";

interface UserMenuProps {
  user: AuthUser;
}

export function UserMenu({ user }: UserMenuProps) {
  const displayName =
    user.profile?.full_name ?? user.profile?.username ?? user.email ?? "Usuario";
  const primaryRole = user.roles.includes("admin")
    ? "admin"
    : user.roles.includes("editor")
      ? "editor"
      : user.roles.includes("author")
        ? "author"
        : "reader";

  return (
    <div className="flex items-center gap-4">
      <div className="hidden text-right sm:block">
        <p className="text-sm font-medium text-zinc-900">{displayName}</p>
        <p className="text-xs capitalize text-zinc-500">{primaryRole}</p>
      </div>
      <Link
        href="/login"
        className="text-sm text-zinc-600 hover:text-zinc-900 sm:hidden"
      >
        Cuenta
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
