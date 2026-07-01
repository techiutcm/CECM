export type BlogRole = "reader" | "author" | "editor" | "admin";
export type PostStatus = "draft" | "published" | "archived";
export type CommentStatus = "pending" | "approved" | "rejected";
export type MediaType = "image" | "video";

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: BlogRole;
  granted_by: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  author_id: string;
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  author?: Profile;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface PostMedia {
  id: string;
  post_id: string;
  media_type: MediaType;
  storage_path: string;
  public_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string | null;
  guest_name: string | null;
  guest_email: string | null;
  parent_id: string | null;
  content: string;
  status: CommentStatus;
  created_at: string;
  updated_at: string;
  author?: Profile;
  post?: Pick<Post, "id" | "title" | "slug">;
  replies?: Comment[];
}

export interface AuthUser {
  id: string;
  email?: string;
  profile: Profile | null;
  roles: BlogRole[];
}
