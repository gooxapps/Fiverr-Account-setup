import { SectionCard } from "@/components/ui/SectionCard";
import { CopyButton } from "@/components/ui/CopyButton";

interface BuyerRequirementsProps {
  requirements: string[];
}

export function BuyerRequirements({ requirements }: BuyerRequirementsProps) {
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  );

  return (
    <SectionCard title="Buyer Requirements" icon={icon} badge={`${requirements.length} prompts`}>
      <div className="space-y-2 mb-4">
        {requirements.map((req, i) => (
          <div
            key={i}
            className="group flex items-start gap-3 p-3.5 rounded-xl bg-white/3 border border-white/6 hover:border-emerald-500/25 hover:bg-emerald-500/5 transition-all"
          >
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <p className="flex-1 text-sm text-gray-300 leading-relaxed">{req}</p>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <CopyButton text={req} />
            </div>
          </div>
        ))}
      </div>
      <CopyButton
        text={requirements.map((r, i) => `${i + 1}. ${r}`).join("\n")}
        label="Copy All Requirements"
        className="w-full justify-center py-2"
      />
    </SectionCard>
  );
}
