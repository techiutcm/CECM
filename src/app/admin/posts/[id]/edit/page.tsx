import { AdminHeader } from "@/components/admin/admin-header";
import { PostForm } from "@/components/admin/post-form";
import { requireAdminAccess } from "@/lib/admin/guard";
import { getAdminPostById, getAllTags } from "@/lib/admin/queries";
import { notFound } from "next/navigation";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}

export default async function EditPostPage({
  params,
  searchParams,
}: EditPostPageProps) {
  const user = await requireAdminAccess("author");
  const { id } = await params;
  const { created } = await searchParams;
  const [post, tags] = await Promise.all([
    getAdminPostById(user, id),
    getAllTags(),
  ]);

  if (!post) notFound();

  return (
    <>
      <AdminHeader
        user={user}
        title="Editar post"
        description={post.title}
      />
      <div className="flex-1 p-8">
        {created === "1" && (
          <div className="mx-auto mb-4 max-w-6xl rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Post creado. Puedes seguir editándolo aquí.
          </div>
        )}
        <div className="mx-auto max-w-6xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
          <PostForm post={post} tags={tags} />
        </div>
      </div>
    </>
  );
}
