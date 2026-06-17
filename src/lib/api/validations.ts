import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).optional(),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  cover_image_url: z.string().url().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  tag_ids: z.array(z.string().uuid()).optional(),
});

export const updatePostSchema = createPostSchema.partial();

export const createCommentSchema = z.object({
  content: z.string().min(1).max(2000),
  parent_id: z.string().uuid().optional().nullable(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(2000).optional(),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
});

export const createMediaSchema = z.object({
  media_type: z.enum(["image", "video"]),
  storage_path: z.string().min(1),
  public_url: z.string().url(),
  alt_text: z.string().max(200).optional().nullable(),
  sort_order: z.number().int().min(0).default(0),
});

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(30).optional().nullable(),
  full_name: z.string().max(100).optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
});

export const assignRoleSchema = z.object({
  user_id: z.string().uuid(),
  role: z.enum(["reader", "author", "editor", "admin"]),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
