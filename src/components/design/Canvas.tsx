import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import type { Page, DesignElement, CanvasPreset } from '@/types/design';
import { DesignElementRenderer } from './DesignElementRenderer';
import { AlignmentGuidesOverlay, computeSnap, computeSpacingLabels, type GuideLine } from './AlignmentGuides';

export interface CanvasHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  fitToScreen: () => void;
  getScale: () => number;
  getCanvasElement: () => HTMLElement | null;
}

interface CanvasProps {
  page: Page;
  selectedIds: string[];
  editingId: string | null;
  canvasPreset: CanvasPreset;
  onSelectElement: (id: string | null, additive?: boolean) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onMoveSelected: (dx: number, dy: number) => void;
  onDoubleClickElement: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  onFinishEditing: () => void;
  onScaleChange?: (scale: number) => void;
  activeEditRef?: React.MutableRefObject<HTMLElement | null>;
  onMarqueeSelect?: (ids: string[], additive: boolean) => void;
}

interface MarqueeState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  active: boolean;
  additive: boolean;
}

export const Canvas = forwardRef<CanvasHandle, CanvasProps>(function Canvas({
  page, selectedIds, editingId, canvasPreset,
  onSelectElement, onUpdateElement, onMoveSelected, onDoubleClickElement,
  onTextChange, onFinishEditing, onScaleChange, activeEditRef, onMarqueeSelect,
}, ref) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [isManualZoom, setIsManualZoom] = useState(false);
  const [guides, setGuides] = useState<GuideLine[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [marquee, setMarquee] = useState<MarqueeState | null>(null);

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
    getCanvasElement() {
      return containerRef.current?.querySelector('[data-canvas-content]') as HTMLElement | null;
    },
  }), [getFitScale, scale, onScaleChange]);

  // Handle paste for image elements
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (selectedIds.length !== 1) return;
    const selectedEl = page.elements.find(el => el.id === selectedIds[0]);
    if (!selectedEl || selectedEl.type !== 'image') return;

    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          const url = URL.createObjectURL(file);
          onUpdateElement(selectedIds[0], { imageUrl: url });
        }
        return;
      }
    }
  }, [selectedIds, page.elements, onUpdateElement]);

  // Drag handler with snap
  const handleElementDrag = useCallback((elementId: string, newX: number, newY: number) => {
    const el = page.elements.find(e => e.id === elementId);
    if (!el) return;

    // Only compute snap guides during actual drag (isDragging is set by onDragStart)
    if (!isDragging) {
      // Not yet dragging, just update position
      if (selectedIds.length > 1 && selectedIds.includes(elementId)) {
        const dx = newX - el.position.x;
        const dy = newY - el.position.y;
        onMoveSelected(dx, dy);
      } else {
        onUpdateElement(elementId, { position: { x: Math.round(newX), y: Math.round(newY) } });
      }
      return;
    }

    const snap = computeSnap(
      selectedIds,
      page.elements,
      newX, newY,
      el.size.width, el.size.height,
      canvasPreset.width, canvasPreset.height,
    );

    const finalX = snap.x ?? newX;
    const finalY = snap.y ?? newY;
    setGuides(snap.guides);

    if (selectedIds.length > 1 && selectedIds.includes(elementId)) {
      const dx = finalX - el.position.x;
      const dy = finalY - el.position.y;
      onMoveSelected(dx, dy);
    } else {
      onUpdateElement(elementId, { position: { x: Math.round(finalX), y: Math.round(finalY) } });
    }
  }, [selectedIds, page.elements, canvasPreset, onUpdateElement, onMoveSelected, isDragging]);

  const handleDragEnd = useCallback(() => {
    setGuides([]);
    setIsDragging(false);
  }, []);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  // Marquee selection
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start marquee on canvas background (not on elements)
    if (e.target !== e.currentTarget) return;
    if (!canvasContentRef.current) return;

    const rect = canvasContentRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    const additive = e.shiftKey;

    if (!additive) {
      onSelectElement(null);
      onFinishEditing();
    }

    setMarquee({ startX: x, startY: y, currentX: x, currentY: y, active: true, additive });

    const handleMouseMove = (ev: MouseEvent) => {
      const cx = (ev.clientX - rect.left) / scale;
      const cy = (ev.clientY - rect.top) / scale;
      setMarquee(prev => prev ? { ...prev, currentX: cx, currentY: cy } : null);
    };

    const handleMouseUp = (ev: MouseEvent) => {
      const cx = (ev.clientX - rect.left) / scale;
      const cy = (ev.clientY - rect.top) / scale;

      // Compute selection rect
      const selX1 = Math.min(x, cx);
      const selY1 = Math.min(y, cy);
      const selX2 = Math.max(x, cx);
      const selY2 = Math.max(y, cy);

      // Only select if dragged more than 5px
      if (selX2 - selX1 > 5 || selY2 - selY1 > 5) {
        const hitIds = page.elements
          .filter(el => {
            const elX1 = el.position.x;
            const elY1 = el.position.y;
            const elX2 = el.position.x + el.size.width;
            const elY2 = el.position.y + el.size.height;
            return elX1 < selX2 && elX2 > selX1 && elY1 < selY2 && elY2 > selY1;
          })
          .map(el => el.id);

        if (hitIds.length > 0) {
          onMarqueeSelect?.(hitIds, additive);
        }
      }

      setMarquee(null);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [scale, page.elements, onSelectElement, onFinishEditing, onMarqueeSelect]);

  const spacingLabels = isDragging
    ? computeSpacingLabels(selectedIds, page.elements, canvasPreset.width, canvasPreset.height)
    : [];

  const bgStyle: React.CSSProperties = page.background.type === 'gradient'
    ? {
        background: `linear-gradient(${page.background.gradientDirection ?? 180}deg, ${page.background.gradientFrom ?? '#fff'}, ${page.background.gradientTo ?? '#eee'})`,
      }
    : { backgroundColor: page.background.color };

  // Compute marquee rect for overlay
  const marqueeRect = marquee && marquee.active ? {
    left: Math.min(marquee.startX, marquee.currentX),
    top: Math.min(marquee.startY, marquee.currentY),
    width: Math.abs(marquee.currentX - marquee.startX),
    height: Math.abs(marquee.currentY - marquee.startY),
  } : null;

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto bg-muted/30 relative"
      onClick={() => { onSelectElement(null); onFinishEditing(); }}
      onPaste={handlePaste}
    >
      <div className="min-w-max min-h-full flex items-center justify-center p-6">
        <div
          ref={canvasContentRef}
          data-canvas-content
          className="relative shadow-2xl flex-shrink-0"
          style={{
            width: canvasPreset.width,
            height: canvasPreset.height,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            ...bgStyle,
          }}
          onClick={e => e.stopPropagation()}
          onMouseDown={handleCanvasMouseDown}
        >
          {page.elements.map(el => (
            <DesignElementRenderer
              key={el.id}
              element={el}
              selected={selectedIds.includes(el.id)}
              scale={scale}
              onSelect={(id) => {
                const lastEvent = window.event as KeyboardEvent | MouseEvent | null;
                const additive = lastEvent && 'shiftKey' in lastEvent ? lastEvent.shiftKey : false;
                onSelectElement(id, additive);
              }}
              onUpdate={onUpdateElement}
              onDoubleClick={onDoubleClickElement}
              editingId={editingId}
              onTextChange={onTextChange}
              onFinishEditing={onFinishEditing}
              activeEditRef={activeEditRef}
              onDragMove={handleElementDrag}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
            />
          ))}

          {/* Marquee selection overlay */}
          {marqueeRect && marqueeRect.width > 2 && marqueeRect.height > 2 && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: marqueeRect.left,
                top: marqueeRect.top,
                width: marqueeRect.width,
                height: marqueeRect.height,
                border: '1px dashed hsl(230, 65%, 55%)',
                backgroundColor: 'hsla(230, 65%, 55%, 0.08)',
                zIndex: 9999,
              }}
            />
          )}

          <AlignmentGuidesOverlay
            guides={guides}
            spacingLabels={spacingLabels}
            canvasWidth={canvasPreset.width}
            canvasHeight={canvasPreset.height}
          />
        </div>
      </div>
    </div>
  );
});
