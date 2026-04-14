import { supabase } from "@/integrations/supabase/client";

export interface CorrectionChange {
  original: string;
  corrected: string;
  reason: string;
  categories: string[];
}

export interface CorrectionResult {
  corrected: string;
  changes: CorrectionChange[];
}

// Category tooltip map
export const CATEGORY_TOOLTIPS: Record<string, string> = {
  "고객 혜택 보완": "고객이 얻는 결과가 드러나지 않거나 기능 설명 중심으로 작성됨",
  "어려운 단어": "이해하기 어려운 표현 사용",
  "외래어/한자어": "낯선 외국어 또는 한자어 사용",
  "중복 표현": "같은 의미가 반복됨",
  "문장 과다": "한 문장에 정보가 많음",
  "불필요 수식": "과도한 강조 표현 사용",
  "맞춤법 오류": "맞춤법이 맞지 않음",
  "띄어쓰기 오류": "띄어쓰기가 잘못됨",
  "비문": "문장 구조가 어색함",
};

export async function correctText(text: string): Promise<CorrectionResult> {
  const { data, error } = await supabase.functions.invoke("correct-text", {
    body: { text },
  });

  if (error) {
    throw new Error(error.message || "첨삭 요청에 실패했습니다.");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  if (!data?.changes) {
    return { corrected: text, changes: [] };
  }

  // Normalize: convert old `category` field to `categories` array
  const result = data as CorrectionResult;
  result.changes = result.changes.map((c: any) => ({
    ...c,
    categories: c.categories || (c.category ? [c.category] : []),
  }));

  return result;
}
