interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  // Simple heuristic to provide helpful suggestions based on the error message
  const getSuggestions = (errorStr: string) => {
    if (errorStr.includes("API key")) {
      return ["Check your .env file and ensure VITE_GEMINI_API_KEY is correct.", "Make sure to restart the Vite server after changing .env."];
    }
    if (errorStr.includes("404") || errorStr.includes("models/")) {
      return ["The specified Gemini model might be deprecated or incorrect.", "Try changing the model string in src/lib/mockAI.ts to 'gemini-1.5-flash-latest' or 'gemini-pro'."];
    }
    if (errorStr.includes("JSON")) {
      return ["The AI returned invalid JSON. Sometimes this happens randomly.", "Just click retry to prompt the AI again."];
    }
    return ["Check your internet connection.", "Look at the browser console (F12) for more detailed network errors."];
  };

  const suggestions = getSuggestions(message);

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 relative z-10 w-full max-w-4xl mx-auto">
      <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-2xl shadow-red-500/10">
        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-3xl font-extrabold text-white mb-3">Diagnostic Error</h3>
      <p className="text-base text-slate-400 max-w-xl mb-8 leading-relaxed font-medium">
        The gig generation process encountered an error that stopped the project from working. 
        Review the debug logs below to fix the issue.
      </p>

      <div className="w-full max-w-2xl bg-[#0a0a0f] border border-red-500/20 rounded-2xl overflow-hidden shadow-xl text-left mb-8">
        <div className="bg-red-500/10 px-5 py-3 border-b border-red-500/20 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm font-bold text-red-400 uppercase tracking-wider">Error Details</span>
        </div>
        <div className="p-5">
          <p className="text-sm text-red-300 font-mono leading-relaxed whitespace-pre-wrap break-all bg-red-500/5 p-4 rounded-xl border border-red-500/10">
            {message}
          </p>
        </div>

        <div className="bg-white/5 px-5 py-3 border-t border-white/10 flex items-center gap-3">
          <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-bold text-yellow-400 uppercase tracking-wider">Possible Solutions</span>
        </div>
        <div className="p-5 bg-white/5">
          <ul className="space-y-2 list-disc pl-5">
            {suggestions.map((suggestion, i) => (
              <li key={i} className="text-sm text-slate-300 font-medium">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white text-base font-bold shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 transition-all duration-300"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Retry Generation
      </button>
    </div>
  );
}
