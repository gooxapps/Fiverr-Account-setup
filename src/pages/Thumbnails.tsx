import { useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { generateThumbnailPrompts, ThumbnailGalleryData } from "@/lib/mockAI";

export default function Thumbnails() {
  const [description, setDescription] = useState("");
  const [sizeMode, setSizeMode] = useState<"preset" | "custom">("preset");
  const [width, setWidth] = useState(550);
  const [height, setHeight] = useState(370);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gallery, setGallery] = useState<ThumbnailGalleryData | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    setIsGenerating(true);
    setError(null);
    setGallery(null);

    try {
      const data = await generateThumbnailPrompts(description);
      setGallery(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getPollinationsUrl = (prompt: string) => {
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
  };

  const downloadImage = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error("Failed to download image:", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#070711] flex flex-col font-sans text-gray-200 overflow-x-hidden">
      <DashboardHeader gigCount={0} />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">AI Thumbnail Gallery Generator</h1>
            <p className="text-sm text-gray-400">Generate a full suite of Fiverr images perfectly tailored to your project.</p>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="glass-card p-5 rounded-2xl space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              What is your gig about?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. I am building a food delivery app named 'Foodie'. I want a modern UI showcase for the thumbnails..."
              rows={3}
              className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
            />
          </div>

          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Thumbnail Dimensions
              </label>
              <select
                value={sizeMode}
                onChange={(e) => {
                  setSizeMode(e.target.value as "preset" | "custom");
                  if (e.target.value === "preset") {
                    setWidth(550);
                    setHeight(370);
                  }
                }}
                className="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors cursor-pointer"
              >
                <option value="preset" className="bg-[#0a0a1a]">Standard Fiverr (550 × 370 px)</option>
                <option value="custom" className="bg-[#0a0a1a]">Custom Size</option>
              </select>
            </div>

            {sizeMode === "custom" && (
              <>
                <div className="w-24">
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Width</label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full bg-white/4 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors text-center"
                  />
                </div>
                <div className="w-24">
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Height</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-white/4 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors text-center"
                  />
                </div>
              </>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !description.trim()}
              className="h-11 px-6 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:shadow-lg hover:shadow-violet-500/25 flex items-center justify-center gap-2 flex-shrink-0"
            >
              {isGenerating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Full Gallery
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Gallery Results */}
        {gallery && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Main Cover */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs">1</div>
                Main Gig Cover
              </h2>
              <div className="glass-card rounded-2xl overflow-hidden relative group max-w-full" style={{ aspectRatio: `${width} / ${height}`, maxWidth: Math.min(width, 800) }}>
                <img src={getPollinationsUrl(gallery.coverPrompt)} alt="Main Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 backdrop-blur-sm p-6">
                  <p className="text-xs text-center text-gray-300 font-mono line-clamp-4 leading-relaxed">{gallery.coverPrompt}</p>
                  <button onClick={() => downloadImage(getPollinationsUrl(gallery.coverPrompt), "main-cover.png")} className="px-5 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Download Cover
                  </button>
                </div>
              </div>
            </div>

            {/* Showcase Screenshots */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">{gallery.screenshotPrompts.length}</div>
                Showcase Screenshots
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gallery.screenshotPrompts.map((prompt, i) => (
                  <div key={i} className="glass-card rounded-2xl overflow-hidden relative group" style={{ aspectRatio: `${width} / ${height}` }}>
                    <img src={getPollinationsUrl(prompt)} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 backdrop-blur-sm p-6">
                      <p className="text-xs text-center text-gray-300 font-mono line-clamp-4 leading-relaxed">{prompt}</p>
                      <button onClick={() => downloadImage(getPollinationsUrl(prompt), `screenshot-${i + 1}.png`)} className="px-5 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Download Image
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
