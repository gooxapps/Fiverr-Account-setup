import { Link } from "react-router-dom";
import profileImage from "@/assets/profile.jpg";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/8 bg-[#070711]/80 backdrop-blur-xl">
      <div className="max-w-screen-2xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600/50 to-blue-600/50 flex items-center justify-center p-[2px]">
              <img src={profileImage} alt="Logo" className="w-full h-full rounded-full object-cover object-top" />
            </div>
            <span className="text-white font-bold tracking-tight text-lg">Fiverr Gig Generator</span>
          </Link>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-violet-500/15 border border-violet-500/25 text-violet-400 text-[10px] font-semibold rounded-full uppercase tracking-wider">
            Beta
          </span>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/25"
          >
            Start for Free
          </a>
        </div>
      </div>
    </header>
  );
}
