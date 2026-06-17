import { Pagination } from "@/components/blog/pagination";
import { PostCard } from "@/components/blog/post-card";
import { SiteHeader } from "@/components/blog/site-header";
import { TagFilter } from "@/components/blog/tag-filter";
import { getPublishedPosts, getPublishedTags } from "@/lib/blog/public";

interface BlogPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export const metadata = {
  title: "Blog",
  description: "Artículos y noticias del Complejo Educativo",
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const tag = params.tag?.trim() || undefined;

  const [{ items: posts, pagination }, tags] = await Promise.all([
    getPublishedPosts({ page, tagSlug: tag }),
    getPublishedTags(),
  ]);

  const activeTag = tags.find((t) => t.slug === tag);
  const sectionTitle = activeTag
    ? `Artículos en "${activeTag.name}"`
    : "Artículos recientes";

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader />

      <section className="border-b border-zinc-200 bg-gradient-to-b from-emerald-50/50 to-zinc-50">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <p className="text-sm font-medium uppercase tracking-wider text-emerald-700">
            Blog
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl">
            Noticias y artículos
          </h2>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <TagFilter tags={tags} activeTag={tag} />

        <h3 className="mb-8 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          {sectionTitle}
        </h3>

        {posts.length > 0 ? (
          <>
            <div className="grid gap-8 sm:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              tag={tag}
            />
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
            <p className="text-lg font-medium text-zinc-700">
              {tag
                ? `No hay artículos con la etiqueta "${activeTag?.name ?? tag}"`
                : "Aún no hay artículos publicados"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
