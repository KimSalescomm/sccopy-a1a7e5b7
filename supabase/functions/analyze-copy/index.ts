import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ANALYZE_PROMPT = `당신은 LG전자 세일즈커뮤니케이션팀의 전문 AI 카피라이터입니다.
사용자가 입력한 USP 카피를 분석하여 카피 유형을 판별하세요.

## 카피 유형 분류
- **Concept**: 제품의 의미나 방향성 중심. 선언적이고 제품 중심. 예) "에어로미늄으로 마침내 메탈마저 가볍게!"
- **Benefit**: 고객의 변화/혜택 중심. 직관적이고 고객 중심. 예) "습기가 생기기 쉬운 에어컨 필터, 꼼꼼한 정기 관리로 더 청결하게"
- **Proof**: 기능, 수치, 근거 중심. 논리적이고 제품 중심. 원리와 설명 포함.
- **Talk**: 설명형, 대화형 전달. 공감형이고 고객 중심. 상담 가이드용.

## 응답 형식
반드시 아래 JSON 형식으로만 응답하세요:
{
  "type": "Concept" | "Benefit" | "Proof" | "Talk",
  "confidence": "high" | "medium" | "low",
  "reason": "판별 이유 (1줄)"
}`;

const CONVERT_PROMPT = `당신은 LG전자 세일즈커뮤니케이션팀의 전문 AI 카피라이터입니다.
사용자가 입력한 USP 카피를 지정된 유형으로 변환하세요.

## 카피 유형 정의
- **Concept**: 제품의 의미나 방향성 중심. 선언적, 임팩트 있는 표현. 짧고 강렬하게.
- **Benefit**: 고객이 체감하는 변화/혜택 중심. 고객의 상황과 결과를 직관적으로.
- **Proof**: 기능, 수치, 근거 중심. 구체적 스펙과 원리를 논리적으로 설명.
- **Talk**: 대화형, 공감형 전달. 고객에게 말하듯 자연스럽고 친근하게.

## 변환 규칙
1. 원문의 핵심 메시지와 제품 정보를 유지한다
2. 수치, 기능명, 제품명, 브랜드명은 그대로 보존한다
3. 목표 유형의 톤과 구조에 맞게 재구성한다
4. 제안은 1~2개만 제공한다

## 응답 형식
반드시 아래 JSON 형식으로만 응답하세요:
{
  "suggestions": [
    {
      "text": "변환된 카피",
      "description": "이 제안의 특징 (1줄)"
    }
  ]
}`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, mode, targetType } = await req.json();

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

    let systemPrompt: string;
    let userMessage: string;

    if (mode === "convert") {
      systemPrompt = CONVERT_PROMPT;
      userMessage = `원문: ${text}\n\n목표 유형: ${targetType}\n\n위 카피를 ${targetType} 유형으로 변환해주세요.`;
    } else {
      systemPrompt = ANALYZE_PROMPT;
      userMessage = text;
    }

    const models = ["google/gemini-3-flash-preview", "google/gemini-2.5-flash"];
    let response: Response | null = null;

    for (const model of models) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model,
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage },
              ],
            }),
          });

          if (response.ok) break;
          if (response.status === 429 || response.status === 402) {
            return new Response(
              JSON.stringify({ error: response.status === 429 ? "요청이 너무 많습니다." : "크레딧이 부족합니다." }),
              { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          response = null;
          if (attempt === 0) await new Promise(r => setTimeout(r, 1000));
        } catch {
          response = null;
          if (attempt === 0) await new Promise(r => setTimeout(r, 1000));
        }
      }
      if (response?.ok) break;
    }

    if (!response || !response.ok) {
      return new Response(
        JSON.stringify({ error: "AI 서비스가 일시적으로 불안정합니다." }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) throw new Error("AI 응답이 비어있습니다.");

    let result;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      result = JSON.parse(jsonMatch[1].trim());
    } catch {
      console.error("Failed to parse:", content);
      result = mode === "convert"
        ? { suggestions: [{ text: content.trim(), description: "AI 제안" }] }
        : { type: "Concept", confidence: "low", reason: "분석 실패" };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-copy error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "알 수 없는 오류" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
