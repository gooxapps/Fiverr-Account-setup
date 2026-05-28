import { useState, useRef, useEffect } from "react";
import { GigData } from "@/types";
import { EXAMPLE_SERVICES } from "@/constants";

interface ServiceInputProps {
  onGenerate: (service: string) => void;
  isGenerating: boolean;
  history: GigData[];
  onLoadHistory: (gig: GigData) => void;
  onClearHistory: () => void;
}

export function ServiceInput({
  onGenerate,
  isGenerating,
  history,
  onLoadHistory,
  onClearHistory,
}: ServiceInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  const handleSubmit = () => {
    if (value.trim() && !isGenerating) {
      onGenerate(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
    }
  };

  const handleExample = (example: string) => {
    setValue(example);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Input Section */}
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.75 3.75 0 01-5.303 0l-.347-.347z" />
            </svg>
          </div>
          <label className="text-sm font-semibold text-white">Your Fiverr Service</label>
        </div>

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Flutter app developer, Logo designer..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 text-base resize-none focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 focus:bg-white/10 transition-all font-medium leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500 font-medium">⌘ + Enter to generate</span>
          <button
            onClick={handleSubmit}
            disabled={!value.trim() || isGenerating}
            className="relative flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-300"
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
                Generate Gig
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generating Progress */}
      {isGenerating && (
        <div className="glass-card rounded-2xl p-4">
          <div className="text-xs text-violet-400 font-medium mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            AI is crafting your gig...
          </div>
          <div className="space-y-2">
            {["Analyzing service keywords", "Optimizing SEO titles", "Writing description", "Building packages", "Generating FAQs"].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{
                    backgroundColor: i < 3 ? "#8b5cf6" : "#374151",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
                {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Examples */}
      <div className="glass-card rounded-2xl p-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Examples</p>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLE_SERVICES.slice(0, 8).map((ex) => (
            <button
              key={ex}
              onClick={() => handleExample(ex)}
              className="px-2.5 py-1 rounded-lg bg-white/4 border border-white/8 text-xs text-gray-400 hover:text-white hover:border-violet-500/30 hover:bg-violet-500/10 transition-all"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="glass-card rounded-2xl p-4 flex-1 min-h-0 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">History</p>
            <button
              onClick={onClearHistory}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="space-y-1.5">
            {history.slice(0, 12).map((gig) => (
              <button
                key={gig.id}
                onClick={() => onLoadHistory(gig)}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-white/3 border border-white/6 hover:border-violet-500/25 hover:bg-violet-500/8 transition-all group"
              >
                <p className="text-xs font-medium text-white group-hover:text-violet-300 transition-colors truncate">
                  {gig.serviceInput}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {new Date(gig.createdAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
