import React, { useRef, useCallback, useState, useEffect } from 'react';
import type { DesignElement, Position, Size } from '@/types/design';
import { Sparkles, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { AICorrectionPanel } from './AICorrectionPanel';
import { CopyTypeFlow } from './CopyTypeFlow';

const DRAG_THRESHOLD = 6; // px before drag starts
const BORDER_HIT_AREA = 10; // px from edge for border-drag on text

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
  activeEditRef?: React.MutableRefObject<HTMLElement | null>;
  onDragMove?: (id: string, x: number, y: number) => void;
  onDragEnd?: () => void;
  onDragStart?: () => void;
}

function isOnBorder(e: React.MouseEvent, el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return (
    x < BORDER_HIT_AREA ||
    y < BORDER_HIT_AREA ||
    x > rect.width - BORDER_HIT_AREA ||
    y > rect.height - BORDER_HIT_AREA
  );
}

function isPlaceholderText(element: DesignElement): boolean {
  if (!element.placeholder) return false;
  return !element.text || element.text === element.placeholder;
}

export function DesignElementRenderer({
  element, selected, scale, onSelect, onUpdate,
  onDoubleClick, editingId, onTextChange, onFinishEditing, activeEditRef,
  onDragMove, onDragEnd, onDragStart,
}: DesignElementRendererProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number; started: boolean } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number; handle: string } | null>(null);
  const isEditing = editingId === element.id;
  const [showCorrectionPanel, setShowCorrectionPanel] = useState(false);
  const [showCopyTypeFlow, setShowCopyTypeFlow] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const isPlaceholder = isPlaceholderText(element);

  useEffect(() => {
    if (!selected) {
      setShowCorrectionPanel(false);
      setShowCopyTypeFlow(false);
    }
  }, [selected]);

  // Track active editable ref
  useEffect(() => {
    if (isEditing && editableRef.current && activeEditRef) {
      activeEditRef.current = editableRef.current;
    }
    return () => {
      if (activeEditRef && activeEditRef.current === editableRef.current) {
        activeEditRef.current = null;
      }
    };
  }, [isEditing, activeEditRef]);

  // Set initial content when entering edit mode
  useEffect(() => {
    if (!isEditing || !editableRef.current) return;

    // If placeholder, show empty or select-all the placeholder text
    const text = isPlaceholder ? '' : (element.text ?? '');
    editableRef.current.innerText = text;

    editableRef.current.focus();
    const sel = window.getSelection();
    if (sel) {
      sel.selectAllChildren(editableRef.current);
      if (text) {
        // Select all so user can type to replace
      } else {
        sel.collapseToEnd();
      }
    }
  }, [isEditing]);

  // Keep contentEditable in sync when text changes externally (e.g. AI correction apply)
  useEffect(() => {
    if (!isEditing || !editableRef.current) return;

    const text = element.text ?? '';
    if (isPlaceholder) return; // don't sync placeholder back
    if (editableRef.current.innerText === text) return;

    const wasFocused = document.activeElement === editableRef.current;
    editableRef.current.innerText = text;

    if (wasFocused) {
      const sel = window.getSelection();
      if (sel) {
        sel.selectAllChildren(editableRef.current);
        sel.collapseToEnd();
      }
    }
  }, [isEditing, element.text]);

  const handleImageFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    onUpdate(element.id, { imageUrl: url });
  }, [element.id, onUpdate]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (element.locked) return;
    e.stopPropagation();
    onSelect(element.id);
    if (isEditing) return;

    // For text elements, only allow drag from border area
    if (element.type === 'text' && elRef.current && !isOnBorder(e, elRef.current)) {
      // Click inside text area — don't start drag, will trigger edit on double-click
      return;
    }

    dragRef.current = {
      startX: e.clientX, startY: e.clientY,
      origX: element.position.x, origY: element.position.y,
      started: false,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;

      // Check threshold before starting drag
      if (!dragRef.current.started) {
        const dist = Math.hypot(ev.clientX - dragRef.current.startX, ev.clientY - dragRef.current.startY);
        if (dist < DRAG_THRESHOLD) return;
        dragRef.current.started = true;
        onDragStart?.();
      }

      const dx = (ev.clientX - dragRef.current.startX) / scale;
      const dy = (ev.clientY - dragRef.current.startY) / scale;
      const newX = Math.round(dragRef.current.origX + dx);
      const newY = Math.round(dragRef.current.origY + dy);
      if (onDragMove) {
        onDragMove(element.id, newX, newY);
      } else {
        onUpdate(element.id, { position: { x: newX, y: newY } });
      }
    };

    const handleMouseUp = () => {
      if (dragRef.current?.started) {
        onDragEnd?.();
      }
      dragRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [element.id, element.position, element.locked, element.type, isEditing, scale, onSelect, onUpdate, onDragMove, onDragEnd, onDragStart]);

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

  const handleInput = useCallback(() => {
    if (!editableRef.current) return;
    const text = editableRef.current.innerText;

    // Auto-expand: measure natural content height
    const el = editableRef.current;
    const prevH = el.style.height;
    el.style.height = 'auto';
    const naturalHeight = Math.max(24, el.scrollHeight);
    el.style.height = prevH;

    const updates: Partial<DesignElement> = { text };
    if (Math.abs(naturalHeight - element.size.height) >= 1) {
      updates.size = { ...element.size, height: naturalHeight };
    }
    onUpdate(element.id, updates);
  }, [element.id, element.size, onUpdate]);

  // Handle finishing edit — restore placeholder if empty
  const handleFinishEditingWithPlaceholder = useCallback(() => {
    if (element.type === 'text' && element.placeholder) {
      const currentText = editableRef.current?.innerText?.trim() ?? '';
      if (!currentText) {
        // Restore placeholder
        onUpdate(element.id, { text: element.placeholder });
      }
    }
    onFinishEditing();
  }, [element.id, element.type, element.placeholder, onUpdate, onFinishEditing]);

  const renderContent = () => {
    if (element.type === 'text') {
      const style: React.CSSProperties = {
        fontSize: element.textStyle?.fontSize ?? 32,
        fontWeight: element.textStyle?.fontWeight ?? 400,
        color: isPlaceholder && !isEditing
          ? '#999999'
          : (element.textStyle?.color ?? '#000'),
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
        overflow: 'hidden',
        padding: 0,
        margin: 0,
      };

      if (isEditing) {
        return (
          <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onBlur={handleFinishEditingWithPlaceholder}
            onPaste={e => {
              e.preventDefault();
              const plain = e.clipboardData.getData('text/plain');
              const sel = window.getSelection();
              if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(plain));
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
              }
              handleInput();
            }}
            onKeyDown={e => {
              if (e.key === 'Escape') handleFinishEditingWithPlaceholder();
              e.stopPropagation();
            }}
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
      if (element.imageUrl) {
        return (
          <div className="w-full h-full" style={{ borderRadius: 16, overflow: 'hidden' }}>
            <img
              src={element.imageUrl}
              alt=""
              className="w-full h-full pointer-events-none select-none"
              style={{ objectFit: element.objectFit ?? 'contain' }}
              draggable={false}
            />
          </div>
        );
      }

      // Upload Zone UI
      return (
        <div
          className="w-full h-full flex flex-col items-center justify-center"
          style={{
            background: '#F9FAFB',
            border: `2px dashed ${isDragOver ? '#6366F1' : '#D1D5DB'}`,
            borderRadius: 16,
            transition: 'border-color 0.2s, background 0.2s',
            ...(isDragOver ? { background: '#EEF2FF' } : {}),
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleImageFile(file);
          }}
        >
          <Upload
            style={{ width: 32, height: 32, color: '#9CA3AF', marginBottom: 12 }}
          />
          <span style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', lineHeight: 1.5, padding: '0 16px', marginBottom: 12 }}>
            파일을 선택하거나,<br />이미지를 붙여넣어 추가하세요
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{
                fontSize: 12, padding: '6px 14px', borderRadius: 6,
                border: '1px solid #D1D5DB', background: '#fff', color: '#374151',
                cursor: 'pointer', fontWeight: 500,
              }}
              onMouseDown={e => { e.stopPropagation(); e.preventDefault(); }}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              파일 선택
            </button>
            <button
              style={{
                fontSize: 12, padding: '6px 14px', borderRadius: 6,
                border: '1px solid #D1D5DB', background: '#fff', color: '#374151',
                cursor: 'pointer', fontWeight: 500,
              }}
              onMouseDown={e => { e.stopPropagation(); e.preventDefault(); }}
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  const items = await navigator.clipboard.read();
                  for (const item of items) {
                    const imageType = item.types.find(t => t.startsWith('image/'));
                    if (imageType) {
                      const blob = await item.getType(imageType);
                      const url = URL.createObjectURL(blob);
                      onUpdate(element.id, { imageUrl: url });
                      return;
                    }
                  }
                  toast('클립보드에 이미지가 없습니다');
                } catch {
                  toast('클립보드 접근 권한이 필요합니다. Ctrl+V를 사용해주세요.');
                }
              }}
            >
              붙여넣기
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageFile(file);
              e.target.value = '';
            }}
          />
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

  const showAIButton = element.type === 'text' && selected && !!element.text?.trim() && !isPlaceholder && !showCorrectionPanel && !showCopyTypeFlow;

  // Cursor logic: text interior = text cursor, border = move cursor
  const getCursor = () => {
    if (element.locked) return 'default';
    if (isEditing) return 'text';
    if (element.type === 'text') return 'default';
    return 'move';
  };

  return (
    <div
      ref={elRef}
      className="absolute group"
      data-design-element-type={element.type}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        cursor: getCursor(),
        outline: selected ? '2px solid hsl(230, 65%, 55%)' : 'none',
        outlineOffset: 1,
        zIndex: selected ? 100 : 'auto',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={(e) => {
        // Dynamic cursor for text elements: move on border, text inside
        if (element.type === 'text' && !isEditing && !element.locked && elRef.current) {
          elRef.current.style.cursor = isOnBorder(e, elRef.current) ? 'move' : 'default';
        }
      }}
      onDoubleClick={() => onDoubleClick(element.id)}
    >
      {renderContent()}

      {/* AI buttons */}
      {showAIButton && (
        <div data-editing-ui className="absolute z-50 flex items-center gap-1.5" style={{ top: -36, right: 0 }}>
          <button
            className="flex items-center gap-[5px] px-[11px] rounded-md font-semibold shadow-sm transition-all border border-input bg-background text-foreground hover:bg-accent"
            style={{ fontSize: 13, height: 30 }}
            onMouseDown={e => { e.stopPropagation(); e.preventDefault(); }}
            onClick={e => { e.stopPropagation(); setShowCopyTypeFlow(true); }}
          >
            카피 분석
          </button>
          <button
            className="flex items-center gap-[5px] px-[11px] rounded-md font-semibold shadow-sm transition-all bg-primary text-primary-foreground hover:bg-primary/90"
            style={{ fontSize: 13, height: 30 }}
            onMouseDown={e => { e.stopPropagation(); e.preventDefault(); }}
            onClick={e => { e.stopPropagation(); setShowCorrectionPanel(true); }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI 첨삭
          </button>
        </div>
      )}


      {/* Resize handles */}
      {selected && !element.locked && !isEditing && handles.map(h => (
        <div
          key={h}
          data-editing-ui
          className="absolute w-2 h-2 bg-primary rounded-sm border border-primary-foreground shadow-sm"
          style={{ ...handlePositions[h], cursor: handleCursors[h] }}
          onMouseDown={e => handleResizeMouseDown(e, h)}
        />
      ))}

      {/* Inline AI Correction Panel */}
      {showCorrectionPanel && element.text && (
        <div data-editing-ui>
          <AICorrectionPanel
            text={element.text}
            elementId={element.id}
            onTextChange={onTextChange}
            onClose={() => setShowCorrectionPanel(false)}
          />
        </div>
      )}

      {/* Inline Copy Type Flow Panel */}
      {showCopyTypeFlow && element.text && (
        <div data-editing-ui>
          <CopyTypeFlow
            text={element.text}
            elementId={element.id}
            onTextChange={onTextChange}
            onClose={() => setShowCopyTypeFlow(false)}
          />
        </div>
      )}
    </div>
  );
}
