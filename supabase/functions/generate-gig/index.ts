import { corsHeaders } from '../_shared/cors.ts';

const SYSTEM_PROMPT = `You are GigForge AI — an expert Fiverr gig copywriter and SEO strategist. 
You generate highly optimized, conversion-focused Fiverr gig content that helps freelancers rank higher and get more orders.
Always return valid JSON matching the exact schema provided. Never add explanations outside the JSON.`;

function buildUserPrompt(serviceInput: string): string {
  return `Generate a complete, professional Fiverr gig for a freelancer offering: "${serviceInput}"

Return ONLY a valid JSON object with this exact schema (no markdown, no code blocks, raw JSON only):

{
  "title": "string — starts with 'I will', max 80 chars, keyword-rich, conversion-focused",
  "category": "string — best-fit Fiverr main category (e.g. 'Programming & Tech', 'Graphics & Design', 'Digital Marketing', 'Video & Animation', 'Writing & Translation', 'Music & Audio', 'Data')",
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
  "description": "string — full Fiverr gig description, 800-1200 chars, SEO-rich, with emojis, sections, strong CTA. Must be compelling and convert browsers into buyers.",
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
      "colors": ["#hex1", "#hex2", "#hex3"],
      "composition": "string — layout description for designer",
      "canvaPrompt": "string — detailed prompt for Canva AI or Magic Design"
    }
  ],
  "videoPrompt": {
    "duration": "string — e.g. '30–60 seconds'",
    "style": "string — video style description",
    "scriptOutline": "string — timestamped script outline",
    "gemini": "string — full detailed prompt for Gemini/Veo 3 video generation",
    "sora": "string — full detailed prompt for Sora video generation",
    "veo": "string — full detailed prompt for Veo 2 video generation"
  }
}

Rules:
- Generate exactly 5 tags, 5 positiveKeywords, 6 FAQs, 7 buyerRequirements (mix FREE_TEXT and MULTIPLE_CHOICE), 3 thumbnailIdeas
- Each pricing package must have exactly 8 features with a mix of included:true and included:false
- Basic package: lower price, fewer features; Premium: highest price, most features included
- The description must feel human-written, professional, and Fiverr-optimized (not generic)
- Make everything highly specific to the service: "${serviceInput}"
- FAQs should address real buyer concerns for this specific service
- Tags must be actual Fiverr search terms buyers use`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { serviceInput } = await req.json();

    if (!serviceInput || typeof serviceInput !== 'string' || !serviceInput.trim()) {
      return new Response(
        JSON.stringify({ error: 'serviceInput is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
    const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');

    if (!apiKey || !baseUrl) {
      return new Response(
        JSON.stringify({ error: 'OnSpace AI environment variables not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating gig content for:', serviceInput.trim());

    const aiResponse = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(serviceInput.trim()) },
        ],
        temperature: 0.8,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('OnSpace AI error:', errText);
      return new Response(
        JSON.stringify({ error: `AI service error: ${aiResponse.status} — ${errText}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content ?? '';

    console.log('Raw AI response length:', rawContent.length);

    // Strip markdown code fences if present
    const cleaned = rawContent
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    let gigJson: Record<string, unknown>;
    try {
      gigJson = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr, '\nRaw:', cleaned.slice(0, 500));
      return new Response(
        JSON.stringify({ error: 'AI returned invalid JSON. Please try again.', raw: cleaned.slice(0, 300) }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize pricing from object keys to array with name field
    const pricingObj = gigJson.pricing as Record<string, unknown> | undefined;
    let pricingArray: unknown[] = [];
    if (pricingObj && typeof pricingObj === 'object' && !Array.isArray(pricingObj)) {
      const names = ['basic', 'standard', 'premium'] as const;
      const displayNames = ['Basic', 'Standard', 'Premium'] as const;
      pricingArray = names.map((key, i) => ({
        name: displayNames[i],
        ...((pricingObj[key] ?? {}) as Record<string, unknown>),
      }));
    } else if (Array.isArray(gigJson.pricing)) {
      pricingArray = gigJson.pricing;
    }

    const result = {
      ...gigJson,
      pricing: pricingArray,
    };

    return new Response(
      JSON.stringify({ data: result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('Unhandled error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
