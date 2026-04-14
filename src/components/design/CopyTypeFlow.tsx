import React, { useState, useCallback, useEffect } from 'react';
import { ChevronDown, Loader2, Sparkles, RefreshCw, Check, X } from 'lucide-react';
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
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
      } catch (err: any) {
        toast.error(err.message || '카피 유형 분석 실패');
      } finally {
        setIsAnalyzing(false);
      }
    })();
  }, []);

  const handleSelectType = useCallback(async (type: CopyType) => {
    setDropdownOpen(false);
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
    // Apply suggestion to text
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

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className="absolute left-0 right-0 z-[200] bg-background border border-border rounded-lg shadow-xl overflow-hidden"
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
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-muted-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }}>카피 유형</span>
            </div>

            {isAnalyzing ? (
              <div className="flex items-center gap-2 text-muted-foreground" style={{ fontSize: 13 }}>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                분석 중...
              </div>
            ) : (
              <div className="relative">
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-card hover:bg-accent transition-colors w-full text-left"
                  style={{ fontSize: 13 }}
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span className="font-medium text-foreground">{currentType}</span>
                  <span className="text-muted-foreground" style={{ fontSize: 12 }}>
                    {currentType && COPY_TYPE_LABELS[currentType]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-10 overflow-hidden">
                    {COPY_TYPES.map(type => (
                      <button
                        key={type}
                        className={`w-full text-left px-3 py-2 hover:bg-accent transition-colors flex items-center justify-between ${
                          type === currentType ? 'bg-accent/50' : ''
                        }`}
                        style={{ fontSize: 13 }}
                        onClick={() => handleSelectType(type)}
                      >
                        <div>
                          <span className="font-medium text-foreground">{type}</span>
                          <span className="text-muted-foreground ml-2" style={{ fontSize: 12 }}>{COPY_TYPE_LABELS[type]}</span>
                        </div>
                        {type === currentType && <Check className="w-3.5 h-3.5 text-primary" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Suggestions */}
          {step !== 'analyze' && (
            <div className="border-t border-border/50 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em' }}>
                  {selectedTargetType} 유형 제안
                </span>
                {!isSuggesting && suggestions.length > 0 && (
                  <button
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    style={{ fontSize: 11 }}
                    onClick={handleRetry}
                  >
                    <RefreshCw className="w-3 h-3" />
                    다른 제안
                  </button>
                )}
              </div>

              {isSuggesting ? (
                <div className="flex items-center gap-2 py-4 text-muted-foreground justify-center" style={{ fontSize: 13 }}>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  카피를 생성 중입니다...
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {suggestions.map((s, i) => (
                    <div key={i} className="rounded-lg border border-border bg-card p-3" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <p className="text-foreground font-medium" style={{ fontSize: 13, lineHeight: 1.6 }}>{s.text}</p>
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
            <div className="border-t border-border/50 pt-3">
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
    </TooltipProvider>
  );
}
