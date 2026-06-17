import { AdminHeader } from "@/components/admin/admin-header";
import { CreateTagForm } from "@/components/admin/create-tag-form";
import { requireAdminAccess } from "@/lib/admin/guard";
import { getAllTags } from "@/lib/admin/queries";

export default async function AdminTagsPage() {
  const user = await requireAdminAccess("editor");
  const tags = await getAllTags();

  return (
    <>
      <AdminHeader
        user={user}
        title="Etiquetas"
        description="Gestiona las etiquetas del blog"
      />
      <div className="flex-1 space-y-8 p-8">
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">
            Nueva etiqueta
          </h2>
          <CreateTagForm />
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 px-6 py-4">
            <h2 className="font-semibold text-zinc-900">
              Etiquetas ({tags.length})
            </h2>
          </div>
          <ul className="divide-y divide-zinc-100">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <span className="font-medium text-zinc-900">{tag.name}</span>
                <span className="text-sm text-zinc-400">/{tag.slug}</span>
              </li>
            ))}
            {tags.length === 0 && (
              <li className="px-6 py-12 text-center text-sm text-zinc-500">
                No hay etiquetas creadas.
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
