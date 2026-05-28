import { SectionCard } from "@/components/ui/SectionCard";
import { CopyButton } from "@/components/ui/CopyButton";
import { ThumbnailIdea } from "@/types";

interface ThumbnailIdeasProps {
  ideas: ThumbnailIdea[];
}

export function ThumbnailIdeas({ ideas }: ThumbnailIdeasProps) {
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  return (
    <SectionCard title="Thumbnail Ideas" icon={icon} badge={`${ideas.length} concepts`}>
      <div className="space-y-4">
        {ideas.map((idea, i) => (
          <div key={i} className="rounded-xl border border-white/8 overflow-hidden">
            {/* Thumbnail Preview */}
            <div
              className="h-28 relative flex items-center justify-center p-4"
              style={{
                background: `linear-gradient(135deg, ${idea.colors[1] || "#0a0a1a"}, ${idea.colors[0] || "#6C63FF"})`,
              }}
            >
              <div className="text-center">
                <p className="text-white font-bold text-base leading-tight drop-shadow-lg">
                  {idea.headline}
                </p>
                <p className="text-white/70 text-xs mt-1">{idea.subtext}</p>
              </div>
              <div className="absolute top-2 left-2 flex gap-1">
                {idea.colors.map((color, ci) => (
                  <div
                    key={ci}
                    className="w-4 h-4 rounded-full border border-white/20 shadow"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-0.5">
                <span className="text-white/70 text-[9px] font-medium">Concept {i + 1}</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Composition</p>
                <p className="text-xs text-gray-400 leading-relaxed">{idea.composition}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Canva Prompt</p>
                <div className="bg-white/3 border border-white/8 rounded-lg p-2.5">
                  <p className="text-xs text-gray-300 leading-relaxed font-mono">{idea.canvaPrompt}</p>
                </div>
              </div>
              <CopyButton text={idea.canvaPrompt} label="Copy Canva Prompt" className="w-full justify-center" />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
