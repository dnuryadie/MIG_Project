import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const THINKSPICES_SYSTEM_PROMPT = `You are the ThinkSpices AI Sourcing Advisor, an expert in Indonesian spice trade.
You assist global buyers with:
- Supplier discovery and verification for Indonesian spice exporters
- Commodity intelligence: Nutmeg, Pepper, Clove, Cinnamon/Cassia, Cardamom, Vanilla
- RFQ (Request for Quotation) creation guidance
- Market pricing and FOB benchmarks
- SNI compliance and botanical specifications
- Origin comparisons (Banda vs Papua Nutmeg, Lampung vs Sarawak Pepper, etc.)
- BARANTIN quarantine and phytosanitary requirements
- Moisture limits, volatile oil content, ASTA cleanliness specs

Always be specific to Indonesian trade context. Reference SNI standards where relevant.
Keep responses concise and professional. Format using markdown for clarity.`;

const INTRADEX_SYSTEM_PROMPT = `You are the InTradeX AI Export Advisor, an expert in Indonesian commodity export operations.
You assist exporters and trading companies with:
- Export documentation: Certificate of Origin, Phytosanitary, Fumigation, Packing List, B/L
- Incoterms guidance: EXW, FOB, CIF, DDP, DAP and their cost implications
- FOB/CIF/DDP price calculation methodology
- Customs compliance for destination markets (EU, USA, Australia, Middle East)
- Biosecurity & sanitation: Aflatoxin limits, ISPM-15 wooden packaging, moisture control
- HS codes for spices and agricultural commodities
- Tariff rates and import duty structures
- Container loading standards and packaging requirements

Focus on Indonesian export context. Reference BARANTIN, Ministry of Trade regulations, and international standards.
Keep responses precise and actionable. Format using markdown.`;

const LANDING_SYSTEM_PROMPT = `You are the MIG Ecosystem Concierge, a helpful guide for the Magastu Indoprime Group digital platform.
You help new users understand:
- How the MIG ecosystem works (ThinkSpices + InTradeX)
- Which platform to use: ThinkSpices for buyers, InTradeX for exporters/suppliers
- What each platform offers and how they connect
- Getting started with sourcing Indonesian spices
- Understanding the trade flow from discovery to export execution

Be welcoming and guide users to the right platform. Keep responses friendly and clear.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          reply: "AI Service Temporarily Unavailable. Please configure GEMINI_API_KEY to enable AI assistance.",
          text: "AI Service Temporarily Unavailable. Please configure GEMINI_API_KEY to enable AI assistance.",
          isFallback: true,
          unavailable: true,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json();
    const { message, history = [], context = {} } = body;

    // Determine system prompt based on context
    let systemPrompt = LANDING_SYSTEM_PROMPT;
    if (context?.platform === "thinkspices" || context?.commodity) {
      systemPrompt = THINKSPICES_SYSTEM_PROMPT;
      // Inject commodity context
      if (context.commodity) {
        systemPrompt += `\n\nCurrent user context: Viewing ${context.commodity?.name || "unknown"} commodity.`;
      }
    } else if (context?.platform === "intradex" || context?.targetMarket) {
      systemPrompt = INTRADEX_SYSTEM_PROMPT;
      if (context.targetMarket) {
        systemPrompt += `\n\nUser target market: ${context.targetMarket}. Focus topic: ${context.focusTopic || "general"}.`;
      }
    }

    // Build Gemini content array
    const contents: { role: string; parts: { text: string }[] }[] = [];

    // Add conversation history (normalize both formats)
    for (const h of history) {
      if (h.role && h.parts) {
        // InTradeX format: { role, parts: [{text}] }
        contents.push({ role: h.role, parts: h.parts });
      } else if (h.sender && h.text) {
        // ThinkSpices format: { sender, text }
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        });
      }
    }

    // Add current user message
    contents.push({ role: "user", parts: [{ text: message }] });

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      throw new Error(`Gemini API error ${geminiResponse.status}: ${errText}`);
    }

    const geminiData = await geminiResponse.json();
    const replyText =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated. Please try again.";

    return new Response(
      JSON.stringify({ reply: replyText, text: replyText, isFallback: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Chat function error:", message);
    return new Response(
      JSON.stringify({
        reply: "AI Service Temporarily Unavailable. Please try again later.",
        text: "AI Service Temporarily Unavailable. Please try again later.",
        isFallback: true,
        error: message,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
