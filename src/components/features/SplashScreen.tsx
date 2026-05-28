import { useEffect, useState } from "react";
import profileImage from "@/assets/profile.jpg";

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Show splash for 2.5 seconds, then start fading
    const timer = setTimeout(() => {
      setIsFading(true);
      // Wait for the fade out transition (700ms) before unmounting
      setTimeout(onComplete, 700);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#070711] transition-opacity duration-700 ease-in-out ${isFading ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen animate-[blob_7s_infinite]" />
        <div className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vw] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen animate-[blob_7s_infinite_2s]" />
      </div>

      <div className="relative flex flex-col items-center z-10">
        {/* Animated Rings */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] border-t-2 border-r-2 border-violet-500/50 rounded-full animate-spin"></div>
        <div className="absolute top-16 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] border-b-2 border-l-2 border-blue-500/50 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
        
        {/* Glow effect */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-violet-600/40 blur-2xl rounded-full"></div>

        {/* Circular Profile Image */}
        <img 
          src={profileImage} 
          alt="The Developer" 
          className="w-32 h-32 rounded-full object-cover object-top border-[3px] border-[#070711] z-10 shadow-2xl shadow-violet-500/30"
        />
        
        <h1 className="mt-14 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-white tracking-tight text-center">
          Fiverr Gig Generator
        </h1>
        <div className="mt-2 text-violet-300/80 text-sm font-medium tracking-wide">
          Powered by Goox-AI
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></div>
          <p className="text-sm text-gray-500 uppercase tracking-[0.2em] font-medium">Initializing Engine</p>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>
    </div>
  );
}
