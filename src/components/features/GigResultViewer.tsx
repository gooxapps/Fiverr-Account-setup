import { useState } from "react";
import { GigData } from "@/types";
import { exportGigToMarkdown, downloadMarkdown, calculateSeoScore } from "@/lib/exportUtils";
import { OverviewTab } from "./OverviewTab";
import { PricingTab } from "./PricingTab";
import { DescriptionFAQTab } from "./DescriptionFAQTab";
import { RequirementsTab } from "./RequirementsTab";
import { GalleryTab } from "./GalleryTab";

type Tab = "overview" | "pricing" | "description" | "requirements" | "gallery";

const TABS: { id: Tab; label: string; fiverr: string }[] = [
  { id: "overview", label: "Overview", fiverr: "Title · Category · Tags" },
  { id: "pricing", label: "Pricing", fiverr: "Packages · Scope" },
  { id: "description", label: "Description & FAQ", fiverr: "About · Q&A" },
  { id: "requirements", label: "Requirements", fiverr: "Buyer onboarding" },
  { id: "gallery", label: "Gallery", fiverr: "Images · Thumbnails" },
];

interface GigResultViewerProps {
  gig: GigData;
  onTranslate?: (lang: string) => void;
  isTranslating?: boolean;
}

export function GigResultViewer({ gig, onTranslate, isTranslating }: GigResultViewerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  if (isTranslating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 h-full">
        <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p className="text-white font-semibold">Translating gig content...</p>
        <p className="text-xs text-gray-400 mt-1">Please wait while AI rewrites the entire gig.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fiverr-style tab bar */}
      <div className="flex-shrink-0 border-b border-white/8 bg-[#070711]/60 backdrop-blur-xl">
        {/* Gig name row */}
        <div className="flex items-center gap-3 px-6 pt-4 pb-3 border-b border-white/6">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mb-0.5">Generated for</p>
            <h2 className="text-base font-bold text-white truncate">{gig.serviceInput}</h2>
          </div>
          <div className="flex-shrink-0 flex items-center gap-3">
            {onTranslate && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onTranslate(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-[#0a0a1a] border border-white/10 hover:border-white/20 transition-colors text-xs font-semibold text-white outline-none cursor-pointer"
              >
                <option value="">Translate...</option>
                <option value="Spanish">🇪🇸 Spanish</option>
                <option value="French">🇫🇷 French</option>
                <option value="German">🇩🇪 German</option>
                <option value="Portuguese">🇧🇷 Portuguese</option>
                <option value="English">🇬🇧 English</option>
              </select>
            )}

            <button 
              onClick={() => downloadMarkdown(exportGigToMarkdown(gig), gig.title.replace(/[^a-z0-9]/gi, '_').toLowerCase())}
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:text-violet-300 transition-colors text-xs font-semibold text-white flex items-center gap-1.5 group"
            >
              <svg className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Export .md
            </button>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 border border-white/5">
                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">SEO Score</span>
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-bold ${calculateSeoScore(gig) >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {calculateSeoScore(gig)}
                  </span>
                  <span className="text-[10px] text-gray-600">/100</span>
                </div>
            </div>

            <div className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Ready
            </div>
          </div>
        </div>

        {/* Tab row */}
        <div className="flex items-end px-6 gap-0 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex flex-col items-start px-4 pt-2 pb-3 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-violet-500 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300 hover:border-white/20"
              }`}
            >
              <span className="text-sm font-semibold">{tab.label}</span>
              <span className={`text-[10px] mt-0.5 transition-colors ${
                activeTab === tab.id ? "text-violet-400" : "text-gray-600 group-hover:text-gray-500"
              }`}>
                {tab.fiverr}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto pb-10">
          <TabContent tab={activeTab} gig={gig} />
        </div>
      </div>
    </div>
  );
}

function TabContent({ tab, gig }: { tab: Tab; gig: GigData }) {
  switch (tab) {
    case "overview":     return <OverviewTab gig={gig} />;
    case "pricing":      return <PricingTab gig={gig} />;
    case "description":  return <DescriptionFAQTab gig={gig} />;
    case "requirements": return <RequirementsTab gig={gig} />;
    case "gallery":      return <GalleryTab gig={gig} />;
  }
}
