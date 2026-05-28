import { Link, useLocation } from "react-router-dom";
import profileImage from "@/assets/profile.jpg";

interface DashboardHeaderProps {
  gigCount: number;
}

export function DashboardHeader({ gigCount }: DashboardHeaderProps) {
  const location = useLocation();

  return (
    <header className="h-16 border-b border-white/8 bg-[#070711]/80 backdrop-blur-xl flex items-center px-6 gap-4 flex-shrink-0">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600/50 to-blue-600/50 flex items-center justify-center p-[2px]">
          <img src={profileImage} alt="Logo" className="w-full h-full rounded-full object-cover object-top" />
        </div>
        <span className="text-white font-bold tracking-tight">Fiverr Gig Generator</span>
      </Link>

      <div className="h-5 w-px bg-white/10 mx-2" />

      <nav className="flex items-center gap-1">
        <Link 
          to="/generator"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === "/generator" 
              ? "bg-white/10 text-white" 
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          AI Gig Generator
        </Link>
        <Link 
          to="/importer"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === "/importer" 
              ? "bg-white/10 text-white" 
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          URL Importer
        </Link>
        <Link 
          to="/thumbnails"
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            location.pathname === "/thumbnails" 
              ? "bg-white/10 text-white" 
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          AI Thumbnails
        </Link>
      </nav>

      <div className="ml-auto flex items-center gap-3">
        {gigCount > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/8">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-gray-400 font-medium">{gigCount} gig{gigCount !== 1 ? "s" : ""} generated</span>
          </div>
        )}
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/20 flex items-center justify-center">
          <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
    </header>
  );
}
