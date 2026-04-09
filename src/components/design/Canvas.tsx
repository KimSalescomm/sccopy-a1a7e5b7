import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { Page, DesignElement, CanvasPreset } from '@/types/design';
import { DesignElementRenderer } from './DesignElementRenderer';

interface CanvasProps {
  page: Page;
  selectedId: string | null;
  editingId: string | null;
  canvasPreset: CanvasPreset;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDoubleClickElement: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  onFinishEditing: () => void;
}

export function Canvas({
  page, selectedId, editingId, canvasPreset,
  onSelectElement, onUpdateElement, onDoubleClickElement,
  onTextChange, onFinishEditing,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const padding = 48;
    const sx = (clientWidth - padding) / canvasPreset.width;
    const sy = (clientHeight - padding) / canvasPreset.height;
    setScale(Math.min(sx, sy, 1));
  }, [canvasPreset]);

  useEffect(() => {
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updateScale]);

  const bgStyle: React.CSSProperties = page.background.type === 'gradient'
    ? {
        background: `linear-gradient(${page.background.gradientDirection ?? 180}deg, ${page.background.gradientFrom ?? '#fff'}, ${page.background.gradientTo ?? '#eee'})`,
      }
    : { backgroundColor: page.background.color };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto bg-muted/30"
      onClick={() => { onSelectElement(null); onFinishEditing(); }}
    >
      <div className="min-w-max min-h-full flex items-center justify-center p-6">
        <div
          className="relative shadow-2xl flex-shrink-0"
          style={{
            width: canvasPreset.width,
            height: canvasPreset.height,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            ...bgStyle,
          }}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => {
            if (e.target === e.currentTarget) onSelectElement(null);
          }}
        >
          {page.elements.map(el => (
            <DesignElementRenderer
              key={el.id}
              element={el}
              selected={selectedId === el.id}
              scale={scale}
              onSelect={onSelectElement}
              onUpdate={onUpdateElement}
              onDoubleClick={onDoubleClickElement}
              editingId={editingId}
              onTextChange={onTextChange}
              onFinishEditing={onFinishEditing}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
