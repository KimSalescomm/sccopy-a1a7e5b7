import { supabase } from "@/integrations/supabase/client";

export interface CorrectionChange {
  original: string;
  corrected: string;
  reason: string;
}

export interface CorrectionResult {
  corrected: string;
  changes: CorrectionChange[];
}

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

  // Fallback: if AI returned error in 200 response
  if (!data?.changes) {
    return { corrected: text, changes: [] };
  }

  return data as CorrectionResult;
}

export async function refineText(text: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke("correct-text", {
    body: { text, mode: "refine" },
  });

  if (error) {
    throw new Error(error.message || "다듬기 요청에 실패했습니다.");
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data.refined as string;
}
