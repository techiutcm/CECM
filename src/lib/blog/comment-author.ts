import type { Comment } from "@/types/blog";
import { getPublicAuthorDisplayName } from "@/lib/blog/author-display";

export function getCommentAuthorName(comment: Comment) {
  const registeredName = getPublicAuthorDisplayName(comment.author);
  if (registeredName) {
    return registeredName;
  }

  if (comment.guest_name?.trim()) {
    return comment.guest_name.trim();
  }

  return "Visitante";
}
