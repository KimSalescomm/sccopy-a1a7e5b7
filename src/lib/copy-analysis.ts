import { supabase } from "@/integrations/supabase/client";

export type CopyType = "Concept" | "Benefit" | "Proof" | "Talk";

export interface CopyTypeAnalysis {
  type: CopyType;
  confidence: "high" | "medium" | "low";
  reason: string;
}

export interface CopySuggestion {
  text: string;
  description: string;
}

export interface ConvertResult {
  suggestions: CopySuggestion[];
}

export const COPY_TYPE_LABELS: Record<CopyType, string> = {
  Concept: "제품 의미·방향성 중심",
  Benefit: "고객 변화·혜택 중심",
  Proof: "기능·수치·근거 중심",
  Talk: "설명형·대화형 전달",
};

export const COPY_TYPES: CopyType[] = ["Concept", "Benefit", "Proof", "Talk"];

export async function analyzeCopyType(text: string): Promise<CopyTypeAnalysis> {
  const { data, error } = await supabase.functions.invoke("analyze-copy", {
    body: { text, mode: "analyze" },
  });
  if (error) throw new Error(error.message || "분석 실패");
  if (data?.error) throw new Error(data.error);
  return data as CopyTypeAnalysis;
}

export async function convertCopy(text: string, targetType: CopyType): Promise<ConvertResult> {
  const { data, error } = await supabase.functions.invoke("analyze-copy", {
    body: { text, mode: "convert", targetType },
  });
  if (error) throw new Error(error.message || "변환 실패");
  if (data?.error) throw new Error(data.error);
  return data as ConvertResult;
}
