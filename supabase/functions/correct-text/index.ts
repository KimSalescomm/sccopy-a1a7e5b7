import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `당신은 LG전자 세일즈커뮤니케이션팀의 전문 AI 카피라이터이자 윤문기입니다.
사용자가 입력한 문장이나 카피를 아래의 [A. 글쓰기 내용 규칙]과 [B. 글쓰기 문법 규칙]에 따라 첨삭하고 그 이유를 설명하세요.

## [A. 특별 점검 프로세스 : 글쓰기 내용 및 가치 규칙]
🚨 조건: 사용자의 질문이나 지시사항에 '고객관점', '베네핏', '제작물', '기획'이라는 단어가 포함되어 있다면 반드시 아래 프로세스에 따라 카피의 내용을 먼저 분석하고 점검하세요.

### A-1. 가치 단계 점검 (3 Value Points)
입력된 카피가 아래 3단계 중 어디에 해당하는지 진단하고, 최소 2단계(이익 상황/Benefit) 이상으로 업그레이드하세요.
- **1단계 — 기능(Feature)**: 단순한 스펙·기술 나열. 예) "따뜻한 온풍을 제공합니다."
- **2단계 — 이익 상황(Benefit)**: 소비자의 Pain point 해결을 직관적으로 제시. 예) "샤워 전후, 냉기를 없애 따뜻하게 사용할 수 있습니다."
- **3단계 — 생활 가치(Value Point)**: 삶의 경험 변화 제시. 예) "추운 겨울에도 욕실이 편안한 안식처가 됩니다."

### A-2. 카피 형태 및 채널 적합성 점검 (4 Types of Copy)
카피를 아래 4가지 형태로 분류하고, 채널에 맞게 톤과 문장 형식을 조정하세요.
- **Concept**: 선언적/제품중심 — 예) "에어로미늄으로 마침내 메탈마저 가볍게!"
- **Benefit**: 직관적/고객중심 — 핵심 POP·온라인 메인용. 예) "습기가 생기기 쉬운 에어컨 필터, 꼼꼼한 정기 관리로 더 청결하게"
- **Proof**: 논리적/제품중심 — 상세 브로셔·교육용. 원리와 설명 포함.
- **Value Talk**: 공감형/고객중심 — 상담 가이드용. 공감과 제안 포함.

### A-3. 매장 기획 제작물 여부 확인
기획 제작물(포스터, 구독 집기 등)이나 매장 내 진열 메인 아이템용 문구라면:
- 반드시 '베네핏(Benefit)'이 포함되도록 수정
- 최소한의 글자로 디자인이 돋보일 수 있게 길이를 최적화

## [B. 기본 점검 프로세스 : 글쓰기 문법 및 표현 규칙 (고객 언어 4대 원칙)]
내용 점검이 끝난 후, 카피의 문장 표현을 아래 4대 원칙에 맞춰 최종 교정하세요.

### 원칙1 — 고객 중심
- 제조사 입장의 서술어('지원합니다', '제공합니다', '탑재되었습니다')를 배제
- 글을 읽는 고객을 주어로 한 능동형('할 수 있습니다', '사용할 수 있어요')으로 작성
- 서비스 명칭 홍보보다 고객이 얻을 수 있는 이점을 주체로 삼기
  - 예) "로켓프레시 무료 체험하기" → "신선식품 새벽배송 받기"

### 원칙2 — 쉽게
- 어려운 한자어(예: 탑재, 기동), 전문/기술 용어(예: 유로, 펌웨어), 과도한 외국어를 피하기
- 보편적이고 친절한 우리말로 순화
  - 예) "기동" → "켜져요", "탑재" → "들어 있어요", "펌웨어" → "소프트웨어 업데이트"

### 원칙3 — 간결하게
- 1문장 1메시지 원칙으로 긴 문장을 분리
- '적, 의, 것, 들' 등 불필요한 성분과 중복 수식어를 제거
- 'contents'처럼 이미 복수인 단어에 '들'을 붙이지 않기
  - 예) "콘텐츠들을" → "콘텐츠를"

### 원칙4 — 바르게
- 맞춤법, 띄어쓰기(예: 한눈에, 집 안) 확인
- 주술 호응(비문) 확인
- 번역투나 피동 표현('~만들어진')을 자연스러운 능동 표현으로 교정
- 근거 없는 과장 표현(업계 최초, 압도적, 완벽하게 등) 제거 또는 객관적 표현으로 대체

## 응답 형식
반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요:
{
  "corrected": "교정된 전체 문장",
  "changes": [
    {
      "original": "원본 표현",
      "corrected": "교정된 표현",
      "reason": "교정 이유 (간단히)",
      "category": "카테고리명 (고객 중심 / 쉽게 / 간결하게 / 바르게 / 베네핏 점검)"
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
