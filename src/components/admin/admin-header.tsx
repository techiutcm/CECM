import { signOut } from "@/app/actions/auth";
import type { AuthUser } from "@/types/blog";

interface AdminHeaderProps {
  user: AuthUser;
  title: string;
  description?: string;
}

export function AdminHeader({ user, title, description }: AdminHeaderProps) {
  const displayName =
    user.profile?.full_name ?? user.profile?.username ?? user.email ?? "Usuario";

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-8 py-5">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-zinc-500">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-zinc-900">{displayName}</p>
          <p className="text-xs capitalize text-zinc-500">
            {user.roles[user.roles.length - 1]}
          </p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-50"
          >
            Salir
          </button>
        </form>
      </div>
    </header>
  );
}
