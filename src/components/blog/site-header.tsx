import { getAuthUser, hasRole } from "@/lib/api/auth";
import { UserMenu } from "@/components/auth/user-menu";
import Link from "next/link";

export async function SiteHeader() {
  const user = await getAuthUser();
  const canAccessAdmin =
    user &&
    (hasRole(user.roles, "author") ||
      hasRole(user.roles, "editor") ||
      hasRole(user.roles, "admin"));

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="group">
          <p className="text-xs font-medium uppercase tracking-wider text-emerald-700">
            Blog
          </p>
          <h1 className="text-lg font-bold text-zinc-900 transition group-hover:text-emerald-800">
            Complejo Educativo Dr. Cristóbal Mendoza
          </h1>
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 sm:inline-flex"
          >
            Inicio
          </Link>
          {canAccessAdmin && (
            <Link
              href="/admin"
              className="hidden rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 sm:inline-flex"
            >
              Admin
            </Link>
          )}
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
