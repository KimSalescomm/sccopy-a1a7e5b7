import React, { useRef, useCallback, useState, useEffect } from 'react';
import type { DesignElement, Position, Size } from '@/types/design';
import { getElementImageSrc } from '@/types/design';
import { Sparkles, Clipboard, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { AICorrectionPanel } from './AICorrectionPanel';
import { CopyTypeFlow } from './CopyTypeFlow';

const DRAG_THRESHOLD = 6; // px before drag starts
const BORDER_HIT_AREA = 10; // px from edge for border-drag on text

interface DesignElementRendererProps {
  element: DesignElement;
  selected: boolean;
  scale: number;
  isExporting?: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<DesignElement>) => void;
  onDoubleClick: (id: string) => void;
  editingId: string | null;
  onTextChange: (id: string, text: string) => void;
  onFinishEditing: () => void;
  activeEditRef?: React.MutableRefObject<HTMLElement | null>;
  activeTextRangeRef?: React.MutableRefObject<Range | null>;
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

function escapeTextToHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

export function DesignElementRenderer({
  element, selected, scale, isExporting = false, onSelect, onUpdate,
  onDoubleClick, editingId, onTextChange, onFinishEditing, activeEditRef,
  activeTextRangeRef, onDragMove, onDragEnd, onDragStart,
}: DesignElementRendererProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number; started: boolean } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; origW: number; origH: number; handle: string } | null>(null);
  const isEditing = editingId === element.id;
  const isTextEditable = element.type === 'text' && !isExporting && !element.locked;
  const [showCorrectionPanel, setShowCorrectionPanel] = useState(false);
  const [showCopyTypeFlow, setShowCopyTypeFlow] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [textOverflow, setTextOverflow] = useState(false);

  const isPlaceholder = isPlaceholderText(element);

  useEffect(() => {
    if (!selected) {
      setShowCorrectionPanel(false);
      setShowCopyTypeFlow(false);
    }
  }, [selected]);

  const saveTextSelectionRange = useCallback(() => {
    const editEl = editableRef.current;
    if (!editEl || !activeTextRangeRef) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    if (!editEl.contains(range.startContainer) || !editEl.contains(range.endContainer)) return;
    activeEditRef && (activeEditRef.current = editEl);
    activeTextRangeRef.current = range.cloneRange();
  }, [activeEditRef, activeTextRangeRef]);

  // Keep the real contenteditable DOM in sync while it is not focused.
  useEffect(() => {
    if (element.type !== 'text' || !editableRef.current) return;
    if (document.activeElement === editableRef.current) return;

    const nextHtml = isPlaceholder
      ? ''
      : (element.textHtml && element.textHtml.length > 0)
        ? element.textHtml
        : escapeTextToHtml(element.text ?? '');

    if (editableRef.current.innerHTML !== nextHtml) {
      editableRef.current.innerHTML = nextHtml;
    }
  }, [element.type, element.text, element.textHtml, isPlaceholder]);

  // Double-click keeps the old "edit all/select all" behavior.
  useEffect(() => {
    if (!isEditing || !editableRef.current) return;
    if (isPlaceholder) {
      editableRef.current.innerHTML = '';
    } else if (element.textHtml && element.textHtml.length > 0) {
      editableRef.current.innerHTML = element.textHtml;
    } else {
      editableRef.current.innerHTML = escapeTextToHtml(element.text ?? '');
    }

    editableRef.current.focus();
    const sel = window.getSelection();
    if (sel) {
      sel.selectAllChildren(editableRef.current);
      if (editableRef.current.innerText) {
        // keep selection (user can type to replace)
      } else {
        sel.collapseToEnd();
      }
    }
  }, [isEditing]);

  // Keep contentEditable in sync when text changes externally (e.g. AI correction apply)
  useEffect(() => {
    if (!isEditing || !editableRef.current) return;
    if (isPlaceholder) return;

    const text = element.text ?? '';
    // If external plain text differs from current contentEditable plain text,
    // overwrite (AI correction case). This intentionally drops partial formatting
    // when the underlying text has been replaced.
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

  // Detect text overflow (content taller than the box) so we can highlight it during resize
  useEffect(() => {
    if (element.type !== 'text') {
      if (textOverflow) setTextOverflow(false);
      return;
    }
    const node = elRef.current;
    if (!node) return;
    // Find the inner text container (the first child div in renderContent)
    const inner = node.firstElementChild as HTMLElement | null;
    if (!inner) return;
    const overflow = inner.scrollHeight > element.size.height + 1 || inner.scrollWidth > element.size.width + 1;
    if (overflow !== textOverflow) setTextOverflow(overflow);
  }, [element.type, element.text, element.textHtml, element.size.width, element.size.height, element.textStyle, isEditing, textOverflow]);

  // Clipboard-only image paste (보안 환경: 파일 업로드 불가)
  const handleClipboardPaste = useCallback(async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find(t => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const prevUrl = getElementImageSrc(element);
          // base64 data URL로 저장 → 새로고침/복원 시에도 유지됨
          const dataUrl: string = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
          });
          console.log('[ImagePersistence] clipboard-button/update imageData prefix', dataUrl.slice(0, 30), 'length', dataUrl.length);
          onUpdate(element.id, { imageData: dataUrl, imageUrl: dataUrl });
          if (prevUrl && prevUrl.startsWith('blob:')) {
            setTimeout(() => URL.revokeObjectURL(prevUrl), 500);
          }
          return;
        }
      }
      toast('클립보드에 이미지가 없습니다. 이미지를 먼저 복사해 주세요.');
    } catch {
      toast('Ctrl+V 로 이미지를 붙여넣어 주세요.');
    }
  }, [element.id, element.imageData, element.imageUrl, onUpdate]);

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
    setIsResizing(true);
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
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [element, scale, onUpdate]);

  const handleInput = useCallback(() => {
    if (!editableRef.current) return;
    const text = editableRef.current.innerText;
    const html = editableRef.current.innerHTML;
    // If the rendered HTML is just plain text (no inline formatting), don't bother storing textHtml
    const hasRichFormatting = /<(span|b|strong|i|em|u|mark|font)\b/i.test(html);

    // Auto-expand: measure natural content height
    const el = editableRef.current;
    const prevH = el.style.height;
    el.style.height = 'auto';
    const naturalHeight = Math.max(24, el.scrollHeight);
    el.style.height = prevH;

    const updates: Partial<DesignElement> = {
      text,
      textHtml: hasRichFormatting ? html : undefined,
    };
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

      if (!isPlaceholder && element.textHtml && element.textHtml.length > 0) {
        return (
          <div
            style={style}
            className="pointer-events-none select-none"
            dangerouslySetInnerHTML={{ __html: element.textHtml }}
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
      const imageSrc = getElementImageSrc(element);
      if (imageSrc) {
        if (imageSrc.startsWith('data:image/')) {
          console.log('[ImagePersistence] render/img-src prefix', imageSrc.slice(0, 30), 'length', imageSrc.length);
        }
        return (
          <div className="w-full h-full" style={{ borderRadius: 16, overflow: 'hidden' }}>
            <img
              src={imageSrc}
              alt=""
              className="w-full h-full pointer-events-none select-none"
              style={{ objectFit: element.objectFit ?? 'contain' }}
              draggable={false}
            />
          </div>
        );
      }

      // Clipboard-only Upload Zone
      return (
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-3"
          style={{
            background: '#F9FAFB',
            border: '2px dashed #D1D5DB',
            borderRadius: 16,
          }}
        >
          <Clipboard style={{ width: 32, height: 32, color: '#9CA3AF' }} />
          <span style={{ color: '#6B7280', fontSize: 13, textAlign: 'center', lineHeight: 1.6, padding: '0 20px' }}>
            이미지를 복사한 후<br />
            <strong>Ctrl+V</strong> 또는 아래 버튼으로 붙여넣으세요
          </span>
          <button
            style={{
              fontSize: 13, padding: '7px 18px', borderRadius: 6,
              border: '1px solid #D1D5DB', background: '#fff', color: '#374151',
              cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseDown={e => { e.stopPropagation(); e.preventDefault(); }}
            onClick={(e) => { e.stopPropagation(); void handleClipboardPaste(); }}
          >
            <Clipboard style={{ width: 14, height: 14 }} />
            클립보드에서 붙여넣기
          </button>
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
    if (isExporting) return 'default';
    if (element.locked) return 'default';
    if (isEditing) return 'text';
    if (element.type === 'text') return 'default';
    return 'move';
  };

  return (
    <div
      ref={elRef}
      className="absolute group"
      data-design-element-id={element.id}
      data-design-element-type={element.type}
      data-pin-to-bottom={element.pinToBottom ? 'true' : undefined}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        cursor: getCursor(),
        // Overflowing text gets a red dashed outline so the user can see it doesn't fit
        outline: selected && !isExporting
          ? '2px solid hsl(230, 65%, 55%)'
          : (textOverflow && !isExporting ? '1px dashed hsl(0, 80%, 55%)' : 'none'),
        outlineOffset: 1,
        // Layering: text is always above shapes, images sit between, selected goes on top.
        // Resizing a shape temporarily drops its z-index further so any text remains visible.
        zIndex: selected && !isExporting
          ? 100
          : element.type === 'text'
            ? 30
            : element.type === 'image'
              ? 20
              : (isResizing ? 5 : 10),
        // Slight transparency on the shape itself while resizing so the user can see
        // any text/content behind/inside the box outline.
        opacity: isResizing && element.type === 'shape' ? 0.6 : 1,
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

      {/* Lock indicator on hover for locked elements */}
      {!isExporting && element.locked && (
        <div
          data-editing-ui
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ zIndex: 40 }}
        >
          <div
            className="absolute flex items-center gap-1.5 px-2 py-1 rounded-md shadow-md bg-foreground/85 text-background"
            style={{ top: 6, right: 6, fontSize: 11, fontWeight: 500 }}
          >
            <Lock className="w-3 h-3" />
            <span>잠김</span>
          </div>
        </div>
      )}

      {/* AI buttons */}
      {!isExporting && showAIButton && (
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
      {!isExporting && selected && !element.locked && !isEditing && handles.map(h => (
        <div
          key={h}
          data-editing-ui
          className="absolute w-2 h-2 bg-primary rounded-sm border border-primary-foreground shadow-sm"
          style={{ ...handlePositions[h], cursor: handleCursors[h] }}
          onMouseDown={e => handleResizeMouseDown(e, h)}
        />
      ))}

      {/* Inline AI Correction Panel */}
      {!isExporting && showCorrectionPanel && element.text && (
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
      {!isExporting && showCopyTypeFlow && element.text && (
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
