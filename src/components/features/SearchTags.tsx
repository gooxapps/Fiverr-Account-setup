import { SectionCard } from "@/components/ui/SectionCard";
import { CopyButton } from "@/components/ui/CopyButton";

interface SearchTagsProps {
  tags: string[];
}

export function SearchTags({ tags }: SearchTagsProps) {
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );

  return (
    <SectionCard title="Search Tags" icon={icon} badge={`${tags.length} tags`}>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((tag, i) => (
          <div
            key={i}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/10 transition-all cursor-default"
          >
            <span className="text-violet-400/60 text-xs">#</span>
            <span className="text-sm text-gray-300">{tag}</span>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(tag);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
              title="Copy tag"
            >
              <svg className="w-3 h-3 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <CopyButton
        text={tags.join(", ")}
        label="Copy All Tags"
        className="w-full justify-center py-2"
      />
    </SectionCard>
  );
}
