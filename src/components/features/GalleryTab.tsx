import { useState } from "react";
import { GigData } from "@/types";
import { CopyButton } from "@/components/ui/CopyButton";
import { SectionCard } from "@/components/ui/SectionCard";

interface GalleryTabProps {
  gig: GigData;
}

type VideoTab = "gemini" | "sora" | "veo" | "script";

const videoTabs: { id: VideoTab; label: string; icon: string; desc: string; color: string }[] = [
  { id: "gemini", label: "Gemini / Veo 3", icon: "G", desc: "Google AI", color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400" },
  { id: "sora",   label: "Sora",           icon: "S", desc: "OpenAI",   color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400" },
  { id: "veo",    label: "Veo 2",          icon: "V", desc: "Google",   color: "from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400" },
  { id: "script", label: "Script Outline", icon: "📋", desc: "Voice-over", color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400" },
];

export function GalleryTab({ gig }: GalleryTabProps) {
  const [activeVideoTab, setActiveVideoTab] = useState<VideoTab>("gemini");
  const [generatedImages, setGeneratedImages] = useState<Record<number, string>>({});

  const thumbnailIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const videoIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.277A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
    </svg>
  );

  const activePrompt =
    activeVideoTab === "gemini" ? gig.videoPrompt.gemini :
    activeVideoTab === "sora"   ? gig.videoPrompt.sora :
    activeVideoTab === "veo"    ? gig.videoPrompt.veo :
    gig.videoPrompt.scriptOutline;

  const activeTabInfo = videoTabs.find((t) => t.id === activeVideoTab)!;

  return (
    <div className="space-y-5">
      {/* Gallery requirements tip */}
      <div className="rounded-xl border border-white/8 p-4 bg-white/2">
        <div className="flex items-start gap-3">
          <svg className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-white mb-1">Fiverr Gallery Requirements</p>
            <ul className="text-xs text-gray-400 space-y-1 leading-relaxed">
              <li>• <span className="text-gray-300">Images:</span> Up to 3 — JPG or PNG, min 550×370px, max 10MB each</li>
              <li>• <span className="text-gray-300">Video (optional):</span> MP4 or MOV, max 75MB, 10–75 seconds, no external promotional content</li>
              <li>• <span className="text-gray-300">Documents (optional):</span> Up to 2 PDFs showing work samples or process</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── VIDEO PROMPT GENERATOR ── */}
      <SectionCard title="Gig Video Prompt Generator" icon={videoIcon} badge="AI Video Tools">
        {/* Info row */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/4 border border-white/8 text-xs text-gray-400">
            <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
            Duration: {gig.videoPrompt.duration}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/4 border border-white/8 text-xs text-gray-400">
            <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/></svg>
            Style: {gig.videoPrompt.style.split(" ").slice(0, 3).join(" ")}...
          </div>
        </div>

        {/* How to use banner */}
        <div className="rounded-xl bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20 p-3.5 mb-4">
          <div className="flex items-start gap-2.5">
            <svg className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.75 3.75 0 01-5.303 0l-.347-.347z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-white mb-0.5">How to use these prompts</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                Copy any prompt below → open <span className="text-violet-300 font-medium">Google Gemini</span>, <span className="text-emerald-300 font-medium">Sora</span>, or <span className="text-blue-300 font-medium">Veo</span> → paste and generate your gig video. Each prompt is niche-specific to your service: <span className="text-white font-medium">"{gig.serviceInput}"</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Platform tab switcher */}
        <div className="grid grid-cols-4 gap-1.5 mb-4">
          {videoTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveVideoTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                activeVideoTab === tab.id
                  ? `bg-gradient-to-b ${tab.color} scale-[1.02]`
                  : "bg-white/3 border-white/8 text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              <span className={`text-base leading-none ${activeVideoTab === tab.id ? "" : "opacity-50"}`}>
                {tab.icon.length === 1 ? (
                  <span className="font-black">{tab.icon}</span>
                ) : tab.icon}
              </span>
              <span className="truncate w-full text-center text-[10px]">{tab.label}</span>
              <span className={`text-[9px] font-normal ${activeVideoTab === tab.id ? "opacity-70" : "opacity-40"}`}>
                {tab.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Active prompt display */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${activeTabInfo.color.split(" ").find(c => c.startsWith("text-"))}`}>
                {activeVideoTab === "script" ? "Script / Voice-over Outline" : `${activeTabInfo.label} Prompt`}
              </span>
              <span className="text-[10px] text-gray-600">· niche-specific to "{gig.serviceInput}"</span>
            </div>
            <span className="text-[10px] text-gray-600">{activePrompt.length} chars</span>
          </div>

          <div className="relative rounded-xl bg-black/40 border border-white/8 overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/6 bg-white/2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/60" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <div className="w-2 h-2 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[10px] text-gray-500 font-mono">
                {activeVideoTab === "script" ? "script-outline.txt" : `${activeVideoTab}-video-prompt.txt`}
              </span>
            </div>
            <pre className="p-4 text-xs text-gray-300 whitespace-pre-wrap leading-relaxed font-mono max-h-80 overflow-y-auto">
              {activePrompt}
            </pre>
          </div>

          <div className="flex items-center gap-2">
            <CopyButton
              text={activePrompt}
              label={`Copy ${activeVideoTab === "script" ? "Script Outline" : activeTabInfo.label + " Prompt"}`}
              className="flex-1 justify-center py-2.5"
            />
            <CopyButton
              text={[
                `=== GIG VIDEO PROMPT — ${activeTabInfo.label.toUpperCase()} ===`,
                `Service: ${gig.serviceInput}`,
                `Duration: ${gig.videoPrompt.duration}`,
                `Style: ${gig.videoPrompt.style}`,
                "",
                activePrompt,
              ].join("\n")}
              label="Copy with Context"
            />
          </div>

          {/* Platform-specific tips */}
          {activeVideoTab === "gemini" && (
            <div className="text-xs text-gray-500 bg-blue-500/5 border border-blue-500/15 rounded-lg px-3 py-2 leading-relaxed">
              <span className="text-blue-400 font-semibold">Gemini tip:</span> Go to <span className="text-gray-300">gemini.google.com</span> → use Gemini 2.0 Flash or Ultra → paste prompt. For video generation use <span className="text-gray-300">Google Veo</span> via VideoFX or Vertex AI.
            </div>
          )}
          {activeVideoTab === "sora" && (
            <div className="text-xs text-gray-500 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2 leading-relaxed">
              <span className="text-emerald-400 font-semibold">Sora tip:</span> Go to <span className="text-gray-300">sora.com</span> (ChatGPT Plus/Pro required) → paste prompt → select 16:9 landscape → 720p → generate. Trim to under 75MB before uploading to Fiverr.
            </div>
          )}
          {activeVideoTab === "veo" && (
            <div className="text-xs text-gray-500 bg-violet-500/5 border border-violet-500/15 rounded-lg px-3 py-2 leading-relaxed">
              <span className="text-violet-400 font-semibold">Veo 2 tip:</span> Access via <span className="text-gray-300">Google VideoFX</span> (labs.google) or <span className="text-gray-300">Vertex AI</span>. Select 16:9 · 720p · 30–45s. Export as MP4 under 75MB for Fiverr gallery.
            </div>
          )}
          {activeVideoTab === "script" && (
            <div className="text-xs text-gray-500 bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2 leading-relaxed">
              <span className="text-amber-400 font-semibold">Script tip:</span> Use this outline for a voice-over recording or text-to-speech (ElevenLabs, Murf.ai). Combine with screen recordings of your work for a DIY gig video without AI video generation.
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── THUMBNAIL IDEAS ── */}
      <SectionCard title="Thumbnail Ideas" icon={thumbnailIcon} badge={`${gig.thumbnailIdeas.length} concepts`}>
        <div className="space-y-6">
          {gig.thumbnailIdeas.map((idea, i) => (
            <div key={i} className="rounded-xl border border-white/8 overflow-hidden">
              {/* Preview at 550:370 ratio */}
              <div
                className="relative w-full flex items-center justify-center p-5 overflow-hidden"
                style={{
                  aspectRatio: "550 / 370",
                  background: `linear-gradient(135deg, ${idea.colors[1] || "#0a0a1a"} 0%, ${idea.colors[0] || "#6C63FF"} 100%)`,
                  maxHeight: 280,
                }}
              >
                {generatedImages[i] ? (
                  <img 
                    src={generatedImages[i]} 
                    alt="AI Generated Thumbnail" 
                    className="absolute inset-0 w-full h-full object-cover" 
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 opacity-10" style={{
                      backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)"
                    }} />
                    <div className="relative text-center">
                      <p className="text-white font-black text-xl md:text-2xl leading-tight drop-shadow-lg">
                        {idea.headline}
                      </p>
                      <p className="text-white/70 text-sm mt-2">{idea.subtext}</p>
                    </div>
                  </>
                )}

                <div className="absolute top-2.5 left-2.5 flex gap-1">
                  {idea.colors.map((color, ci) => (
                    <div key={ci} className="w-4 h-4 rounded-full border border-white/25 shadow" style={{ backgroundColor: color }} title={color} />
                  ))}
                </div>
                <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-0.5">
                  <span className="text-white/70 text-[9px] font-semibold">Concept {i + 1}</span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-black/40 backdrop-blur-sm rounded px-1.5 py-0.5">
                  <span className="text-white/50 text-[9px]">550 × 370px</span>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-3 bg-white/2">
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Composition</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{idea.composition}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Canva Prompt
                    <span className="ml-2 text-[9px] normal-case text-gray-600">— paste into Canva AI or Magic Design</span>
                  </p>
                  <div className="bg-black/30 border border-white/8 rounded-lg p-3">
                    <p className="text-xs text-gray-300 leading-relaxed font-mono">{idea.canvaPrompt}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(idea.canvaPrompt)}?width=550&height=370&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
                      setGeneratedImages(prev => ({ ...prev, [i]: url }));
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg hover:shadow-violet-500/20 transition-all flex-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Auto-Generate Image
                  </button>
                  <CopyButton text={idea.canvaPrompt} label="Copy Prompt" className="flex-1" />
                  <CopyButton text={`Headline: ${idea.headline}\nSubtext: ${idea.subtext}\nColors: ${idea.colors.join(", ")}`} label="Copy Brief" className="flex-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Create these in Canva (free), Adobe Express, or Figma. Upload finished images in the Fiverr Gallery tab (min 550×370px).
        </p>
      </SectionCard>
    </div>
  );
}
