import React, { useCallback } from 'react';
import type { DesignElement } from '@/types/design';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlignLeft, AlignCenter, AlignRight, Trash2, Lock, Unlock, Bold, Underline, Highlighter } from 'lucide-react';

interface PropertiesPanelProps {
  element: DesignElement | null;
  onUpdate: (id: string, updates: Partial<DesignElement>) => void;
  onDelete: (id: string) => void;
  bgColor: string;
  bgType: 'solid' | 'gradient';
  bgGradientFrom?: string;
  bgGradientTo?: string;
  bgGradientDir?: number;
  onBgChange: (bg: any) => void;
  activeEditRef?: React.MutableRefObject<HTMLElement | null>;
  activeTextRangeRef?: React.MutableRefObject<Range | null>;
}

export function PropertiesPanel({
  element, onUpdate, onDelete,
  bgColor, bgType, bgGradientFrom, bgGradientTo, bgGradientDir, onBgChange,
  activeEditRef, activeTextRangeRef,
}: PropertiesPanelProps) {

  const getEditableSelectionRange = useCallback(() => {
    const editEl = activeEditRef?.current;
    if (!editEl) return null;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
      const range = sel.getRangeAt(0);
      if (editEl.contains(range.startContainer) && editEl.contains(range.endContainer)) {
        activeTextRangeRef && (activeTextRangeRef.current = range.cloneRange());
        return range.cloneRange();
      }
    }
    const savedRange = activeTextRangeRef?.current;
    if (savedRange && editEl.contains(savedRange.startContainer) && editEl.contains(savedRange.endContainer)) {
      return savedRange.cloneRange();
    }
    return null;
  }, [activeEditRef, activeTextRangeRef]);

  const dispatchInputEvent = useCallback(() => {
    const editEl = activeEditRef?.current;
    if (editEl) {
      editEl.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, [activeEditRef]);

  const applySpanToSelection = useCallback((styles: React.CSSProperties) => {
    const editEl = activeEditRef?.current;
    const range = getEditableSelectionRange();
    if (!editEl || !range) return false;

    editEl.focus({ preventScroll: true });
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);

    const span = document.createElement('span');
    Object.assign(span.style, styles);
    const contents = range.extractContents();
    span.appendChild(contents);
    range.insertNode(span);

    const after = document.createRange();
    after.setStartAfter(span);
    after.collapse(true);
    sel?.removeAllRanges();
    sel?.addRange(after);
    activeTextRangeRef && (activeTextRangeRef.current = null);
    dispatchInputEvent();
    return true;
  }, [activeEditRef, activeTextRangeRef, dispatchInputEvent, getEditableSelectionRange]);

  const handleColorChange = useCallback((color: string) => {
    if (!element) return;

    if (applySpanToSelection({ color })) {
      return;
    }

    // Otherwise, change the whole element's text color
    onUpdate(element.id, { textStyle: { ...element.textStyle!, color } });
  }, [element, onUpdate, applySpanToSelection]);

  const applyInlineStyle = useCallback((command: 'bold' | 'underline' | 'highlight') => {
    if (command === 'bold') {
      applySpanToSelection({ fontWeight: '700' });
    } else if (command === 'underline') {
      applySpanToSelection({ textDecoration: 'underline' });
    } else if (command === 'highlight') {
      applySpanToSelection({ backgroundColor: '#FEF08A' });
    }
  }, [applySpanToSelection]);

  if (!element) {
    return (
      <div className="w-[240px] border-l bg-card p-4 space-y-4 overflow-y-auto">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">배경</h3>
        <div className="space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">유형</Label>
            <Select value={bgType} onValueChange={v => onBgChange({ type: v })}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">단색</SelectItem>
                <SelectItem value="gradient">그라디언트</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {bgType === 'solid' ? (
            <div className="space-y-1">
              <Label className="text-xs">색상</Label>
              <div className="flex gap-2">
                <input type="color" value={bgColor} onChange={e => onBgChange({ color: e.target.value })} className="w-8 h-8 rounded cursor-pointer border" />
                <Input value={bgColor} onChange={e => onBgChange({ color: e.target.value })} className="h-8 text-xs flex-1" />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <Label className="text-xs">시작 색상</Label>
                <div className="flex gap-2">
                  <input type="color" value={bgGradientFrom ?? '#ffffff'} onChange={e => onBgChange({ gradientFrom: e.target.value })} className="w-8 h-8 rounded cursor-pointer border" />
                  <Input value={bgGradientFrom ?? '#ffffff'} onChange={e => onBgChange({ gradientFrom: e.target.value })} className="h-8 text-xs flex-1" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">끝 색상</Label>
                <div className="flex gap-2">
                  <input type="color" value={bgGradientTo ?? '#eeeeee'} onChange={e => onBgChange({ gradientTo: e.target.value })} className="w-8 h-8 rounded cursor-pointer border" />
                  <Input value={bgGradientTo ?? '#eeeeee'} onChange={e => onBgChange({ gradientTo: e.target.value })} className="h-8 text-xs flex-1" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">방향 ({bgGradientDir ?? 180}°)</Label>
                <Slider value={[bgGradientDir ?? 180]} min={0} max={360} step={15} onValueChange={([v]) => onBgChange({ gradientDirection: v })} />
              </div>
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-4">요소를 선택하면 속성을 편집할 수 있어요.</p>
      </div>
    );
  }

  return (
    <div className="w-[240px] border-l bg-card overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {element.type === 'text' ? '텍스트' : element.type === 'shape' ? '도형' : '이미지'}
          </h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onUpdate(element.id, { locked: !element.locked })}>
              {element.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(element.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Position */}
        <div className="space-y-2">
          <Label className="text-xs">위치</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-muted-foreground">X</Label>
              <Input type="number" value={element.position.x} onChange={e => onUpdate(element.id, { position: { ...element.position, x: Number(e.target.value) } })} className="h-7 text-xs" />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground">Y</Label>
              <Input type="number" value={element.position.y} onChange={e => onUpdate(element.id, { position: { ...element.position, y: Number(e.target.value) } })} className="h-7 text-xs" />
            </div>
          </div>
        </div>

        {/* Size */}
        <div className="space-y-2">
          <Label className="text-xs">크기</Label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[10px] text-muted-foreground">너비</Label>
              <Input type="number" value={element.size.width} onChange={e => onUpdate(element.id, { size: { ...element.size, width: Number(e.target.value) } })} className="h-7 text-xs" />
            </div>
            <div>
              <Label className="text-[10px] text-muted-foreground">높이</Label>
              <Input type="number" value={element.size.height} onChange={e => onUpdate(element.id, { size: { ...element.size, height: Number(e.target.value) } })} className="h-7 text-xs" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Text properties */}
        {element.type === 'text' && element.textStyle && (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">글꼴 크기</Label>
              <Input type="number" value={element.textStyle.fontSize} onChange={e => onUpdate(element.id, { textStyle: { ...element.textStyle!, fontSize: Number(e.target.value) } })} className="h-7 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">굵기</Label>
              <Select value={String(element.textStyle.fontWeight)} onValueChange={v => onUpdate(element.id, { textStyle: { ...element.textStyle!, fontWeight: Number(v) } })}>
                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Light</SelectItem>
                  <SelectItem value="400">Regular</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Semibold</SelectItem>
                  <SelectItem value="700">Bold</SelectItem>
                  <SelectItem value="800">Extra Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">색상</Label>
              <p className="text-[10px] text-muted-foreground">텍스트를 드래그하면 선택 영역만 변경됩니다</p>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={element.textStyle.color}
                  onChange={e => handleColorChange(e.target.value)}
                  onMouseDown={e => e.stopPropagation()}
                  className="w-8 h-7 rounded cursor-pointer border"
                />
                <Input
                  value={element.textStyle.color}
                  onChange={e => handleColorChange(e.target.value)}
                  onMouseDown={e => e.stopPropagation()}
                  className="h-7 text-xs flex-1"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">부분 서식</Label>
              <p className="text-[10px] text-muted-foreground">텍스트를 드래그한 뒤 클릭하세요</p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  title="굵게 (선택 영역)"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => applyInlineStyle('bold')}
                >
                  <Bold className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  title="밑줄 (선택 영역)"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => applyInlineStyle('underline')}
                >
                  <Underline className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  title="형광펜 (선택 영역)"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => applyInlineStyle('highlight')}
                >
                  <Highlighter className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">정렬</Label>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map(align => (
                  <Button
                    key={align}
                    variant={element.textStyle!.textAlign === align ? 'default' : 'outline'}
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onUpdate(element.id, { textStyle: { ...element.textStyle!, textAlign: align } })}
                  >
                    {align === 'left' ? <AlignLeft className="w-3 h-3" /> : align === 'center' ? <AlignCenter className="w-3 h-3" /> : <AlignRight className="w-3 h-3" />}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">줄 높이</Label>
              <Slider value={[element.textStyle.lineHeight]} min={1} max={3} step={0.1} onValueChange={([v]) => onUpdate(element.id, { textStyle: { ...element.textStyle!, lineHeight: v } })} />
            </div>
          </div>
        )}

        {/* Shape properties */}
        {element.type === 'shape' && element.shapeStyle && (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">채우기 색상</Label>
              <div className="flex gap-2">
                <input type="color" value={element.shapeStyle.fill} onChange={e => onUpdate(element.id, { shapeStyle: { ...element.shapeStyle!, fill: e.target.value } })} className="w-8 h-7 rounded cursor-pointer border" />
                <Input value={element.shapeStyle.fill} onChange={e => onUpdate(element.id, { shapeStyle: { ...element.shapeStyle!, fill: e.target.value } })} className="h-7 text-xs flex-1" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">모서리 반경</Label>
              <Slider value={[element.shapeStyle.borderRadius]} min={0} max={100} step={1} onValueChange={([v]) => onUpdate(element.id, { shapeStyle: { ...element.shapeStyle!, borderRadius: v } })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">투명도</Label>
              <Slider value={[element.shapeStyle.opacity]} min={0} max={1} step={0.05} onValueChange={([v]) => onUpdate(element.id, { shapeStyle: { ...element.shapeStyle!, opacity: v } })} />
            </div>
          </div>
        )}

        {/* Image properties */}
        {element.type === 'image' && (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">맞춤</Label>
              <Select value={element.objectFit ?? 'cover'} onValueChange={v => onUpdate(element.id, { objectFit: v as any })}>
                <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cover">채우기</SelectItem>
                  <SelectItem value="contain">맞추기</SelectItem>
                  <SelectItem value="fill">늘리기</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
