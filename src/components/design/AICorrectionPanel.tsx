import React, { useState, useCallback } from 'react';
import { Sparkles, Loader2, X, Check, ArrowRight } from 'lucide-react';
import { correctText, type CorrectionChange } from '@/lib/ai-correction';
import { toast } from 'sonner';

interface AICorrectionPanelProps {
  text: string;
  elementId: string;
  onTextChange: (id: string, text: string) => void;
  onClose: () => void;
}

export function AICorrectionPanel({ text, elementId, onTextChange, onClose }: AICorrectionPanelProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [changes, setChanges] = useState<CorrectionChange[]>([]);
  const [appliedSet, setAppliedSet] = useState<Set<number>>(new Set());
  const [checkedSet, setCheckedSet] = useState<Set<number>>(new Set());
  const [currentText, setCurrentText] = useState(text);

  const runCorrection = useCallback(async (targetText?: string) => {
    const textToCheck = targetText ?? currentText;
    setIsLoading(true);
    setAppliedSet(new Set());
    setCheckedSet(new Set());
    try {
      const result = await correctText(textToCheck);
      setChanges(result.changes);
      setCurrentText(textToCheck);
      // Auto-check all by default
      setCheckedSet(new Set(result.changes.map((_, i) => i)));
    } catch (err: any) {
      toast.error(err.message || '첨삭에 실패했습니다.');
      onClose();
    } finally {
      setIsLoading(false);
    }
  }, [currentText, onClose]);

  React.useEffect(() => {
    runCorrection(text);
  }, []);

  // Apply a single change with fuzzy matching
  const applyChange = useCallback((txt: string, change: CorrectionChange): { result: string; success: boolean } => {
    // Try exact match first
    if (txt.includes(change.original)) {
      return { result: txt.replace(change.original, change.corrected), success: true };
    }
    // Try trimmed match
    const trimmed = change.original.trim();
    if (trimmed && txt.includes(trimmed)) {
      return { result: txt.replace(trimmed, change.corrected.trim()), success: true };
    }
    // Try normalized whitespace match
    const normalize = (s: string) => s.replace(/\s+/g, ' ').trim();
    const normalizedOrig = normalize(change.original);
    const normalizedTxt = normalize(txt);
    const idx = normalizedTxt.indexOf(normalizedOrig);
    if (idx !== -1) {
      // Find the corresponding position in original text
      let origIdx = 0;
      let normIdx = 0;
      const txtTrimmed = txt.replace(/^\s+/, '');
      const leadingSpaces = txt.length - txtTrimmed.length;
      
      // Simple approach: split by the normalized pattern
      const parts = txt.split(change.original);
      if (parts.length === 1) {
        // Try replacing with regex that's whitespace-flexible
        const escaped = change.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const flexPattern = escaped.replace(/\s+/g, '\\s+');
        const regex = new RegExp(flexPattern);
        const match = txt.match(regex);
        if (match) {
          return { result: txt.replace(regex, change.corrected), success: true };
        }
      }
    }
    return { result: txt, success: false };
  }, []);

  const handleApplyItem = useCallback((index: number, change: CorrectionChange) => {
    if (appliedSet.has(index)) return;

    const { result, success } = applyChange(currentText, change);
    if (!success) {
      setAppliedSet(prev => new Set(prev).add(index));
      toast.error(`"${change.original}" 텍스트를 찾을 수 없습니다.`);
      return;
    }

    setCurrentText(result);
    onTextChange(elementId, result);
    setAppliedSet(prev => new Set(prev).add(index));
    toast.success('수정이 적용되었습니다.');
  }, [currentText, elementId, onTextChange, appliedSet, applyChange]);

  const handleApplyChecked = useCallback(() => {
    let updated = currentText;
    const newApplied = new Set(appliedSet);
    let appliedCount = 0;

    changes.forEach((change, i) => {
      if (!checkedSet.has(i) || newApplied.has(i)) return;
      const { result, success } = applyChange(updated, change);
      if (success) {
        updated = result;
        newApplied.add(i);
        appliedCount++;
      } else {
        newApplied.add(i);
      }
    });

    if (appliedCount > 0) {
      setCurrentText(updated);
      onTextChange(elementId, updated);
      setAppliedSet(newApplied);
      toast.success(`${appliedCount}건의 수정이 적용되었습니다.`);
    } else {
      toast.error('적용할 수 있는 항목이 없습니다.');
    }
  }, [currentText, changes, checkedSet, elementId, onTextChange, appliedSet, applyChange]);

  const toggleCheck = useCallback((index: number) => {
    setCheckedSet(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    const unapplied = changes.map((_, i) => i).filter(i => !appliedSet.has(i));
    const allChecked = unapplied.every(i => checkedSet.has(i));
    if (allChecked) {
      setCheckedSet(prev => {
        const next = new Set(prev);
        unapplied.forEach(i => next.delete(i));
        return next;
      });
    } else {
      setCheckedSet(prev => {
        const next = new Set(prev);
        unapplied.forEach(i => next.add(i));
        return next;
      });
    }
  }, [changes, appliedSet, checkedSet]);

  const unappliedCheckedCount = changes.filter((_, i) => checkedSet.has(i) && !appliedSet.has(i)).length;
  const unappliedIndices = changes.map((_, i) => i).filter(i => !appliedSet.has(i));
  const allUnappliedChecked = unappliedIndices.length > 0 && unappliedIndices.every(i => checkedSet.has(i));

  return (
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
          <span className="font-semibold text-foreground" style={{ fontSize: 15 }}>AI 첨삭 제안</span>
        </div>
        <button
          className="p-1 rounded hover:bg-muted transition-colors"
          onClick={onClose}
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="px-4 pt-1.5 pb-0.5">
        <p style={{ fontSize: 12 }} className="text-muted-foreground">고객언어 기준으로 수정이 필요한 항목을 제안합니다</p>
      </div>

      {/* Content */}
      <div className="px-4 py-2.5 max-h-[280px] overflow-y-auto" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground" style={{ fontSize: 13 }}>
            <Loader2 className="w-4 h-4 animate-spin" />
            AI가 첨삭 중입니다...
          </div>
        ) : changes.length === 0 ? (
          <div className="py-5 text-center text-muted-foreground" style={{ fontSize: 13 }}>
            수정할 항목이 없습니다. 유지 권장합니다.
          </div>
        ) : (
          <>
            {/* Select all */}
            {unappliedIndices.length > 0 && (
              <label className="flex items-center gap-2 cursor-pointer select-none pb-1 border-b border-border/50">
                <input
                  type="checkbox"
                  checked={allUnappliedChecked}
                  onChange={toggleAll}
                  className="w-3.5 h-3.5 rounded accent-primary"
                />
                <span className="text-muted-foreground" style={{ fontSize: 12 }}>전체 선택</span>
              </label>
            )}
            {changes.map((change, i) => {
              const isApplied = appliedSet.has(i);
              return (
                <div
                  key={i}
                  className={`rounded-md border transition-colors ${
                    isApplied
                      ? 'bg-primary/5 border-primary/20 opacity-70'
                      : 'bg-background border-border'
                  }`}
                  style={{ padding: 12, display: 'flex', gap: 10 }}
                >
                  {/* Checkbox */}
                  <div className="pt-0.5 shrink-0">
                    {isApplied ? (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <input
                        type="checkbox"
                        checked={checkedSet.has(i)}
                        onChange={() => toggleCheck(i)}
                        className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                      />
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 }}>
                    <div className="flex items-start gap-2 flex-wrap">
                      <span className="line-through text-destructive/70 font-medium" style={{ fontSize: 13 }}>{change.original}</span>
                      <ArrowRight className="w-3 h-3 mt-0.5 text-muted-foreground shrink-0" />
                      <span className="text-primary font-medium" style={{ fontSize: 13 }}>{change.corrected}</span>
                    </div>
                    <p className="text-muted-foreground" style={{ fontSize: 12, lineHeight: 1.5 }}>{change.reason}</p>
                    {!isApplied && (
                      <div className="flex justify-end">
                        <button
                          className="inline-flex items-center justify-center rounded-md font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                          style={{ fontSize: 12, height: 28, padding: '0 10px' }}
                          onClick={() => handleApplyItem(i, change)}
                        >
                          이 항목 적용
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Footer */}
      {!isLoading && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/20">
          <button
            className="inline-flex items-center justify-center rounded-md font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            style={{ fontSize: 12, height: 28, padding: '0 10px' }}
            onClick={onClose}
          >
            닫기
          </button>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center justify-center gap-[4px] rounded-md font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              style={{ fontSize: 12, height: 28, padding: '0 10px' }}
              onClick={() => runCorrection()}
            >
              <Sparkles className="w-3 h-3" />
              다시 첨삭
            </button>
            {unappliedCheckedCount > 0 && (
              <button
                className="inline-flex items-center justify-center rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                style={{ fontSize: 12, height: 28, padding: '0 10px' }}
                onClick={handleApplyChecked}
              >
                선택 적용 ({unappliedCheckedCount})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
