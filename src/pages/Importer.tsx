import { useState } from "react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { FiverrImporter } from "@/components/features/FiverrImporter";
import { GigResultViewer } from "@/components/features/GigResultViewer";
import { GigData } from "@/types";

export default function Importer() {
  const [currentGig, setCurrentGig] = useState<GigData | null>(null);

  return (
    <div className="h-screen flex flex-col bg-[#070711] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] mix-blend-screen animate-[blob_7s_infinite]" />
        <div className="absolute bottom-[20%] left-[-10%] w-[35%] h-[35%] rounded-full bg-teal-600/20 blur-[100px] mix-blend-screen animate-[blob_7s_infinite_2s]" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <DashboardHeader gigCount={0} />

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT PANEL */}
          <aside className="w-80 xl:w-96 flex-shrink-0 border-r border-white/8 flex flex-col p-6 bg-[#07071180] overflow-y-auto">
            <h2 className="text-xl font-bold text-white mb-2">Import & Synthesize</h2>
            <p className="text-sm text-gray-400 mb-6">
              Paste up to 3 Fiverr URLs below. The AI will analyze your competitors and synthesize their best traits into one ultimate gig.
            </p>
            <FiverrImporter onImported={setCurrentGig} />
          </aside>

          {/* RIGHT PANEL */}
          <main className="flex-1 flex flex-col overflow-hidden relative">
            {!currentGig ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20">
                  <svg className="w-10 h-10 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">Steal & Improve</h3>
                <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                  Enter competitor URLs in the sidebar to generate a highly optimized gig based on proven winners.
                </p>
              </div>
            ) : (
              <GigResultViewer gig={currentGig} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
