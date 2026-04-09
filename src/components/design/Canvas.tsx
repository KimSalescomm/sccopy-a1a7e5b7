import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { Page, DesignElement, CanvasPreset } from '@/types/design';
import { DesignElementRenderer } from './DesignElementRenderer';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

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
    setScale(getFitScale());
  }, [getFitScale, isManualZoom]);

  useEffect(() => {
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [updateScale]);

  const handleZoomIn = useCallback(() => {
    setIsManualZoom(true);
    setScale(prev => Math.min(prev + 0.1, 2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setIsManualZoom(true);
    setScale(prev => Math.max(prev - 0.1, 0.1));
  }, []);

  const handleFitToScreen = useCallback(() => {
    setIsManualZoom(false);
    setScale(getFitScale());
  }, [getFitScale]);

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
      {/* Zoom Controls */}
      <div
        className="absolute bottom-4 right-4 z-50 flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-sm px-1 py-1"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleZoomOut}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600"
          title="축소"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-xs font-medium text-gray-600 min-w-[44px] text-center select-none">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600"
          title="확대"
        >
          <ZoomIn size={16} />
        </button>
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        <button
          onClick={handleFitToScreen}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600"
          title="화면에 맞추기"
        >
          <Maximize size={16} />
        </button>
      </div>
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
