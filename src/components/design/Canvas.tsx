import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import type { Page, DesignElement, CanvasPreset } from '@/types/design';
import { DesignElementRenderer } from './DesignElementRenderer';

export interface CanvasHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  fitToScreen: () => void;
  getScale: () => number;
}

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
  onScaleChange?: (scale: number) => void;
  activeEditRef?: React.MutableRefObject<HTMLElement | null>;
}

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(function Canvas({
  page, selectedId, editingId, canvasPreset,
  onSelectElement, onUpdateElement, onDoubleClickElement,
  onTextChange, onFinishEditing, onScaleChange, activeEditRef,
}, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [isManualZoom, setIsManualZoom] = useState(false);

  const getFitScale = useCallback(() => {
    if (!containerRef.current) return 0.5;
    const { clientWidth, clientHeight } = containerRef.current;
    const padding = 48;
    const sx = (clientWidth - padding) / canvasPreset.width;
    const sy = (clientHeight - padding) / canvasPreset.height;
    return Math.min(sx, sy, 1);
  }, [canvasPreset]);

  const updateScale = useCallback(() => {
    if (isManualZoom) return;
    const s = getFitScale();
    setScale(s);
    onScaleChange?.(s);
  }, [getFitScale, isManualZoom, onScaleChange]);

  useEffect(() => {
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updateScale]);

  useImperativeHandle(ref, () => ({
    zoomIn() {
      setIsManualZoom(true);
      setScale(prev => {
        const next = Math.min(prev + 0.1, 2);
        onScaleChange?.(next);
        return next;
      });
    },
    zoomOut() {
      setIsManualZoom(true);
      setScale(prev => {
        const next = Math.max(prev - 0.1, 0.1);
        onScaleChange?.(next);
        return next;
      });
    },
    fitToScreen() {
      setIsManualZoom(false);
      const s = getFitScale();
      setScale(s);
      onScaleChange?.(s);
    },
    getScale() {
      return scale;
    },
  }), [getFitScale, scale, onScaleChange]);

  // Handle paste for image elements
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (!selectedId) return;
    const selectedEl = page.elements.find(el => el.id === selectedId);
    if (!selectedEl || selectedEl.type !== 'image') return;

    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          const url = URL.createObjectURL(file);
          onUpdateElement(selectedId, { imageUrl: url });
        }
        return;
      }
    }
  }, [selectedId, page.elements, onUpdateElement]);

  const bgStyle: React.CSSProperties = page.background.type === 'gradient'
    ? {
        background: `linear-gradient(${page.background.gradientDirection ?? 180}deg, ${page.background.gradientFrom ?? '#fff'}, ${page.background.gradientTo ?? '#eee'})`,
      }
    : { backgroundColor: page.background.color };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto bg-muted/30 relative"
      onClick={() => { onSelectElement(null); onFinishEditing(); }}
      onPaste={handlePaste}
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
            if (e.target === e.currentTarget) { onSelectElement(null); onFinishEditing(); }
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
              activeEditRef={activeEditRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
