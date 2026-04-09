import React, { useState, useCallback } from 'react';
import { Sparkles, Loader2, X, Check, ArrowRight, RefreshCw } from 'lucide-react';
import { correctText, refineText, type CorrectionChange } from '@/lib/ai-correction';
import { correctText, refineText, type CorrectionChange } from '@/lib/ai-correction';
import { toast } from 'sonner';

interface AppliedState {
  [index: number]: 'applied' | 'not-found';
}

interface AICorrectionPanelProps {
  text: string;
  elementId: string;
  onTextChange: (id: string, text: string) => void;
  onClose: () => void;
}

export function AICorrectionPanel({ text, elementId, onTextChange, onClose }: AICorrectionPanelProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [changes, setChanges] = useState<CorrectionChange[]>([]);
  const [appliedState, setAppliedState] = useState<AppliedState>({});
  const [currentText, setCurrentText] = useState(text);
  const [isRefining, setIsRefining] = useState(false);
  const [refinedText, setRefinedText] = useState<string | null>(null);

  const runCorrection = useCallback(async (targetText?: string) => {
    const textToCheck = targetText ?? currentText;
    setIsLoading(true);
    setRefinedText(null);
    setAppliedState({});
    try {
      const result = await correctText(textToCheck);
      setChanges(result.changes);
      setCurrentText(textToCheck);
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

  const handleApplyItem = useCallback((index: number, change: CorrectionChange) => {
    if (appliedState[index]) return;

    const updatedText = currentText.replace(change.original, change.corrected);
    if (updatedText === currentText) {
      setAppliedState(prev => ({ ...prev, [index]: 'not-found' }));
      toast.error(`"${change.original}" 텍스트를 찾을 수 없습니다.`);
      return;
    }

    setCurrentText(updatedText);
    onTextChange(elementId, updatedText);
    setAppliedState(prev => ({ ...prev, [index]: 'applied' }));
    setRefinedText(null);
    toast.success('수정이 적용되었습니다.');
  }, [currentText, elementId, onTextChange, appliedState]);

  const handleApplyAll = useCallback(() => {
    let updated = currentText;
    const newState: AppliedState = { ...appliedState };
    changes.forEach((change, i) => {
      if (newState[i]) return;
      const next = updated.replace(change.original, change.corrected);
      if (next !== updated) {
        updated = next;
        newState[i] = 'applied';
      } else {
        newState[i] = 'not-found';
      }
    });
    setCurrentText(updated);
    onTextChange(elementId, updated);
    setAppliedState(newState);
    setRefinedText(null);
    toast.success('전체 수정이 적용되었습니다.');
  }, [currentText, changes, elementId, onTextChange, appliedState]);

  const handleRefine = useCallback(async () => {
    setIsRefining(true);
    setRefinedText(null);
    try {
      const result = await refineText(currentText);
      if (result === currentText) {
        toast.info('이미 자연스러운 문장입니다. 유지 권장합니다.');
      } else {
        setRefinedText(result);
      }
    } catch (err: any) {
      toast.error(err.message || '다듬기에 실패했습니다.');
    } finally {
      setIsRefining(false);
    }
  }, [currentText]);

  const handleApplyRefine = useCallback(() => {
    if (!refinedText) return;
    setCurrentText(refinedText);
    onTextChange(elementId, refinedText);
    setRefinedText(null);
    toast.success('다듬어진 문장이 적용되었습니다.');
  }, [refinedText, elementId, onTextChange]);

  const unappliedCount = changes.filter((_, i) => !appliedState[i]).length;

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
          changes.map((change, i) => {
            const state = appliedState[i];
            return (
              <div
                key={i}
                className={`rounded-md border transition-colors ${
                  state === 'applied'
                    ? 'bg-primary/5 border-primary/20 opacity-70'
                    : state === 'not-found'
                    ? 'bg-muted/50 border-muted opacity-60'
                    : 'bg-background border-border'
                }`}
                style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}
              >
                <div className="flex items-start gap-2 flex-wrap">
                  <span className="line-through text-destructive/70 font-medium" style={{ fontSize: 13 }}>{change.original}</span>
                  <ArrowRight className="w-3 h-3 mt-0.5 text-muted-foreground shrink-0" />
                  <span className="text-primary font-medium" style={{ fontSize: 13 }}>{change.corrected}</span>
                </div>
                <p className="text-muted-foreground" style={{ fontSize: 12, lineHeight: 1.5 }}>{change.reason}</p>
                <div className="flex justify-end">
                  {state === 'applied' ? (
                    <span className="flex items-center gap-1 text-primary font-medium" style={{ fontSize: 12 }}>
                      <Check className="w-3 h-3" />
                      적용됨
                    </span>
                  ) : state === 'not-found' ? (
                    <span className="text-muted-foreground" style={{ fontSize: 12 }}>원문 없음</span>
                  ) : (
                    <button
                      className="inline-flex items-center justify-center rounded-md font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                      style={{ fontSize: 12, height: 28, padding: '0 10px' }}
                      onClick={() => handleApplyItem(i, change)}
                    >
                      이 항목 적용
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Refine result */}
        {refinedText && (
          <div className="rounded-md border border-primary/30 bg-primary/5" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 text-primary" />
              <span className="font-semibold text-foreground" style={{ fontSize: 13 }}>다듬어진 문장</span>
            </div>
            <textarea
              className="w-full text-foreground whitespace-pre-wrap bg-background border border-border rounded-md p-2 resize-none outline-none focus:border-primary/50 transition-colors"
              style={{ fontSize: 13, lineHeight: 1.5 }}
              rows={3}
              value={refinedText}
              onChange={e => setRefinedText(e.target.value)}
            />
            <p className="text-muted-foreground" style={{ fontSize: 11 }}>직접 수정한 후 적용할 수 있습니다</p>
            <div className="flex justify-end">
              <button
                className="inline-flex items-center justify-center rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                style={{ fontSize: 12, height: 28, padding: '0 10px' }}
                onClick={handleApplyRefine}
              >
                적용하기
              </button>
            </div>
          </div>
        )}

        {/* Refining loader */}
        {isRefining && (
          <div className="flex items-center justify-center gap-2 py-3 text-muted-foreground" style={{ fontSize: 13 }}>
            <Loader2 className="w-4 h-4 animate-spin" />
            문장을 다듬고 있습니다...
          </div>
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
              className="inline-flex items-center justify-center gap-[4px] rounded-md font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
              style={{ fontSize: 12, height: 28, padding: '0 10px' }}
              onClick={() => runCorrection()}
              disabled={isRefining}
            >
              <Sparkles className="w-3 h-3" />
              다시 첨삭
            </button>
            <button
              className="inline-flex items-center justify-center gap-[4px] rounded-md font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
              style={{ fontSize: 12, height: 28, padding: '0 10px' }}
              onClick={handleRefine}
              disabled={isRefining}
            >
              <RefreshCw className={`w-3 h-3 ${isRefining ? 'animate-spin' : ''}`} />
              다시 다듬기
            </button>
            {unappliedCount > 0 && (
              <button
                className="inline-flex items-center justify-center rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                style={{ fontSize: 12, height: 28, padding: '0 10px' }}
                onClick={handleApplyAll}
              >
                전체 적용 ({unappliedCount})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
