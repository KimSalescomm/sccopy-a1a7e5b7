import React, { useState, useCallback } from 'react';
import { Sparkles, Loader2, X, Check, ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

  const runCorrection = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await correctText(text);
      setChanges(result.changes);
      setCurrentText(text);
    } catch (err: any) {
      toast.error(err.message || '첨삭에 실패했습니다.');
      onClose();
    } finally {
      setIsLoading(false);
    }
  }, [text, onClose]);

  React.useEffect(() => {
    runCorrection();
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
      style={{ top: '100%', marginTop: 8, minWidth: 320, maxWidth: 480 }}
      onMouseDown={e => e.stopPropagation()}
      onClick={e => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">AI 첨삭 제안</span>
        </div>
        <button
          className="p-1 rounded hover:bg-muted transition-colors"
          onClick={onClose}
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="px-4 pt-2 pb-1">
        <p className="text-xs text-muted-foreground">고객언어 기준으로 수정이 필요한 항목을 제안합니다</p>
      </div>

      {/* Content */}
      <div className="px-4 py-3 max-h-[300px] overflow-y-auto space-y-2.5">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            AI가 첨삭 중입니다...
          </div>
        ) : changes.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            수정할 항목이 없습니다. 유지 권장합니다.
          </div>
        ) : (
          changes.map((change, i) => {
            const state = appliedState[i];
            return (
              <div
                key={i}
                className={`rounded-md border p-3 space-y-2 text-sm transition-colors ${
                  state === 'applied'
                    ? 'bg-primary/5 border-primary/20 opacity-70'
                    : state === 'not-found'
                    ? 'bg-muted/50 border-muted opacity-60'
                    : 'bg-background border-border'
                }`}
              >
                <div className="flex items-start gap-2 flex-wrap">
                  <span className="line-through text-destructive/70 text-xs">{change.original}</span>
                  <ArrowRight className="w-3 h-3 mt-0.5 text-muted-foreground shrink-0" />
                  <span className="text-primary font-medium text-xs">{change.corrected}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{change.reason}</p>
                <div className="flex justify-end">
                  {state === 'applied' ? (
                    <span className="flex items-center gap-1 text-[11px] text-primary font-medium">
                      <Check className="w-3 h-3" />
                      적용됨
                    </span>
                  ) : state === 'not-found' ? (
                    <span className="text-[11px] text-muted-foreground">원문 없음</span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[11px] px-2.5"
                      onClick={() => handleApplyItem(i, change)}
                    >
                      이 항목 적용
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Refine result */}
        {refinedText && (
          <div className="rounded-md border border-primary/30 bg-primary/5 p-3 space-y-2">
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 text-primary" />
              <span className="text-xs font-semibold text-foreground">다듬어진 문장</span>
            </div>
            <textarea
              className="w-full text-xs text-foreground leading-relaxed whitespace-pre-wrap bg-background border border-border rounded-md p-2 resize-none outline-none focus:border-primary/50 transition-colors"
              rows={3}
              value={refinedText}
              onChange={e => setRefinedText(e.target.value)}
            />
            <p className="text-[10px] text-muted-foreground">직접 수정한 후 적용할 수 있습니다</p>
            <div className="flex justify-end">
              <Button
                size="sm"
                className="h-7 text-[11px] px-2.5"
                onClick={handleApplyRefine}
              >
                적용하기
              </Button>
            </div>
          </div>
        )}

        {/* Refining loader */}
        {isRefining && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            문장을 다듬고 있습니다...
          </div>
        )}
      </div>

      {/* Footer */}
      {!isLoading && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onClose}>
            닫기
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs"
              onClick={handleRefine}
              disabled={isRefining}
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${isRefining ? 'animate-spin' : ''}`} />
              다시 다듬기
            </Button>
            {unappliedCount > 0 && (
              <Button size="sm" className="h-8 text-xs" onClick={handleApplyAll}>
                <Sparkles className="w-3 h-3 mr-1" />
                전체 적용 ({unappliedCount})
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
