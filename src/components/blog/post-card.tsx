import { buildBlogListUrl } from "@/lib/blog/public";
import { getPublicAuthorDisplayName } from "@/lib/blog/author-display";
import type { Post } from "@/types/blog";
import Image from "next/image";
import Link from "next/link";

interface PostCardProps {
  post: Post;
}

function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostCard({ post }: PostCardProps) {
  const authorName = getPublicAuthorDisplayName(post.author);

  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md">
      <Link href={`/blog/${post.slug}`}>
        <div className="relative aspect-[16/9] overflow-hidden bg-zinc-100">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-50 to-zinc-100">
              <span className="text-4xl font-bold text-emerald-200">
                {post.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 pb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
            <time dateTime={post.published_at ?? post.created_at}>
              {formatDate(post.published_at ?? post.created_at)}
            </time>
            {authorName && (
              <>
                <span>·</span>
                <span>{authorName}</span>
              </>
            )}
          </div>

          <h2 className="mt-3 text-xl font-bold text-zinc-900 transition group-hover:text-emerald-800">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-600">
              {post.excerpt}
            </p>
          )}
        </div>
      </Link>

      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 px-6 pb-6">
          {post.tags.map((tag) => (
            <Link
              key={tag.id}
              href={buildBlogListUrl(1, tag.slug)}
              className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
