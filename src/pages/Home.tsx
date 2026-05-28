import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { FEATURES, APP_TAGLINE, APP_DESCRIPTION, EXAMPLE_SERVICES } from "@/constants";
import heroBg from "@/assets/hero-bg.jpg";

const iconMap: Record<string, React.ReactNode> = {
  Zap: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  FileText: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Tag: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  Package: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  HelpCircle: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ClipboardList: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  Image: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#070711]">
      <Header />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070711]/60 via-[#070711]/40 to-[#070711]" />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 via-transparent to-blue-900/20" />

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-violet-500/25 text-sm text-violet-300 font-medium mb-8">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            AI-Powered Fiverr Gig Generator
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            Create{" "}
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              High-Converting
            </span>
            <br />
            Fiverr Gigs with AI
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {APP_DESCRIPTION} Stop guessing, start ranking.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={() => navigate("/generator")}
              className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-base shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start Generating — Free
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <div className="text-sm text-gray-500">No account needed · Instant results</div>
          </div>

          {/* Example chips */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-xs text-gray-500 self-center mr-1">Try with:</span>
            {EXAMPLE_SERVICES.slice(0, 6).map((ex) => (
              <button
                key={ex}
                onClick={() => navigate("/generator")}
                className="px-3 py-1.5 rounded-full bg-white/4 border border-white/8 text-xs text-gray-400 hover:text-white hover:border-violet-500/30 hover:bg-violet-500/10 transition-all"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-violet-400 font-semibold text-sm uppercase tracking-wider mb-3">
              Everything You Need
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              7 AI Generators in One Dashboard
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              From titles to thumbnails — every section of your Fiverr gig, crafted by AI and optimized to rank.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5 hover:border-violet-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 transition-transform">
                  {iconMap[feature.icon]}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1.5">{feature.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 bg-white/[0.015] border-y border-white/6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Create a Full Gig in Seconds
            </h2>
            <p className="text-gray-400">Three steps. Zero guesswork.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Describe Your Service",
                desc: "Type what you do — e.g. 'Flutter app developer' or 'Logo designer for startups'",
                color: "from-violet-500/20 to-violet-500/5",
                border: "border-violet-500/20",
              },
              {
                step: "02",
                title: "AI Generates Everything",
                desc: "Our AI instantly creates 7 gig sections: titles, description, tags, FAQs, pricing, requirements, and thumbnails",
                color: "from-blue-500/20 to-blue-500/5",
                border: "border-blue-500/20",
              },
              {
                step: "03",
                title: "Copy & Publish",
                desc: "One-click copy any section directly to your Fiverr gig editor. You're live in minutes.",
                color: "from-emerald-500/20 to-emerald-500/5",
                border: "border-emerald-500/20",
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`relative glass-card rounded-2xl p-6 bg-gradient-to-b ${item.color} border ${item.border}`}
              >
                <div className="text-5xl font-black text-white/8 mb-4 leading-none">{item.step}</div>
                <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 via-blue-900/10 to-violet-900/20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
            Start Building Your{" "}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Perfect Gig
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Join thousands of freelancers who generate high-converting Fiverr gigs in seconds.
          </p>
          <button
            onClick={() => navigate("/generator")}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-lg shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Launch Goox-AI — Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-white font-bold text-sm">Goox-AI</span>
        </div>
        <p className="text-gray-500 text-xs">© 2026 Goox-AI. Built by Mr Kehinde Emmanuel (Staysafelite Company).</p>
      </footer>
    </div>
  );
}
