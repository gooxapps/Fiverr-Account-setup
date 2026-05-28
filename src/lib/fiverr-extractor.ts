import { GigData } from "@/types";
import { extractGigFromHTML } from "./mockAI";

/** Parse username + slug from any Fiverr gig URL */
export function parseFiverrUrl(url: string): { username: string; slug: string } | null {
  try {
    const u = new URL(url.trim());
    if (!u.hostname.includes("fiverr.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    // /username/slug  or  /username/slug?query...
    if (parts.length >= 2) {
      return { username: parts[0], slug: parts[1] };
    }
    return null;
  } catch {
    return null;
  }
}

/** CORS proxies to try in order */
const PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
];

async function fetchWithProxy(targetUrl: string): Promise<string> {
  for (const proxy of PROXIES) {
    try {
      const res = await fetch(proxy(targetUrl), {
        signal: AbortSignal.timeout(12000),
      });
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 500) return text;
      }
    } catch (e) {
      console.log("Proxy failed, trying next...", e);
    }
  }
  throw new Error("All CORS proxies failed. Fiverr may be blocking automated requests.");
}

/** Main extraction function — returns GigData from a Fiverr URL using AI */
export async function extractFromFiverrUrl(url: string): Promise<GigData> {
  const parsed = parseFiverrUrl(url);
  if (!parsed) throw new Error("Invalid Fiverr URL. Please paste a full gig URL like: https://www.fiverr.com/username/gig-name");

  const cleanUrl = `https://www.fiverr.com/${parsed.username}/${parsed.slug}`;
  console.log("Fetching Fiverr gig:", cleanUrl);

  let html = await fetchWithProxy(cleanUrl);
  console.log("Fetched HTML length:", html.length);

  // Clean the HTML to save Gemini tokens and remove useless noise
  html = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // Let Gemini extract exactly what we need
  return await extractGigFromHTML(html, cleanUrl);
}

/** Extracts and synthesizes from multiple Fiverr URLs */
export async function extractFromMultipleFiverrUrls(urls: string[]): Promise<GigData> {
  if (urls.length === 0) throw new Error("No URLs provided.");
  
  if (urls.length === 1) {
    return extractFromFiverrUrl(urls[0]);
  }

  console.log(`Fetching ${urls.length} Fiverr gigs for synthesis...`);
  
  const htmlPromises = urls.map(async (url) => {
    const parsed = parseFiverrUrl(url);
    if (!parsed) return "";
    const cleanUrl = `https://www.fiverr.com/${parsed.username}/${parsed.slug}`;
    try {
      let html = await fetchWithProxy(cleanUrl);
      return html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "")
        .replace(/<!--[\s\S]*?-->/g, "");
    } catch (e) {
      console.warn("Failed to fetch competitor:", url, e);
      return "";
    }
  });

  const htmlResults = await Promise.all(htmlPromises);
  const validHtml = htmlResults.filter(h => h.length > 500);

  if (validHtml.length === 0) {
    throw new Error("Failed to fetch any of the provided Fiverr URLs.");
  }

  // Synthesize using the new mockAI function
  const { synthesizeGigsFromHTML } = await import("./mockAI");
  
  // Use the first valid URL as the base name
  const firstParsed = parseFiverrUrl(urls[0]);
  const baseName = firstParsed ? `https://www.fiverr.com/${firstParsed.username}/${firstParsed.slug}` : urls[0];
  
  return await synthesizeGigsFromHTML(validHtml, baseName);
}
