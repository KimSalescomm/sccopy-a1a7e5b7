import React, { useRef, useCallback, useState, useEffect } from 'react';
import type { DesignElement, Position, Size } from '@/types/design';
import { analyzeText, type AnalysisError } from '@/lib/analysis-engine';
import { correctText, type CorrectionChange } from '@/lib/ai-correction';
import { AlertTriangle, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DesignElementRendererProps {
  element: DesignElement;
  selected: boolean;
  scale: number;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<DesignElement>) => void;
  onDoubleClick: (id: string) => void;
  editingId: string | null;
  onTextChange: (id: string, text: string) => void;
  onFinishEditing: () => void;
}

export function DesignElementRenderer({
  element, selected, scale, onSelect, onUpdate,
  onDoubleClick, editingId, onTextChange, onFinishEditing,
}: DesignElementRendererProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number; handle: string } | null>(null);
  const isEditing = editingId === element.id;
  const [analysisErrors, setAnalysisErrors] = useState<AnalysisError[]>([]);

  // AI correction state
  const [showModal, setShowModal] = useState(false);
  const [isCorrectingAI, setIsCorrectingAI] = useState(false);
  const [aiChanges, setAiChanges] = useState<CorrectionChange[]>([]);
  const [aiCorrected, setAiCorrected] = useState<string | null>(null);

  useEffect(() => {
    if (element.type === 'text' && element.text) {
      const result = analyzeText(element.text);
      setAnalysisErrors(result.errors);
    } else {
      setAnalysisErrors([]);
    }
  }, [element.text, element.type]);

  const handleAICorrection = useCallback(async () => {
    if (!element.text?.trim()) return;
    setShowModal(true);
    setIsCorrectingAI(true);
    setAiCorrected(null);
    setAiChanges([]);
    try {
      const result = await correctText(element.text);
      setAiCorrected(result.corrected);
      setAiChanges(result.changes);
    } catch (err: any) {
      toast.error(err.message || '첨삭에 실패했습니다.');
      setShowModal(false);
    } finally {
      setIsCorrectingAI(false);
    }
  }, [element.text]);

  const handleApply = useCallback(() => {
    if (aiCorrected) {
      onTextChange(element.id, aiCorrected);
      toast.success('교정된 문장이 적용되었습니다.');
    }
    setShowModal(false);
    setAiCorrected(null);
    setAiChanges([]);
  }, [aiCorrected, element.id, onTextChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (element.locked || isEditing) return;
    e.stopPropagation();
    onSelect(element.id);
    dragRef.current = {
      startX: e.clientX, startY: e.clientY,
      origX: element.position.x, origY: element.position.y,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = (ev.clientX - dragRef.current.startX) / scale;
      const dy = (ev.clientY - dragRef.current.startY) / scale;
      onUpdate(element.id, {
        position: {
          x: Math.round(dragRef.current.origX + dx),
          y: Math.round(dragRef.current.origY + dy),
        },
      });
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [element.id, element.position, element.locked, isEditing, scale, onSelect, onUpdate]);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    resizeRef.current = {
      startX: e.clientX, startY: e.clientY,
      origW: element.size.width, origH: element.size.height,
      handle,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!resizeRef.current) return;
      const dx = (ev.clientX - resizeRef.current.startX) / scale;
      const dy = (ev.clientY - resizeRef.current.startY) / scale;
      const newSize: Size = { ...element.size };
      const newPos: Position = { ...element.position };

      if (handle.includes('e')) newSize.width = Math.max(40, resizeRef.current.origW + dx);
      if (handle.includes('s')) newSize.height = Math.max(40, resizeRef.current.origH + dy);
      if (handle.includes('w')) {
        newSize.width = Math.max(40, resizeRef.current.origW - dx);
        newPos.x = element.position.x + dx;
      }
      if (handle.includes('n')) {
        newSize.height = Math.max(40, resizeRef.current.origH - dy);
        newPos.y = element.position.y + dy;
      }

      onUpdate(element.id, {
        size: { width: Math.round(newSize.width), height: Math.round(newSize.height) },
        position: { x: Math.round(newPos.x), y: Math.round(newPos.y) },
      });
    };

    const handleMouseUp = () => {
      resizeRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [element, scale, onUpdate]);

  const renderContent = () => {
    if (element.type === 'text') {
      const style: React.CSSProperties = {
        fontSize: element.textStyle?.fontSize ?? 32,
        fontWeight: element.textStyle?.fontWeight ?? 400,
        color: element.textStyle?.color ?? '#000',
        textAlign: element.textStyle?.textAlign ?? 'left',
        lineHeight: element.textStyle?.lineHeight ?? 1.5,
        fontFamily: element.textStyle?.fontFamily ?? 'Pretendard',
        width: '100%',
        height: '100%',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        outline: 'none',
        border: 'none',
        background: 'transparent',
        resize: 'none',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
      };

      if (isEditing) {
        return (
          <textarea
            autoFocus
            value={element.text ?? ''}
            onChange={e => onTextChange(element.id, e.target.value)}
            onKeyDown={e => { if (e.key === 'Escape') onFinishEditing(); }}
            style={style}
            className="cursor-text"
          />
        );
      }

      return (
        <div style={style} className="pointer-events-none select-none">
          {element.text}
        </div>
      );
    }

    if (element.type === 'shape') {
      const ss = element.shapeStyle;
      return (
        <div
          className="w-full h-full"
          style={{
            backgroundColor: ss?.fill ?? '#ccc',
            borderRadius: element.shapeType === 'circle' ? '50%' : (ss?.borderRadius ?? 0),
            border: ss?.borderWidth ? `${ss.borderWidth}px solid ${ss.borderColor}` : 'none',
            opacity: ss?.opacity ?? 1,
          }}
        />
      );
    }

    if (element.type === 'image') {
      return element.imageUrl ? (
        <img
          src={element.imageUrl}
          alt=""
          className="w-full h-full pointer-events-none"
          style={{ objectFit: element.objectFit ?? 'cover', borderRadius: 'inherit' }}
          draggable={false}
        />
      ) : (
        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
          이미지 없음
        </div>
      );
    }

    return null;
  };

  const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];
  const handleCursors: Record<string, string> = {
    nw: 'nwse-resize', ne: 'nesw-resize', sw: 'nesw-resize', se: 'nwse-resize',
    n: 'ns-resize', s: 'ns-resize', e: 'ew-resize', w: 'ew-resize',
  };
  const handlePositions: Record<string, React.CSSProperties> = {
    nw: { top: -4, left: -4 }, ne: { top: -4, right: -4 },
    sw: { bottom: -4, left: -4 }, se: { bottom: -4, right: -4 },
    n: { top: -4, left: '50%', transform: 'translateX(-50%)' },
    s: { bottom: -4, left: '50%', transform: 'translateX(-50%)' },
    e: { top: '50%', right: -4, transform: 'translateY(-50%)' },
    w: { top: '50%', left: -4, transform: 'translateY(-50%)' },
  };

  const hasErrors = element.type === 'text' && analysisErrors.length > 0 && !isEditing;
  const showAIButton = element.type === 'text' && selected && !!element.text?.trim();

  return (
    <>
      <div
        ref={elRef}
        className="absolute group"
        style={{
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height,
          cursor: element.locked ? 'default' : (isEditing ? 'text' : 'move'),
          outline: selected ? '2px solid hsl(230, 65%, 55%)' : (hasErrors ? '2px dashed hsl(30, 90%, 52%)' : 'none'),
          outlineOffset: 1,
          zIndex: selected ? 100 : 'auto',
        }}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onDoubleClick(element.id)}
      >
        {renderContent()}

        {/* AI 첨삭 버튼 - 선택된 텍스트 요소의 우측 상단 */}
        {showAIButton && (
          <button
            className="absolute flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium shadow-md transition-all bg-primary text-primary-foreground hover:bg-primary/90 z-50"
            style={{ top: -32, right: 0 }}
            onMouseDown={e => { e.stopPropagation(); e.preventDefault(); }}
            onClick={e => { e.stopPropagation(); handleAICorrection(); }}
          >
            <Sparkles className="w-3 h-3" />
            AI 첨삭
          </button>
        )}

        {/* Error indicator badge */}
        {hasErrors && (
          <div
            className="absolute flex items-center gap-1 px-1.5 py-0.5 rounded bg-warning text-warning-foreground shadow-sm"
            style={{ top: -24, right: showAIButton ? 80 : 0, fontSize: 10 }}
          >
            <AlertTriangle className="w-3 h-3" />
            {analysisErrors.length}
          </div>
        )}

        {/* Resize handles */}
        {selected && !element.locked && !isEditing && handles.map(h => (
          <div
            key={h}
            className="absolute w-2 h-2 bg-primary rounded-sm border border-primary-foreground shadow-sm"
            style={{ ...handlePositions[h], cursor: handleCursors[h] }}
            onMouseDown={e => handleResizeMouseDown(e, h)}
          />
        ))}
      </div>

      {/* AI 첨삭 결과 모달 */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI 첨삭 결과
            </DialogTitle>
            <DialogDescription>
              AI가 텍스트를 분석하여 수정안을 제안합니다.
            </DialogDescription>
          </DialogHeader>

          {isCorrectingAI ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              AI가 첨삭 중입니다...
            </div>
          ) : aiCorrected ? (
            <div className="space-y-4">
              {/* 수정안 */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">수정안</h4>
                <div className="p-3 rounded-md bg-primary/5 border border-primary/20 text-sm leading-relaxed whitespace-pre-wrap">
                  {aiCorrected}
                </div>
              </div>

              {/* 수정 이유 */}
              {aiChanges.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">수정 이유</h4>
                  <div className="space-y-2">
                    {aiChanges.map((change, i) => (
                      <div key={i} className="rounded-md border p-3 space-y-1.5 text-sm">
                        <div className="flex items-start gap-2 flex-wrap">
                          <span className="line-through text-destructive/70">{change.original}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-primary font-medium">{change.corrected}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{change.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              닫기
            </Button>
            {aiCorrected && (
              <Button onClick={handleApply}>
                <Sparkles className="w-3.5 h-3.5 mr-1" />
                적용하기
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
