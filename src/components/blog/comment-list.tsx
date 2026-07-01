import { getCommentAuthorName } from "@/lib/blog/comment-author";
import type { Comment } from "@/types/blog";

interface CommentListProps {
  comments: Comment[];
}

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  const authorName = getCommentAuthorName(comment);

  return (
    <div className={isReply ? "ml-8 border-l-2 border-zinc-100 pl-4" : ""}>
      <div className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-zinc-900">{authorName}</p>
          <time
            className="text-xs text-zinc-400"
            dateTime={comment.created_at}
          >
            {new Date(comment.created_at).toLocaleDateString("es-VE", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </time>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-zinc-700">
          {comment.content}
        </p>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Sé el primero en comentar este artículo.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
