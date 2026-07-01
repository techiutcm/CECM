import type { Comment } from "@/types/blog";

export function getCommentAuthorName(comment: Comment) {
  if (comment.author?.full_name?.trim()) {
    return comment.author.full_name.trim();
  }

  if (comment.author?.username?.trim()) {
    return comment.author.username.trim();
  }

  if (comment.guest_name?.trim()) {
    return comment.guest_name.trim();
  }

  return "Visitante";
}
