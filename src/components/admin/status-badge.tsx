import type { CommentStatus, PostStatus } from "@/types/blog";

const postStyles: Record<PostStatus, string> = {
  draft: "bg-amber-50 text-amber-700 border-amber-200",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200",
  archived: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

const commentStyles: Record<CommentStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const labels: Record<string, string> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
};

interface StatusBadgeProps {
  status: PostStatus | CommentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style =
    status in postStyles
      ? postStyles[status as PostStatus]
      : commentStyles[status as CommentStatus];

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {labels[status] ?? status}
    </span>
  );
}
