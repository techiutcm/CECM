import { AdminHeader } from "@/components/admin/admin-header";
import { CommentActions } from "@/components/admin/comment-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { requireAdminAccess } from "@/lib/admin/guard";
import { getPendingComments } from "@/lib/admin/queries";

export default async function AdminCommentsPage() {
  const user = await requireAdminAccess("editor");
  const comments = await getPendingComments();

  return (
    <>
      <AdminHeader
        user={user}
        title="Comentarios"
        description="Modera los comentarios pendientes de aprobación"
      />
      <div className="flex-1 p-8">
        <div className="space-y-4">
          {comments.map((comment) => {
            const post = comment.post as
              | { id: string; title: string; slug: string }
              | undefined;
            const author = comment.author;

            return (
              <article
                key={comment.id}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={comment.status} />
                      {post && (
                        <span className="text-sm text-zinc-500">
                          en{" "}
                          <span className="font-medium text-zinc-700">
                            {post.title}
                          </span>
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-zinc-800">{comment.content}</p>
                    <p className="mt-3 text-xs text-zinc-400">
                      {author?.full_name ?? author?.username ?? "Anónimo"} ·{" "}
                      {new Date(comment.created_at).toLocaleString("es-VE")}
                    </p>
                  </div>
                  <CommentActions commentId={comment.id} />
                </div>
              </article>
            );
          })}

          {comments.length === 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white px-6 py-16 text-center shadow-sm">
              <p className="text-sm text-zinc-500">
                No hay comentarios pendientes de moderación.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
