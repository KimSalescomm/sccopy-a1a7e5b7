import React, { useState, useCallback, useEffect } from 'react';
import { Loader2, Sparkles, RefreshCw, Check, X, ArrowRight } from 'lucide-react';
import { analyzeCopyType, convertCopy, COPY_TYPE_LABELS, COPY_TYPES, type CopyType, type CopySuggestion } from '@/lib/copy-analysis';
import { correctText, CATEGORY_TOOLTIPS, type CorrectionChange } from '@/lib/ai-correction';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CopyTypeFlowProps {
  text: string;
  elementId: string;
  onTextChange: (id: string, text: string) => void;
  onClose: () => void;
}

type FlowStep = 'analyze' | 'suggest' | 'correct';

export function CopyTypeFlow({ text, elementId, onTextChange, onClose }: CopyTypeFlowProps) {
  const [currentType, setCurrentType] = useState<CopyType | null>(null);
  const [analysisReason, setAnalysisReason] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [step, setStep] = useState<FlowStep>('analyze');

  // Suggestion state
  const [suggestions, setSuggestions] = useState<CopySuggestion[]>([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [selectedTargetType, setSelectedTargetType] = useState<CopyType | null>(null);

  // Correction state
  const [corrections, setCorrections] = useState<CorrectionChange[]>([]);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [appliedCorrections, setAppliedCorrections] = useState<Set<number>>(new Set());
  const [currentText, setCurrentText] = useState(text);

  // Analyze on mount
  useEffect(() => {
    (async () => {
      try {
        const result = await analyzeCopyType(text);
        setCurrentType(result.type);
        setAnalysisReason(result.reason || '');
      } catch (err: any) {
        toast.error(err.message || '카피 유형 분석 실패');
      } finally {
        setIsAnalyzing(false);
      }
    })();
  }, []);

  const handleSelectType = useCallback(async (type: CopyType) => {
    setShowTypeSelector(false);
    if (type === currentType) return;

    setSelectedTargetType(type);
    setStep('suggest');
    setIsSuggesting(true);
    setSuggestions([]);

    try {
      const result = await convertCopy(currentText, type);
      setSuggestions(result.suggestions || []);
    } catch (err: any) {
      toast.error(err.message || '카피 변환 실패');
      setStep('analyze');
    } finally {
      setIsSuggesting(false);
    }
  }, [currentType, currentText]);

  const handleApplySuggestion = useCallback(async (suggestion: CopySuggestion) => {
    setCurrentText(suggestion.text);
    onTextChange(elementId, suggestion.text);
    setCurrentType(selectedTargetType);
    toast.success('카피가 적용되었습니다.');

    // Auto-run correction
    setStep('correct');
    setIsCorrecting(true);
    setCorrections([]);
    setAppliedCorrections(new Set());

    try {
      const result = await correctText(suggestion.text);
      const normalized = result.changes.map((c: any) => ({
        ...c,
        categories: c.categories || (c.category ? [c.category] : []),
      }));
      setCorrections(normalized);
    } catch (err: any) {
      toast.error(err.message || '첨삭 실패');
    } finally {
      setIsCorrecting(false);
    }
  }, [elementId, onTextChange, selectedTargetType]);

  const handleRetry = useCallback(async () => {
    if (!selectedTargetType) return;
    setIsSuggesting(true);
    setSuggestions([]);
    try {
      const result = await convertCopy(currentText, selectedTargetType);
      setSuggestions(result.suggestions || []);
    } catch (err: any) {
      toast.error(err.message || '카피 변환 실패');
    } finally {
      setIsSuggesting(false);
    }
  }, [currentText, selectedTargetType]);

  const applyCorrection = useCallback((txt: string, change: CorrectionChange): { result: string; success: boolean } => {
    if (txt.includes(change.original)) {
      return { result: txt.replace(change.original, change.corrected), success: true };
    }
    const trimmed = change.original.trim();
    if (trimmed && txt.includes(trimmed)) {
      return { result: txt.replace(trimmed, change.corrected.trim()), success: true };
    }
    const escaped = change.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const flexPattern = escaped.replace(/\s+/g, '\\s+');
    const regex = new RegExp(flexPattern);
    if (regex.test(txt)) {
      return { result: txt.replace(regex, change.corrected), success: true };
    }
    return { result: txt, success: false };
  }, []);

  const handleApplyCorrection = useCallback((index: number, change: CorrectionChange) => {
    if (appliedCorrections.has(index)) return;
    const { result, success } = applyCorrection(currentText, change);
    if (!success) {
      setAppliedCorrections(prev => new Set(prev).add(index));
      toast.error(`"${change.original}" 텍스트를 찾을 수 없습니다.`);
      return;
    }
    setCurrentText(result);
    onTextChange(elementId, result);
    setAppliedCorrections(prev => new Set(prev).add(index));
    toast.success('수정이 적용되었습니다.');
  }, [currentText, elementId, onTextChange, appliedCorrections, applyCorrection]);

  const handleCloseSuggestions = useCallback(() => {
    setStep('analyze');
    setSuggestions([]);
    setSelectedTargetType(null);
    setShowTypeSelector(false);
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className="absolute left-0 right-0 z-[200] bg-background border border-border rounded-lg shadow-xl"
        style={{ top: '100%', marginTop: 8, minWidth: 300, maxWidth: 440 }}
        onMouseDown={e => e.stopPropagation()}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground" style={{ fontSize: 15 }}>카피 분석 · 변환</span>
          </div>
          <button className="p-1 rounded hover:bg-muted transition-colors" onClick={onClose}>
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="px-4 py-3" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Step 1: Copy Type Analysis */}
          <div>
            {isAnalyzing ? (
              <div className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: 13 }}>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                분석 중...
              </div>
            ) : currentType ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Type + Change button */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>카피 유형:</span>
                  <span className="font-semibold text-foreground" style={{ fontSize: 14 }}>{currentType}</span>
                  <button
                    className="text-muted-foreground hover:text-primary transition-colors"
                    style={{ fontSize: 13, marginLeft: 'auto', padding: '2px 0' }}
                    onClick={() => setShowTypeSelector(!showTypeSelector)}
                  >
                    바꿔보기
                  </button>
                </div>

                {/* Dynamic reason */}
                {analysisReason && (
                  <div className="flex items-start gap-1.5">
                    <ArrowRight className="w-3 h-3 text-muted-foreground mt-0.5 shrink-0" />
                    <span className="text-muted-foreground" style={{ fontSize: 12, lineHeight: 1.5 }}>
                      {analysisReason}
                    </span>
                  </div>
                )}

                {/* Inline type selector (expanded) */}
                <div
                  style={{
                    maxHeight: showTypeSelector ? 120 : 0,
                    opacity: showTypeSelector ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.25s ease, opacity 0.2s ease',
                  }}
                >
                  <div style={{ paddingTop: 4 }}>
                    <p className="text-muted-foreground" style={{ fontSize: 12, marginBottom: 8 }}>
                      다른 방식으로도 표현해볼까요?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {COPY_TYPES.map(type => (
                        <button
                          key={type}
                          className={`rounded-full border transition-colors font-medium ${
                            type === currentType
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border bg-card text-foreground hover:bg-accent hover:border-accent'
                          }`}
                          style={{ fontSize: 13, padding: '6px 12px' }}
                          onClick={() => handleSelectType(type)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Step 2: Suggestions */}
          {step !== 'analyze' && (
            <div
              className="border-t border-border/50 pt-3"
              style={{ animation: 'fadeSlideIn 0.25s ease' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium text-foreground" style={{ fontSize: 13 }}>
                    {selectedTargetType}형 카피 제안
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {!isSuggesting && suggestions.length > 0 && (
                    <button
                      className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                      style={{ fontSize: 12, padding: '2px 6px' }}
                      onClick={handleRetry}
                    >
                      <RefreshCw className="w-3 h-3" />
                      다른 제안
                    </button>
                  )}
                  <button
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    style={{ fontSize: 12, padding: '2px 6px' }}
                    onClick={handleCloseSuggestions}
                  >
                    닫기
                  </button>
                </div>
              </div>

              {isSuggesting ? (
                <div className="flex items-center gap-2 py-4 text-muted-foreground justify-center" style={{ fontSize: 13 }}>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  카피를 생성 중입니다...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-muted/40 border border-border/60"
                      style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}
                    >
                      <p className="text-foreground font-medium" style={{ fontSize: 13, lineHeight: 1.6 }}>
                        {s.text}
                      </p>
                      <p className="text-muted-foreground" style={{ fontSize: 11 }}>{s.description}</p>
                      <div className="flex justify-end">
                        <button
                          className="inline-flex items-center justify-center rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          style={{ fontSize: 12, height: 28, padding: '0 12px' }}
                          onClick={() => handleApplySuggestion(s)}
                        >
                          적용
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Corrections */}
          {step === 'correct' && (
            <div
              className="border-t border-border/50 pt-3"
              style={{ animation: 'fadeSlideIn 0.25s ease' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-muted-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }}>고객언어 첨삭</span>
              </div>

              {isCorrecting ? (
                <div className="flex items-center gap-2 py-4 text-muted-foreground justify-center" style={{ fontSize: 13 }}>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  첨삭 중입니다...
                </div>
              ) : corrections.length === 0 ? (
                <div className="py-3 text-center text-muted-foreground" style={{ fontSize: 13 }}>
                  수정할 항목이 없습니다. 유지 권장합니다.
                </div>
              ) : (
                <div className="max-h-[200px] overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {corrections.map((change, i) => {
                    const isApplied = appliedCorrections.has(i);
                    const categories = (change.categories || []).slice(0, 2);
                    return (
                      <div
                        key={i}
                        className={`rounded-lg border transition-colors ${
                          isApplied ? 'bg-primary/5 border-primary/20 opacity-60' : 'bg-card border-border'
                        }`}
                        style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}
                      >
                        {categories.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {categories.map(cat => (
                              <Tooltip key={cat}>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex items-center rounded-full border border-border bg-muted/50 text-muted-foreground cursor-default select-none hover:bg-muted transition-colors" style={{ fontSize: 11, padding: '1px 8px', lineHeight: '18px' }}>
                                    {cat}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-[200px]">
                                  <p style={{ fontSize: 12 }}>{CATEGORY_TOOLTIPS[cat] || cat}</p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                        )}
                        <div className="flex items-start gap-2 flex-wrap">
                          <span className="line-through text-destructive/70 font-medium" style={{ fontSize: 13 }}>{change.original}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-primary font-medium" style={{ fontSize: 13 }}>{change.corrected}</span>
                        </div>
                        <p className="text-muted-foreground" style={{ fontSize: 12, lineHeight: 1.5 }}>{change.reason}</p>
                        {!isApplied && (
                          <div className="flex justify-end">
                            <button
                              className="inline-flex items-center justify-center rounded-md font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                              style={{ fontSize: 12, height: 28, padding: '0 10px' }}
                              onClick={() => handleApplyCorrection(i, change)}
                            >
                              이 항목 적용
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-4 py-2.5 border-t border-border bg-muted/20">
          <button
            className="inline-flex items-center justify-center rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            style={{ fontSize: 12, height: 28, padding: '0 10px' }}
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </TooltipProvider>
  );
}
