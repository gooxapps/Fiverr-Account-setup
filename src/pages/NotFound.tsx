import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#070711] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-8xl font-black text-white/5 mb-6 leading-none select-none">404</div>
        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-gray-400 mb-8">This page doesn't exist.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
