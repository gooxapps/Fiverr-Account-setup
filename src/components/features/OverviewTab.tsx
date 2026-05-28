import { useState } from "react";
import { GigData } from "@/types";
import { CopyButton } from "@/components/ui/CopyButton";
import { SectionCard } from "@/components/ui/SectionCard";

interface OverviewTabProps {
  gig: GigData;
}

export function OverviewTab({ gig }: OverviewTabProps) {
  const titleLen = gig.title.length;
  const titleColor =
    titleLen <= 60 ? "text-emerald-400" : titleLen <= 75 ? "text-amber-400" : "text-red-400";

  const titleIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  );
  const catIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
  const tagIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );

  return (
    <div className="space-y-5">
      {/* Gig Title */}
      <SectionCard title="Gig Title" icon={titleIcon}>
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white/4 border border-white/8">
            <p className="text-white text-sm leading-relaxed font-medium">{gig.title}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-48 bg-white/8 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    titleLen <= 60 ? "bg-emerald-500" : titleLen <= 75 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min((titleLen / 80) * 100, 100)}%` }}
                />
              </div>
              <span className={`text-xs font-semibold ${titleColor}`}>
                {titleLen} / 80 chars
              </span>
              {titleLen <= 60 && (
                <span className="text-xs text-emerald-400">· Just perfect!</span>
              )}
            </div>
            <CopyButton text={gig.title} label="Copy Title" />
          </div>
          <p className="text-xs text-gray-500">
            Fiverr recommends 60–80 characters. Include keywords buyers would search for.
          </p>
        </div>
      </SectionCard>

      {/* Category */}
      <SectionCard title="Category" icon={catIcon}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</p>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/4 border border-white/8">
              <svg className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-white">{gig.category}</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Sub-Category</p>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/4 border border-white/8">
              <svg className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-white">{gig.subCategory}</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Navigate to this category in the Fiverr gig editor to set these fields.
        </p>
      </SectionCard>

      {/* Search Tags */}
      <SectionCard title="Search Tags" icon={tagIcon} badge={`${gig.tags.length} / 5 tags`}>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {gig.tags.map((tag, i) => (
              <TagChip key={i} tag={tag} index={i} />
            ))}
          </div>
          <div className="pt-1 border-t border-white/6">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Positive Keywords</p>
            <div className="flex flex-wrap gap-2">
              {gig.positiveKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
          <CopyButton
            text={gig.tags.join(", ")}
            label="Copy Tags"
            className="w-full justify-center py-2 mt-1"
          />
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Use all 5 tags. Fiverr shows your gig more when all tag slots are filled. Letters and numbers only.
        </p>
      </SectionCard>
    </div>
  );
}

function TagChip({ tag, index }: { tag: string; index: number }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(tag);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/10 transition-all"
    >
      <span className="text-[10px] text-violet-400/70 font-bold">{index + 1}</span>
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{tag}</span>
      {copied ? (
        <svg className="w-3 h-3 text-emerald-400 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3 h-3 text-violet-400 opacity-0 group-hover:opacity-100 ml-0.5 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}
