import { useState } from "react";
import { extractFromMultipleFiverrUrls, parseFiverrUrl } from "@/lib/fiverr-extractor";
import { GigData } from "@/types";

interface FiverrImporterProps {
  onImported: (gig: GigData) => void;
}

type ImportStatus = "idle" | "fetching" | "success" | "error";

export function FiverrImporter({ onImported }: FiverrImporterProps) {
  const [urls, setUrls] = useState("");
  const [status, setStatus] = useState<ImportStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [previews, setPreviews] = useState<{ username: string; slug: string }[]>([]);

  const handleUrlChange = (v: string) => {
    setUrls(v);
    setStatus("idle");
    setErrorMsg("");
    
    // Parse all valid URLs from the text
    const parsedUrls = v.split(/[\n,]+/).map(u => u.trim()).filter(Boolean);
    const validPreviews = parsedUrls.map(u => parseFiverrUrl(u)).filter(Boolean) as { username: string; slug: string }[];
    setPreviews(validPreviews);
  };

  const handleImport = async () => {
    if (previews.length === 0 || status === "fetching") return;
    setStatus("fetching");
    setErrorMsg("");

    const parsedUrls = urls.split(/[\n,]+/).map(u => u.trim()).filter(u => parseFiverrUrl(u));

    const result = await extractFromMultipleFiverrUrls(parsedUrls).catch((e: Error) => {
      setStatus("error");
      setErrorMsg(e.message || "Failed to extract gig data.");
      return null;
    });

    if (result) {
      setStatus("success");
      onImported(result);
      setTimeout(() => {
        setUrls("");
        setPreviews([]);
        setStatus("idle");
      }, 2500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleImport();
    }
  };

  const isValidUrl = previews.length > 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3 border-b border-white/6">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
          {/* Fiverr-ish icon */}
          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-white">Import from Fiverr</p>
          <p className="text-[10px] text-gray-500 leading-none mt-0.5">Paste any gig URL to extract all info</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* URL input */}
        <div className="relative">
          <div className="absolute left-3 top-3 pointer-events-none">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <textarea
            value={urls}
            onChange={(e) => handleUrlChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste up to 3 Fiverr URLs (one per line) to Steal & Improve..."
            rows={3}
            className={`w-full bg-white/4 border rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-all resize-none ${
              urls && !isValidUrl
                ? "border-red-500/40 focus:border-red-500/60"
                : isValidUrl
                ? "border-emerald-500/40 focus:border-emerald-500/60"
                : "border-white/10 focus:border-violet-500/50"
            }`}
          />
          {isValidUrl && (
            <div className="absolute right-3 bottom-3">
              <div className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                {previews.length} URL{previews.length > 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>

        {/* URL previews */}
        {previews.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {previews.slice(0, 3).map((prev, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/6 border border-emerald-500/15">
                <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-1.5">
                  <p className="text-[10px] text-emerald-400 font-semibold truncate">@{prev.username}</p>
                  <span className="text-[10px] text-gray-600">/</span>
                  <p className="text-[9px] text-gray-500 truncate">{prev.slug.replace(/-/g, " ")}</p>
                </div>
              </div>
            ))}
            {previews.length > 3 && (
              <p className="text-[9px] text-gray-500 text-center">Only the first 3 URLs will be used for synthesis.</p>
            )}
          </div>
        )}

        {/* Error message */}
        {status === "error" && (
          <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-500/8 border border-red-500/20">
            <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-[10px] text-red-300 leading-relaxed">{errorMsg}</p>
          </div>
        )}

        {/* Success message */}
        {status === "success" && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
            <svg className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-[10px] text-emerald-300 font-medium">Gig data extracted successfully!</p>
          </div>
        )}

        {/* Fetching steps */}
        {status === "fetching" && (
          <div className="space-y-1.5">
            {[
              "Connecting to Fiverr page...",
              "Parsing gig structure...",
              "Extracting pricing & FAQs...",
              "Mapping to Goox-AI format...",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] text-gray-500">
                <div
                  className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                  style={{ backgroundColor: "#8b5cf6", animationDelay: `${i * 0.25}s` }}
                />
                {step}
              </div>
            ))}
          </div>
        )}

        {/* Import button */}
        <button
          onClick={handleImport}
          disabled={!isValidUrl || status === "fetching" || status === "success"}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 active:scale-[0.98]"
        >
          {status === "fetching" ? (
            <>
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Extracting...
            </>
          ) : status === "success" ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Imported!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {previews.length > 1 ? "Steal & Improve (AI)" : "Extract Gig Data"}
            </>
          )}
        </button>

        {/* Note */}
        <p className="text-[9px] text-gray-600 leading-relaxed text-center">
          Works with public Fiverr gig URLs. Data is extracted client-side via CORS proxy — no data is stored on any server.
        </p>
      </div>
    </div>
  );
}
