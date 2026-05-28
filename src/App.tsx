import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import Generator from "@/pages/Generator";
import Importer from "@/pages/Importer";
import Thumbnails from "@/pages/Thumbnails";
import NotFound from "@/pages/NotFound";
import SplashScreen from "@/components/features/SplashScreen";
import { useState } from "react";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#13131f",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
          },
        }}
      />
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/generator" element={<Generator />} />
        <Route path="/importer" element={<Importer />} />
        <Route path="/thumbnails" element={<Thumbnails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
