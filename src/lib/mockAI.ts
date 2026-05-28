import { GoogleGenerativeAI } from "@google/generative-ai";
import { GigData } from "@/types";

// Initialize the Gemini API client using the Vite environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function translateGig(gig: GigData, targetLanguage: string): Promise<GigData> {
  if (!genAI) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env file.");
  }

  console.log(`Translating gig content to ${targetLanguage} using Gemini...`);

  const prompt = `You are an expert translator and Fiverr gig optimization specialist.
Translate the following Fiverr Gig JSON data into ${targetLanguage}.
CRITICAL INSTRUCTIONS:
1. Translate ONLY the string values: title, category, subCategory, packageTitle, description, faq questions/answers, features, and requirements.
2. DO NOT translate keys, structural elements, tags, or the original serviceInput.
3. Keep the translation professional, engaging, and optimized for sales.
4. Output ONLY valid JSON matching the exact same schema.

Gig JSON:
"""
${JSON.stringify(gig, null, 2)}
"""`;

  try {
    const text = await callGeminiWithRetry("gemini-flash-latest", prompt, "You are a professional translator. Output only valid JSON matching the input schema.");
    
    // Clean markdown if present
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const translatedGig = JSON.parse(cleaned) as GigData;
    // Ensure IDs and non-translatable fields stay intact
    translatedGig.id = gig.id;
    translatedGig.createdAt = gig.createdAt;
    translatedGig.serviceInput = gig.serviceInput;
    translatedGig.tags = gig.tags; // Better to keep original tags for SEO, or let them translate? Let's keep original for now.

    return translatedGig;
  } catch (error: any) {
    console.error("Gemini translation error:", error);
    throw new Error(error.message || "Failed to translate gig content. Please check your API key or try again.");
  }
}

const SYSTEM_PROMPT = `You are Goox-AI — an expert Fiverr gig copywriter and SEO strategist. 
You generate highly optimized, conversion-focused Fiverr gig content that helps freelancers rank higher and get more orders.
Always return valid JSON matching the exact schema provided. Never add explanations outside the JSON.`;

function buildUserPrompt(serviceInput: string): string {
  return `Generate a complete, professional Fiverr gig for a freelancer offering: "${serviceInput}"

Return ONLY a valid JSON object with this exact schema (no markdown, no code blocks, raw JSON only):

{
  "title": "string — starts with 'I will', max 80 chars, keyword-rich, conversion-focused",
  "category": "string — best-fit Fiverr main category (e.g. 'Programming & Tech', 'Graphics & Design')",
  "subCategory": "string — specific sub-category within the main category",
  "tags": ["array of exactly 5 search tags", "lowercase", "letters and numbers only", "each max 20 chars"],
  "positiveKeywords": ["array of 5 positive keywords buyers search for"],
  "pricing": {
    "basic": {
      "packageTitle": "string — catchy package name",
      "price": "string — e.g. '$25'",
      "deliveryDays": number,
      "revisions": number,
      "description": "string — 1-2 sentence package summary",
      "features": [
        { "label": "string", "included": boolean }
      ]
    },
    "standard": {
      "packageTitle": "string",
      "price": "string — e.g. '$75'",
      "deliveryDays": number,
      "revisions": number,
      "description": "string",
      "features": [
        { "label": "string", "included": boolean }
      ]
    },
    "premium": {
      "packageTitle": "string",
      "price": "string — e.g. '$150'",
      "deliveryDays": number,
      "revisions": "number or 'Unlimited'",
      "description": "string",
      "features": [
        { "label": "string", "included": boolean }
      ]
    }
  },
  "description": "string — full Fiverr gig description, 800-1200 chars, SEO-rich, with emojis, sections, strong CTA.",
  "faqs": [
    { "question": "string", "answer": "string — professional, detailed answer" }
  ],
  "buyerRequirements": [
    {
      "type": "FREE_TEXT or MULTIPLE_CHOICE",
      "question": "string",
      "options": ["array only if MULTIPLE_CHOICE"]
    }
  ],
  "thumbnailIdeas": [
    {
      "headline": "string — bold thumbnail text, max 40 chars",
      "subtext": "string — secondary line",
      "colors": ["#6C63FF", "#0a0a0f", "#FFFFFF"],
      "composition": "string — layout description",
      "canvaPrompt": "string — detailed prompt for Canva AI"
    }
  ],
  "videoPrompt": {
    "duration": "string",
    "style": "string",
    "scriptOutline": "string",
    "gemini": "string",
    "sora": "string",
    "veo": "string"
  }
}

Rules:
- Generate exactly 5 tags, 5 positiveKeywords, 6 FAQs, 7 buyerRequirements, 3 thumbnailIdeas
- Each pricing package must have exactly 8 features with a mix of included:true and included:false
- Basic package: lower price, fewer features; Premium: highest price, most features included
- The description must feel human-written, professional, and Fiverr-optimized
- Make everything highly specific to the service: "${serviceInput}"`;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function truncate(str: string, max: number): string {
  if (!str) return "";
  return str.length <= max ? str : str.slice(0, max - 1).trimEnd();
}

function normalizeGig(raw: Record<string, unknown>, serviceInput: string): GigData {
  const tags = (Array.isArray(raw.tags) ? raw.tags : [])
    .slice(0, 5)
    .map((t: unknown) => String(t).toLowerCase().replace(/[^a-z0-9 ]/g, "").trim().slice(0, 20));

  const positiveKeywords = (Array.isArray(raw.positiveKeywords) ? raw.positiveKeywords : [])
    .slice(0, 5)
    .map((k: unknown) => String(k));

  const pricingRaw = Array.isArray(raw.pricing) ? raw.pricing : [];
  let pricingArray = pricingRaw;
  
  if (raw.pricing && typeof raw.pricing === 'object' && !Array.isArray(raw.pricing)) {
    const pObj = raw.pricing as Record<string, unknown>;
    const names = ['basic', 'standard', 'premium'] as const;
    const displayNames = ['Basic', 'Standard', 'Premium'] as const;
    pricingArray = names.map((key, i) => ({
      name: displayNames[i],
      ...((pObj[key] ?? {}) as Record<string, unknown>),
    }));
  }

  const pricing = pricingArray.map((pkg: unknown) => {
    const p = (pkg ?? {}) as Record<string, unknown>;
    return {
      name: (p.name as "Basic" | "Standard" | "Premium") ?? "Basic",
      packageTitle: String(p.packageTitle ?? "Package"),
      price: String(p.price ?? "$50"),
      deliveryDays: Number(p.deliveryDays ?? 5),
      revisions: p.revisions === "Unlimited" ? "Unlimited" as const : Number(p.revisions ?? 2),
      description: String(p.description ?? ""),
      features: Array.isArray(p.features)
        ? p.features.map((f: unknown) => {
            const fObj = (f ?? {}) as Record<string, unknown>;
            return { label: String(fObj.label ?? ""), included: Boolean(fObj.included) };
          })
        : [],
    };
  });

  const faqs = (Array.isArray(raw.faqs) ? raw.faqs : []).slice(0, 8).map((f: unknown) => {
    const fObj = (f ?? {}) as Record<string, unknown>;
    return { question: String(fObj.question ?? ""), answer: String(fObj.answer ?? "") };
  });

  const buyerRequirements = (Array.isArray(raw.buyerRequirements) ? raw.buyerRequirements : [])
    .slice(0, 8)
    .map((r: unknown) => {
      const rObj = (r ?? {}) as Record<string, unknown>;
      const type = String(rObj.type ?? "FREE_TEXT") === "MULTIPLE_CHOICE" ? "MULTIPLE_CHOICE" as const : "FREE_TEXT" as const;
      return {
        type,
        question: String(rObj.question ?? ""),
        ...(type === "MULTIPLE_CHOICE" && Array.isArray(rObj.options)
          ? { options: rObj.options.map((o: unknown) => String(o)) }
          : {}),
      };
    });

  const thumbnailIdeas = (Array.isArray(raw.thumbnailIdeas) ? raw.thumbnailIdeas : [])
    .slice(0, 3)
    .map((t: unknown) => {
      const tObj = (t ?? {}) as Record<string, unknown>;
      return {
        headline: String(tObj.headline ?? ""),
        subtext: String(tObj.subtext ?? ""),
        colors: Array.isArray(tObj.colors) ? tObj.colors.map(String) : ["#6C63FF", "#0a0a0f", "#FFFFFF"],
        composition: String(tObj.composition ?? ""),
        canvaPrompt: String(tObj.canvaPrompt ?? ""),
      };
    });

  const vp = (raw.videoPrompt ?? {}) as Record<string, unknown>;
  const videoPrompt = {
    duration: String(vp.duration ?? "30–60 seconds"),
    style: String(vp.style ?? "Cinematic product demo"),
    scriptOutline: String(vp.scriptOutline ?? ""),
    gemini: String(vp.gemini ?? ""),
    sora: String(vp.sora ?? ""),
    veo: String(vp.veo ?? ""),
  };

  return {
    id: generateId(),
    serviceInput: serviceInput.trim(),
    createdAt: new Date().toISOString(),
    title: truncate(String(raw.title ?? `I will provide professional ${serviceInput}`), 80),
    category: String(raw.category ?? "Programming & Tech"),
    subCategory: String(raw.subCategory ?? "Development"),
    tags,
    positiveKeywords,
    pricing,
    description: String(raw.description ?? ""),
    faqs,
    buyerRequirements,
    thumbnailIdeas,
    videoPrompt,
  };
}

async function callGeminiWithRetry(modelName: string, prompt: string, systemInstruction: string, retries = 3): Promise<string> {
  const modelsToTry = [modelName, "gemini-2.5-flash", "gemini-2.0-flash"];
  let lastError: any;

  for (let attempt = 0; attempt < retries; attempt++) {
    for (const modelId of modelsToTry) {
      try {
        const model = genAI!.getGenerativeModel({ model: modelId });
        const chat = model.startChat({
          history: [
            { role: "user", parts: [{ text: systemInstruction }] },
            { role: "model", parts: [{ text: "Understood. I will strictly follow the instructions and output only valid JSON matching the schema." }] },
          ],
        });
        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        return response.text();
      } catch (error: any) {
        lastError = error;
        console.warn(`Attempt ${attempt + 1} with model ${modelId} failed:`, error.message);
        if (error.status === 503 || error.message.includes("503") || error.message.includes("high demand")) {
          // If it's a 503, wait a bit and try the next model
          await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
          continue;
        } else {
          // If it's not a 503, throw it immediately (e.g. 400 Bad Request or 401 Unauthorized)
          throw error;
        }
      }
    }
  }
  throw lastError;
}

export async function generateGigContent(serviceInput: string): Promise<GigData> {
  if (!genAI) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env file. Please add your Gemini API key to use the AI generator.");
  }

  console.log("Generating gig content using Gemini API directly...");

  try {
    const text = await callGeminiWithRetry("gemini-flash-latest", buildUserPrompt(serviceInput), SYSTEM_PROMPT);
    
    // Clean markdown if present
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const rawGig = JSON.parse(cleaned);
    return normalizeGig(rawGig, serviceInput);
    
  } catch (error: any) {
    console.error("Gemini API error:", error);
    throw new Error(error.message || "Failed to generate gig content. Please check your API key or try again.");
  }
}

const EXTRACTION_SYSTEM_PROMPT = `You are an expert data extractor and Fiverr gig analyst.
Your task is to analyze the raw HTML/text of a Fiverr gig and extract all relevant information exactly as requested.
You MUST return ONLY valid JSON matching the exact schema. Do NOT include any explanations or conversational text.`;

function buildExtractionPrompt(html: string): string {
  // We truncate the HTML if it's absurdly large, though Gemini Flash handles huge contexts well.
  const cleanHtml = html.length > 500000 ? html.slice(0, 500000) : html;
  
  return `Here is the raw HTML/text of a Fiverr gig page.

Analyze this content and extract the title, category, tags, pricing packages, description, FAQs, etc.
If some information (like buyer requirements or video prompts) is missing from the page, generate realistic professional placeholders based on the gig's context.

Return ONLY a valid JSON object with this exact schema (no markdown, no code blocks, raw JSON only):

{
  "title": "string — starts with 'I will', max 80 chars",
  "category": "string — main category",
  "subCategory": "string — sub-category",
  "tags": ["array of exactly 5 search tags"],
  "positiveKeywords": ["array of 5 positive keywords buyers search for"],
  "pricing": {
    "basic": { "packageTitle": "string", "price": "string", "deliveryDays": number, "revisions": number, "description": "string", "features": [{ "label": "string", "included": boolean }] },
    "standard": { "packageTitle": "string", "price": "string", "deliveryDays": number, "revisions": number, "description": "string", "features": [{ "label": "string", "included": boolean }] },
    "premium": { "packageTitle": "string", "price": "string", "deliveryDays": number, "revisions": "number or 'Unlimited'", "description": "string", "features": [{ "label": "string", "included": boolean }] }
  },
  "description": "string — full gig description",
  "faqs": [{ "question": "string", "answer": "string" }],
  "buyerRequirements": [{ "type": "FREE_TEXT or MULTIPLE_CHOICE", "question": "string", "options": ["array"] }],
  "thumbnailIdeas": [{ "headline": "string", "subtext": "string", "colors": ["string"], "composition": "string", "canvaPrompt": "string" }],
  "videoPrompt": { "duration": "string", "style": "string", "scriptOutline": "string", "gemini": "string", "sora": "string", "veo": "string" }
}

Raw Gig HTML/Text:
"""
${cleanHtml}
"""`;
}

export async function extractGigFromHTML(html: string, originalUrl: string): Promise<GigData> {
  if (!genAI) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env file. Please add your Gemini API key to use the AI extractor.");
  }

  console.log("Extracting gig content using Gemini API...");

  try {
    const text = await callGeminiWithRetry("gemini-flash-latest", buildExtractionPrompt(html), EXTRACTION_SYSTEM_PROMPT);
    
    // Clean markdown if present
    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const rawGig = JSON.parse(cleaned);
    
    // Extract a serviceName to use for normalization if needed
    let serviceInput = originalUrl;
    try {
      const parts = new URL(originalUrl).pathname.split("/").filter(Boolean);
      if (parts.length >= 2) serviceInput = parts[1].replace(/-/g, " ");
    } catch {}

    return normalizeGig(rawGig, serviceInput);
    
  } catch (error: any) {
    console.error("Gemini AI extraction error:", error);
    throw new Error(error.message || "Failed to extract gig content. Please check your API key or try again.");
  }
}

export async function synthesizeGigsFromHTML(htmlArray: string[], mainUrl: string): Promise<GigData> {
  if (!genAI) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env file.");
  }

  console.log(`Synthesizing ${htmlArray.length} gigs into one super gig...`);

  const combinedHtmlPrompt = htmlArray.map((html, i) => `\n\n--- COMPETITOR GIG ${i + 1} ---\n${html}`).join("");
  
  const prompt = `Here is the raw HTML/text of ${htmlArray.length} top-rated competing Fiverr gigs.

Your task is to "Steal & Improve". Analyze all of them to find the best keywords, the most compelling pricing structures, the clearest FAQs, and the strongest buyer requirements.
Synthesize all this data into ONE ultimate, super-optimized gig that beats all of them.

Return ONLY a valid JSON object matching this exact schema:

{
  "title": "string — starts with 'I will', max 80 chars",
  "category": "string — main category",
  "subCategory": "string — sub-category",
  "tags": ["array of exactly 5 search tags"],
  "positiveKeywords": ["array of 5 positive keywords buyers search for"],
  "pricing": {
    "basic": { "packageTitle": "string", "price": "string", "deliveryDays": number, "revisions": number, "description": "string", "features": [{ "label": "string", "included": boolean }] },
    "standard": { "packageTitle": "string", "price": "string", "deliveryDays": number, "revisions": number, "description": "string", "features": [{ "label": "string", "included": boolean }] },
    "premium": { "packageTitle": "string", "price": "string", "deliveryDays": number, "revisions": "number or 'Unlimited'", "description": "string", "features": [{ "label": "string", "included": boolean }] }
  },
  "description": "string — full gig description combining the best elements",
  "faqs": [{ "question": "string", "answer": "string" }],
  "buyerRequirements": [{ "type": "FREE_TEXT or MULTIPLE_CHOICE", "question": "string", "options": ["array"] }],
  "thumbnailIdeas": [{ "headline": "string", "subtext": "string", "colors": ["string"], "composition": "string", "canvaPrompt": "string" }],
  "videoPrompt": { "duration": "string", "style": "string", "scriptOutline": "string", "gemini": "string", "sora": "string", "veo": "string" }
}

Raw Competitor Data:
"""${combinedHtmlPrompt}"""`;

  try {
    const text = await callGeminiWithRetry("gemini-2.5-flash", prompt, EXTRACTION_SYSTEM_PROMPT);
    
    const cleaned = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
    const rawGig = JSON.parse(cleaned);
    
    let serviceInput = mainUrl;
    try {
      const parts = new URL(mainUrl).pathname.split("/").filter(Boolean);
      if (parts.length >= 2) serviceInput = parts[1].replace(/-/g, " ") + " (Synthesized)";
    } catch {}

    return normalizeGig(rawGig, serviceInput);
    
  } catch (error: any) {
    console.error("Gemini AI synthesis error:", error);
    throw new Error(error.message || "Failed to synthesize gig content. Please check your API key or try again.");
  }
}

export interface ThumbnailGalleryData {
  coverPrompt: string;
  screenshotPrompts: string[];
}

export async function generateThumbnailPrompts(description: string): Promise<ThumbnailGalleryData> {
  if (!genAI) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env file.");
  }

  console.log("Generating thumbnail prompts with Gemini...");

  const prompt = `You are a professional Fiverr Gig Designer and Art Director.
A user wants to create a gallery of thumbnails for their gig based on this description:
"""${description}"""

Your task is to generate highly detailed image generation prompts that we will send to an AI image generator (like Midjourney/Pollinations).

We need a complete Fiverr gallery comprising:
1. A Main Cover (1 image): A beautiful, professional, high-converting thumbnail that comprises everything about the service. Include text placeholders if necessary (e.g. "Text reading: Foodie App"). It should be visually striking, perhaps a 3D isometric mockup or a sleek modern composition.
2. Showcase Screenshots (3 to 5 images): Detailed prompts showing the actual "feel" or inner pages/screens of what is being built (e.g., if it's an app, show the landing page, the admin dashboard, the checkout screen, etc.). The exact number (between 3 and 5) is up to you based on what makes sense for the project.

Write the prompts so they produce highly realistic, UI/UX professional designs or high-quality mockups.

Return ONLY a valid JSON object matching this schema:
{
  "coverPrompt": "Detailed prompt for the main cover...",
  "screenshotPrompts": [
    "Detailed prompt for screenshot 1...",
    "Detailed prompt for screenshot 2...",
    "Detailed prompt for screenshot 3..."
  ]
}`;

  try {
    const text = await callGeminiWithRetry("gemini-2.5-flash", prompt, "You are a professional AI prompt engineer. Output only valid JSON.");
    const cleaned = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
    const data = JSON.parse(cleaned) as ThumbnailGalleryData;
    return data;
  } catch (error: any) {
    console.error("Gemini AI thumbnail prompt error:", error);
    throw new Error(error.message || "Failed to generate thumbnail prompts. Please try again.");
  }
}
