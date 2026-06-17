import { AdminHeader } from "@/components/admin/admin-header";
import { requireAnyAdminAccess } from "@/lib/admin/guard";
import { hasRole } from "@/lib/api/auth";
import { getAdminPosts, getAdminStats } from "@/lib/admin/queries";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const user = await requireAnyAdminAccess();

  if (!hasRole(user.roles, "author")) {
    if (hasRole(user.roles, "editor")) {
      redirect("/admin/admisiones");
    }
    redirect("/?error=unauthorized");
  }
  const [stats, recentPosts] = await Promise.all([
    getAdminStats(user),
    getAdminPosts(user),
  ]);

  const cards = [
    { label: "Total posts", value: stats.total, href: "/admin/posts" },
    { label: "Publicados", value: stats.published, href: "/admin/posts" },
    { label: "Borradores", value: stats.draft, href: "/admin/posts" },
    ...(hasRole(user.roles, "editor")
      ? [
          {
            label: "Comentarios pendientes",
            value: stats.pendingComments,
            href: "/admin/comments",
          },
        ]
      : []),
  ];

  return (
    <>
      <AdminHeader
        user={user}
        title="Dashboard"
        description="Resumen general del blog"
      />
      <div className="flex-1 space-y-8 p-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
            >
              <p className="text-sm text-zinc-500">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-zinc-900">
                {card.value}
              </p>
            </Link>
          ))}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
            <h2 className="font-semibold text-zinc-900">Posts recientes</h2>
            <Link
              href="/admin/posts/new"
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Nuevo post
            </Link>
          </div>
          <div className="divide-y divide-zinc-100">
            {recentPosts.slice(0, 5).map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.id}/edit`}
                className="flex items-center justify-between px-6 py-4 transition hover:bg-zinc-50"
              >
                <div>
                  <p className="font-medium text-zinc-900">{post.title}</p>
                  <p className="text-sm text-zinc-500">/{post.slug}</p>
                </div>
                <span className="text-xs capitalize text-zinc-400">
                  {post.status}
                </span>
              </Link>
            ))}
            {recentPosts.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-zinc-500">
                Aún no hay posts.{" "}
                <Link href="/admin/posts/new" className="text-emerald-700">
                  Crea el primero
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
