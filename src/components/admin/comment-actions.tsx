"use client";

import { moderateCommentAction } from "@/app/admin/actions/comments";
import { useTransition } from "react";

interface CommentActionsProps {
  commentId: string;
}

export function CommentActions({ commentId }: CommentActionsProps) {
  const [isPending, startTransition] = useTransition();

  function handleAction(status: "approved" | "rejected") {
    startTransition(async () => {
      await moderateCommentAction(commentId, status);
    });
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleAction("approved")}
        className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
      >
        Aprobar
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleAction("rejected")}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
      >
        Rechazar
      </button>
    </div>
  );
}
