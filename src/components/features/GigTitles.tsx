import { SectionCard } from "@/components/ui/SectionCard";
import { CopyButton } from "@/components/ui/CopyButton";

interface GigTitlesProps {
  titles: string[];
}

export function GigTitles({ titles }: GigTitlesProps) {
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  );

  return (
    <SectionCard title="Gig Titles" icon={icon} badge={`${titles.length} variations`}>
      <div className="space-y-2.5">
        {titles.map((title, i) => (
          <div
            key={i}
            className="group flex items-start gap-3 p-3.5 rounded-xl bg-white/3 border border-white/6 hover:border-violet-500/25 hover:bg-violet-500/5 transition-all"
          >
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <p className="flex-1 text-sm text-gray-200 leading-relaxed">{title}</p>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <CopyButton text={title} label="Copy" />
            </div>
          </div>
        ))}
        <div className="pt-1">
          <CopyButton
            text={titles.join("\n")}
            label="Copy All Titles"
            className="w-full justify-center py-2"
          />
        </div>
      </div>
    </SectionCard>
  );
}
