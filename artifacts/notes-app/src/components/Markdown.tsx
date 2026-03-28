import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={cn(
      "prose prose-slate max-w-none",
      "prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tight",
      "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
      "prose-p:leading-relaxed prose-p:text-gray-700",
      "prose-a:text-accent prose-a:font-medium hover:prose-a:text-accent/80",
      "prose-strong:font-semibold prose-strong:text-gray-900",
      "prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none",
      "prose-pre:bg-gray-900 prose-pre:text-gray-100",
      "prose-blockquote:border-l-4 prose-blockquote:border-accent/50 prose-blockquote:bg-accent/5 prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:italic prose-blockquote:text-gray-700",
      "prose-ul:list-disc prose-ol:list-decimal prose-li:my-1",
      "marker:text-accent",
      className
    )}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
