import { useGigGenerator } from "@/hooks/useGigGenerator";
import { ServiceInput } from "@/components/features/ServiceInput";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ErrorState } from "@/components/features/ErrorState";
import { GigResultViewer } from "@/components/features/GigResultViewer";

export default function Generator() {
  const { isGenerating, isTranslating, currentGig, history, error, generate, translate, loadFromHistory, clearHistory } = useGigGenerator();

  return (
    <div className="h-screen flex flex-col bg-[#070711] overflow-hidden relative">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px] mix-blend-screen animate-[blob_7s_infinite]" />
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-blue-600/20 blur-[100px] mix-blend-screen animate-[blob_7s_infinite_2s]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[45%] h-[45%] rounded-full bg-emerald-600/10 blur-[120px] mix-blend-screen animate-[blob_7s_infinite_4s]" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <DashboardHeader gigCount={history.length} />

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT PANEL */}
          <aside className="w-72 xl:w-80 flex-shrink-0 border-r border-white/8 flex flex-col overflow-y-auto p-4 gap-4 bg-[#07071180]">
            <ServiceInput
              onGenerate={generate}
              isGenerating={isGenerating}
              history={history}
              onLoadHistory={loadFromHistory}
              onClearHistory={clearHistory}
            />
          </aside>

          {/* RIGHT PANEL */}
          <main className="flex-1 flex flex-col overflow-hidden">
            {!currentGig && !isGenerating && !error && (
              <EmptyState onGenerate={generate} />
            )}

            {error && !isGenerating && (
              <ErrorState message={error} onRetry={() => generate(history[0]?.serviceInput ?? "")} />
            )}

            {isGenerating && !isTranslating && <GeneratingState />}

            {currentGig && !isGenerating && (
              <GigResultViewer 
                gig={currentGig} 
                onTranslate={translate} 
                isTranslating={isTranslating} 
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onGenerate }: { onGenerate: (s: string) => void }) {
  const categorizedExamples = [
    {
      category: "Development & Tech",
      items: ["React Developer", "Flutter App Developer", "WordPress Website", "Shopify Store", "Kajabi Expert", "Web Application"]
    },
    {
      category: "Digital Marketing",
      items: ["Email Marketing", "Newsletter Setup", "SEO Specialist", "Social Media Manager", "Facebook Ads", "Marketing Strategy"]
    },
    {
      category: "Design & Creative",
      items: ["Logo Designer", "UI/UX Design", "Video Editor", "Music Production", "Illustration", "Brand Identity"]
    },
    {
      category: "Writing & Translation",
      items: ["Copywriting", "Blog Post Writer", "Translation Services", "Proofreading", "Resume Writing", "Sales Copy"]
    },
    {
      category: "Business",
      items: ["Pitch Deck", "PowerPoint Presentation", "Business Plan", "Virtual Assistant", "Data Entry", "Consulting"]
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 overflow-y-auto py-12">
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-violet-600/30 to-blue-600/30 border border-violet-500/30 flex items-center justify-center mb-6 shadow-2xl shadow-violet-500/20 backdrop-blur-xl relative shrink-0">
        <div className="absolute inset-0 rounded-full border border-white/10 scale-110" />
        <svg className="w-10 h-10 md:w-12 md:h-12 text-violet-300 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-3 tracking-tight shrink-0">Generate Your First Gig</h3>
      <p className="text-slate-300 text-sm md:text-lg max-w-xl mb-10 leading-relaxed font-light shrink-0">
        Type your Fiverr service in the left panel and click Generate. AI will craft a perfectly optimized gig in seconds.
      </p>
      
      <div className="w-full max-w-7xl px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8 text-left">
        {categorizedExamples.map((cat) => (
          <div key={cat.category} className="flex flex-col gap-3">
            <h4 className="text-violet-400 font-semibold text-xs md:text-sm uppercase tracking-wider px-1">{cat.category}</h4>
            <div className="flex flex-col gap-2">
              {cat.items.map((ex) => (
                <button
                  key={ex}
                  onClick={() => onGenerate(ex)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs md:text-sm font-medium text-slate-200 hover:border-violet-500/50 hover:bg-violet-500/15 hover:text-white transition-all hover:translate-x-1 text-left w-full truncate shadow-sm hover:shadow-violet-500/10 group flex items-center justify-between"
                  title={ex}
                >
                  <span className="truncate">{ex}</span>
                  <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GeneratingState() {
  const steps = [
    { label: "Analyzing service keywords", tab: "Overview" },
    { label: "Determining category & tags", tab: "Overview" },
    { label: "Building pricing packages", tab: "Pricing" },
    { label: "Writing SEO description", tab: "Description" },
    { label: "Generating FAQ answers", tab: "Description" },
    { label: "Creating buyer requirements", tab: "Requirements" },
    { label: "Designing thumbnail concepts", tab: "Gallery" },
  ];
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
            <svg className="w-5 h-5 text-violet-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold">Generating all 5 Fiverr tabs</p>
            <p className="text-xs text-gray-400">Crafting gig content optimized for ranking...</p>
          </div>
        </div>
        <div className="space-y-2.5">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/6 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: i < 4 ? "#8b5cf6" : "#374151" }}
              />
              <span className="text-xs text-gray-400 flex-1">{step.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-600">{step.tab}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
