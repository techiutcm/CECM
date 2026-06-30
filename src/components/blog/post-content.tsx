import { isHtmlContent, sanitizePostHtml } from "@/lib/blog/post-content";
import { MarkdownContent } from "@/components/blog/markdown-content";

interface PostContentProps {
  content: string;
}

export function PostContent({ content }: PostContentProps) {
  if (isHtmlContent(content)) {
    const safeHtml = sanitizePostHtml(content);

    return (
      <div
        className="prose prose-zinc max-w-none prose-headings:font-bold prose-headings:text-zinc-900 prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-sm"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    );
  }

  return <MarkdownContent content={content} />;
}
