import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `당신은 LG 고객언어 글쓰기 전문 교정 도우미입니다.

아래 4가지 원칙에 따라 입력된 텍스트를 교정해주세요:

## 원칙1 — 고객 중심
- 기업이 아닌 고객이 주어가 되도록 문장을 바꿔주세요
- "LG전자는 ~를 제공합니다" → "~를 사용할 수 있어요"
- "탑재되었습니다", "지원합니다" 같은 기업 관점 동사를 고객 관점으로 바꿔주세요

## 원칙2 — 쉽게
- 전문용어를 쉬운 말로 바꿔주세요
- 예: "기동" → "켜져요", "탑재" → "들어 있어요", "펌웨어" → "소프트웨어 업데이트"

## 원칙3 — 간결하게
- 명사 나열(3개 이상 연속)을 풀어서 써주세요
- 불필요한 표현(적, 것, 들, 적으로, 위하여)을 제거해주세요

## 원칙4 — 바르게
- 맞춤법, 띄어쓰기 오류를 교정해주세요
- 근거 없는 과장 표현(업계 최초, 압도적, 완벽하게 등)을 제거하거나 객관적 표현으로 바꿔주세요

## 응답 형식
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요:
{
  "corrected": "교정된 전체 문장",
  "changes": [
    {
      "original": "원본 표현",
      "corrected": "교정된 표현",
      "reason": "교정 이유 (간단히)"
    }
  ]
}

변경사항이 없으면:
{
  "corrected": "원본 그대로",
  "changes": []
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "텍스트가 비어있습니다." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해주세요." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "크레딧이 부족합니다. Settings > Workspace > Usage에서 충전해주세요." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI 응답이 비어있습니다.");
    }

    // Parse the JSON from the AI response
    let result;
    try {
      // Extract JSON from possible markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      result = JSON.parse(jsonMatch[1].trim());
    } catch {
      console.error("Failed to parse AI response:", content);
      // Fallback: treat the entire response as the corrected text
      result = { corrected: content.trim(), changes: [] };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("correct-text error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
