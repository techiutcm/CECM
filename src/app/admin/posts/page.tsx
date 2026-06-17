import { AdminHeader } from "@/components/admin/admin-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { requireAdminAccess } from "@/lib/admin/guard";
import { getAdminPosts } from "@/lib/admin/queries";
import Link from "next/link";

export default async function AdminPostsPage() {
  const user = await requireAdminAccess("author");
  const posts = await getAdminPosts(user);

  return (
    <>
      <AdminHeader
        user={user}
        title="Posts"
        description="Gestiona los artículos del blog"
      />
      <div className="flex-1 p-8">
        <div className="mb-6 flex justify-end">
          <Link
            href="/admin/posts/new"
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            + Nuevo post
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50">
              <tr>
                <th className="px-6 py-3 font-medium text-zinc-500">Título</th>
                <th className="px-6 py-3 font-medium text-zinc-500">Estado</th>
                <th className="hidden px-6 py-3 font-medium text-zinc-500 md:table-cell">
                  Actualizado
                </th>
                <th className="px-6 py-3 font-medium text-zinc-500" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-zinc-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-zinc-900">{post.title}</p>
                    <p className="text-xs text-zinc-400">/{post.slug}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="hidden px-6 py-4 text-zinc-500 md:table-cell">
                    {new Date(post.updated_at).toLocaleDateString("es-VE")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-sm font-medium text-emerald-700 hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <p className="px-6 py-12 text-center text-sm text-zinc-500">
              No hay posts todavía.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
