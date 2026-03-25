import React, { useRef, useCallback, useState, useEffect } from 'react';
import type { DesignElement, Position, Size } from '@/types/design';
import { analyzeText, type AnalysisError } from '@/lib/analysis-engine';
import { correctText, type CorrectionChange } from '@/lib/ai-correction';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Wand2, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

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
  const [showCorrections, setShowCorrections] = useState(false);
  const [isCorrectingAI, setIsCorrectingAI] = useState(false);
  const [aiChanges, setAiChanges] = useState<CorrectionChange[]>([]);
  const [aiCorrected, setAiCorrected] = useState<string | null>(null);

  // Analyze text for writing errors
  useEffect(() => {
    if (element.type === 'text' && element.text) {
      const result = analyzeText(element.text);
      setAnalysisErrors(result.errors);
    } else {
      setAnalysisErrors([]);
    }
  }, [element.text, element.type]);

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
      const updates: Partial<DesignElement> = {};
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

      updates.size = { width: Math.round(newSize.width), height: Math.round(newSize.height) };
      updates.position = { x: Math.round(newPos.x), y: Math.round(newPos.y) };
      onUpdate(element.id, updates);
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
          <div className="relative w-full h-full">
            <textarea
              autoFocus
              value={element.text ?? ''}
              onChange={e => { onTextChange(element.id, e.target.value); setShowCorrections(false); }}
              onKeyDown={e => { if (e.key === 'Escape') { onFinishEditing(); setShowCorrections(false); } }}
              style={style}
              className="cursor-text"
            />

            {/* AI 첨삭 버튼 */}
            <div className="absolute right-0 flex items-center gap-1 z-50" style={{ top: -36 }}>
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shadow-md transition-all ${
                  showCorrections
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border text-foreground hover:bg-accent'
                }`}
                onMouseDown={e => e.preventDefault()}
                onClick={async () => {
                  if (showCorrections) {
                    setShowCorrections(false);
                    return;
                  }
                  if (!element.text?.trim()) return;
                  setIsCorrectingAI(true);
                  setShowCorrections(true);
                  try {
                    const result = await correctText(element.text);
                    setAiCorrected(result.corrected);
                    setAiChanges(result.changes);
                  } catch (err: any) {
                    toast.error(err.message || '첨삭에 실패했습니다.');
                    setShowCorrections(false);
                  } finally {
                    setIsCorrectingAI(false);
                  }
                }}
                disabled={isCorrectingAI}
              >
                {isCorrectingAI ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                AI 첨삭
              </button>
            </div>

            {/* AI 첨삭 결과 패널 */}
            {showCorrections && (
              <div
                className="absolute left-0 right-0 z-50 rounded-lg bg-card/95 backdrop-blur-sm border shadow-xl overflow-y-auto"
                style={{ bottom: '100%', marginBottom: 4, maxHeight: 260 }}
                onMouseDown={e => e.preventDefault()}
              >
                {isCorrectingAI ? (
                  <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI가 첨삭 중...
                  </div>
                ) : aiCorrected ? (
                  <div className="p-3 space-y-3">
                    {/* 교정된 문장 전체 적용 버튼 */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground">교정된 문장</div>
                      <div className="p-2.5 rounded-md bg-primary/5 border border-primary/20 text-sm leading-relaxed">
                        {aiCorrected}
                      </div>
                      <button
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        onClick={() => {
                          onTextChange(element.id, aiCorrected);
                          setShowCorrections(false);
                          setAiCorrected(null);
                          setAiChanges([]);
                          toast.success('교정된 문장이 적용되었습니다.');
                        }}
                      >
                        <Sparkles className="w-3 h-3" />
                        전체 적용
                      </button>
                    </div>

                    {/* 변경 사항 목록 */}
                    {aiChanges.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="text-xs font-medium text-muted-foreground">변경 사항</div>
                        {aiChanges.map((change, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs p-1.5 rounded bg-muted/50">
                            <span className="line-through text-destructive/70 shrink-0">{change.original}</span>
                            <span className="text-muted-foreground shrink-0">→</span>
                            <span className="text-primary font-medium shrink-0">{change.corrected}</span>
                            <span className="text-muted-foreground ml-auto text-right">{change.reason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}
          </div>
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

  return (
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

      {/* Error indicator badge */}
      {hasErrors && (
        <div
          className="absolute flex items-center gap-1 px-1.5 py-0.5 rounded bg-warning text-warning-foreground shadow-sm"
          style={{ top: -24, right: 0, fontSize: 10 }}
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
  );
}
