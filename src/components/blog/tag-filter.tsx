import { buildBlogListUrl } from "@/lib/blog/public";
import type { Tag } from "@/types/blog";
import Link from "next/link";

interface TagFilterProps {
  tags: Tag[];
  activeTag?: string;
}

export function TagFilter({ tags, activeTag }: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className="mb-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Filtrar por etiqueta
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          href={buildBlogListUrl()}
          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
            !activeTag
              ? "border-emerald-700 bg-emerald-700 text-white"
              : "border-zinc-200 bg-white text-zinc-600 hover:border-emerald-200 hover:text-emerald-800"
          }`}
        >
          Todas
        </Link>
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={buildBlogListUrl(1, tag.slug)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
              activeTag === tag.slug
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-emerald-200 hover:text-emerald-800"
            }`}
          >
            {tag.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
