import { CommentForm } from "@/components/blog/comment-form";
import { CommentList } from "@/components/blog/comment-list";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { SiteHeader } from "@/components/blog/site-header";
import { getAuthUser } from "@/lib/api/auth";
import {
  buildBlogListUrl,
  getApprovedComments,
  getPublishedPostBySlug,
} from "@/lib/blog/public";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) return { title: "Artículo no encontrado" };

  return {
    title: `${post.title} | Cristobal Mendoza`,
    description: post.excerpt ?? post.content.slice(0, 160),
  };
}

function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-VE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, user] = await Promise.all([
    getPublishedPostBySlug(slug),
    getAuthUser(),
  ]);

  if (!post) notFound();

  const approvedComments = await getApprovedComments(post.id);

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />

      <article className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-zinc-500 transition hover:text-emerald-700"
        >
          ← Volver al blog
        </Link>

        <header className="mt-8">
          {post.tags && post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
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

          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            {post.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <time dateTime={post.published_at ?? post.created_at}>
              {formatDate(post.published_at ?? post.created_at)}
            </time>
            {post.author?.full_name && (
              <>
                <span>·</span>
                <span>{post.author.full_name}</span>
              </>
            )}
          </div>

          {post.excerpt && (
            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              {post.excerpt}
            </p>
          )}
        </header>

        {post.cover_image_url && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-zinc-100">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        <div className="mt-10 border-t border-zinc-200 pt-10">
          <MarkdownContent content={post.content} />
        </div>
      </article>

      <section className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h2 className="text-xl font-bold text-zinc-900">
            Comentarios ({approvedComments.length})
          </h2>

          <div className="mt-8">
            <CommentList comments={approvedComments} />
          </div>

          <div className="mt-10 border-t border-zinc-100 pt-10">
            <h3 className="mb-4 text-sm font-semibold text-zinc-700">
              Deja un comentario
            </h3>
            <CommentForm postId={post.id} isAuthenticated={!!user} />
          </div>
        </div>
      </section>
    </div>
  );
}
