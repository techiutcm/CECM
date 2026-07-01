import type { Profile } from "@/types/blog";

type AuthorProfile = Pick<Profile, "full_name" | "username"> | null | undefined;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function looksLikeEmail(value: string) {
  return EMAIL_PATTERN.test(value.trim());
}

export function getPublicAuthorDisplayName(author: AuthorProfile) {
  const fullName = author?.full_name?.trim();
  if (fullName && !looksLikeEmail(fullName)) {
    return fullName;
  }

  const username = author?.username?.trim();
  if (username && !looksLikeEmail(username)) {
    return username;
  }

  return null;
}

export function sanitizePublicAuthor<T extends AuthorProfile>(author: T): T | undefined {
  if (!author) return undefined;

  const fullName = author.full_name?.trim();
  const username = author.username?.trim();

  return {
    ...author,
    full_name:
      fullName && !looksLikeEmail(fullName) ? fullName : null,
    username:
      username && !looksLikeEmail(username) ? username : null,
  };
}
