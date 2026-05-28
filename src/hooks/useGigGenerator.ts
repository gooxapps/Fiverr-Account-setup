import { useState, useCallback } from "react";
import { GigData } from "@/types";
import { generateGigContent } from "@/lib/mockAI";

const HISTORY_KEY = "gigforge_history";

function loadHistory(): GigData[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: GigData[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
  } catch {
    console.log("Could not save history");
  }
}

export function useGigGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentGig, setCurrentGig] = useState<GigData | null>(null);
  const [history, setHistory] = useState<GigData[]>(loadHistory);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (serviceInput: string) => {
    if (!serviceInput.trim()) return;
    setIsGenerating(true);
    setError(null);
    console.log("Generating gig content for:", serviceInput);

    try {
      const result = await generateGigContent(serviceInput);
      console.log("Generated gig data:", result);
      setCurrentGig(result);
      setHistory((prev) => {
        const updated = [result, ...prev.filter((g) => g.id !== result.id)];
        saveHistory(updated);
        return updated;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI generation failed. Please try again.";
      console.error("Generation error:", msg);
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const translate = useCallback(async (targetLanguage: string) => {
    if (!currentGig) return;
    setIsTranslating(true);
    setError(null);
    try {
      const translatedData = await translateGig(currentGig, targetLanguage);
      setCurrentGig(translatedData);
      
      setHistory((prev) => {
        const updated = prev.map((g) => g.id === translatedData.id ? translatedData : g);
        saveHistory(updated);
        return updated;
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Translation failed. Please try again.";
      setError(msg);
    } finally {
      setIsTranslating(false);
    }
  }, [currentGig]);

  const loadFromHistory = useCallback((gig: GigData) => {
    setCurrentGig(gig);
    // If imported (not already in history), add it
    setHistory((prev) => {
      if (prev.find((g) => g.id === gig.id)) return prev;
      const updated = [gig, ...prev];
      saveHistory(updated);
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  return {
    isGenerating,
    isTranslating,
    currentGig,
    history,
    error,
    generate,
    translate,
    loadFromHistory,
    clearHistory,
  };
}
