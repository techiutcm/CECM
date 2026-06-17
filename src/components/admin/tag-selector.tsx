import type { Tag } from "@/types/blog";

interface TagSelectorProps {
  tags: Tag[];
  selectedIds?: string[];
}

export function TagSelector({ tags, selectedIds = [] }: TagSelectorProps) {
  const selectedSet = new Set(selectedIds);

  if (tags.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No hay etiquetas disponibles.{" "}
        <a href="/admin/tags" className="font-medium text-emerald-700 hover:underline">
          Crea la primera en Admin → Etiquetas
        </a>
        .
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <label
          key={tag.id}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm transition has-checked:border-emerald-600 has-checked:bg-emerald-50 has-checked:text-emerald-800"
        >
          <input
            type="checkbox"
            name="tag_ids"
            value={tag.id}
            defaultChecked={selectedSet.has(tag.id)}
            className="h-4 w-4 rounded border-zinc-300 text-emerald-700 focus:ring-emerald-500"
          />
          {tag.name}
        </label>
      ))}
    </div>
  );
}
