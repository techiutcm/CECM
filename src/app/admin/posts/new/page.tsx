import { AdminHeader } from "@/components/admin/admin-header";
import { PostForm } from "@/components/admin/post-form";
import { requireAdminAccess } from "@/lib/admin/guard";
import { getAllTags } from "@/lib/admin/queries";

export default async function NewPostPage() {
  const user = await requireAdminAccess("author");
  const tags = await getAllTags();

  return (
    <>
      <AdminHeader
        user={user}
        title="Nuevo post"
        description="Crea un nuevo artículo para el blog"
      />
      <div className="flex-1 p-8">
        <div className="mx-auto max-w-3xl rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          <PostForm isNew tags={tags} />
        </div>
      </div>
    </>
  );
}
