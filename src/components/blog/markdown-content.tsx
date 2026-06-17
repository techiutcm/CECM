import Markdown from "react-markdown";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="prose prose-zinc max-w-none prose-headings:font-bold prose-headings:text-zinc-900 prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-pre:bg-zinc-900">
      <Markdown>{content}</Markdown>
    </div>
  );
}
