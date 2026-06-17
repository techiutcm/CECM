import { buildBlogListUrl } from "@/lib/blog/public";
import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  tag?: string;
}

export function Pagination({ page, totalPages, total, tag }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <nav
      aria-label="Paginación de artículos"
      className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
    >
      <p className="text-sm text-zinc-500">
        Página {page} de {totalPages} · {total} artículo{total !== 1 ? "s" : ""}
      </p>

      <div className="flex items-center gap-1">
        {page > 1 ? (
          <Link
            href={buildBlogListUrl(page - 1, tag)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
          >
            ← Anterior
          </Link>
        ) : (
          <span className="rounded-lg border border-zinc-100 px-3 py-2 text-sm text-zinc-300">
            ← Anterior
          </span>
        )}

        <div className="hidden items-center gap-1 sm:flex">
          {pages.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-zinc-400">
                …
              </span>
            ) : (
              <Link
                key={p}
                href={buildBlogListUrl(p as number, tag)}
                className={`min-w-[2.25rem] rounded-lg border px-3 py-2 text-center text-sm font-medium transition ${
                  p === page
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {p}
              </Link>
            ),
          )}
        </div>

        {page < totalPages ? (
          <Link
            href={buildBlogListUrl(page + 1, tag)}
            className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
          >
            Siguiente →
          </Link>
        ) : (
          <span className="rounded-lg border border-zinc-100 px-3 py-2 text-sm text-zinc-300">
            Siguiente →
          </span>
        )}
      </div>
    </nav>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}
