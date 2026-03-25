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

            {/* 첨삭 버튼 */}
            <div className="absolute right-0 flex items-center gap-1 z-50" style={{ top: -36 }}>
              {analysisErrors.length > 0 && (
                <button
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shadow-md transition-all ${
                    showCorrections
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border text-foreground hover:bg-accent'
                  }`}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setShowCorrections(!showCorrections)}
                >
                  <Wand2 className="w-3 h-3" />
                  첨삭 ({analysisErrors.length})
                </button>
              )}
            </div>

            {/* 대체어 버튼들 - 텍스트 위에 표시 */}
            {showCorrections && analysisErrors.length > 0 && (
              <div
                className="absolute left-0 right-0 flex flex-wrap gap-1.5 z-50 p-2 rounded-lg bg-card/95 backdrop-blur-sm border shadow-xl overflow-y-auto"
                style={{ bottom: '100%', marginBottom: 4, maxHeight: 200 }}
                onMouseDown={e => e.preventDefault()}
              >
                {analysisErrors.map((err, i) => (
                  <div key={i} className="flex items-center gap-1 flex-wrap">
                    <span
                      className="inline-flex items-center px-2 py-1 rounded text-xs line-through opacity-60"
                      style={{ backgroundColor: err.severity === 'error' ? 'hsl(var(--destructive) / 0.15)' : 'hsl(var(--warning) / 0.15)' }}
                    >
                      {err.original}
                    </span>
                    <span className="text-muted-foreground text-xs">→</span>
                    {err.suggestions.map((s, j) => (
                      <button
                        key={j}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors border border-primary/20"
                        onClick={() => {
                          if (element.text) {
                            onTextChange(element.id, element.text.replace(err.original, s));
                          }
                        }}
                      >
                        {s}
                      </button>
                    ))}
                    {i < analysisErrors.length - 1 && <div className="w-px h-4 bg-border mx-1" />}
                  </div>
                ))}
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
