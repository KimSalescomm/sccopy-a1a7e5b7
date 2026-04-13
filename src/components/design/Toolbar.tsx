import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Type, Square, Circle, Image, LayoutTemplate, FileText, Save, Cloud, Loader2, ZoomIn, ZoomOut, Maximize, Undo2, Redo2, AlignLeft, AlignCenter, AlignRight, AlignStartVertical, AlignCenterVertical, AlignEndVertical, GripHorizontal, GripVertical, Download } from 'lucide-react';
import type { SaveStatus } from '@/hooks/use-auto-save';
import type { AlignAction } from './AlignmentGuides';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { TEMPLATES } from '@/lib/templates';
import { TEMPLATE_CATEGORIES } from '@/types/design';
import { CANVAS_PRESETS, type CanvasPreset } from '@/types/design';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ToolbarProps {
  onAddText: () => void;
  onAddShape: (shape: 'rectangle' | 'circle') => void;
  onAddImage: () => void;
  onApplyTemplate: (templateId: string) => void;
  currentPreset: CanvasPreset;
  onChangePreset: (preset: CanvasPreset) => void;
  saveStatus: SaveStatus;
  onManualSave: () => void;
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  multiSelectCount: number;
  onAlign: (action: AlignAction) => void;
  onExportPng: () => void;
  onExportPdf: () => void;
}

export function Toolbar({
  onAddText, onAddShape, onAddImage, onApplyTemplate,
  currentPreset, onChangePreset, saveStatus, onManualSave,
  scale, onZoomIn, onZoomOut, onFitToScreen,
  canUndo, canRedo, onUndo, onRedo,
  multiSelectCount, onAlign, onExportPng, onExportPdf,
}: ToolbarProps) {
  const showAlign = multiSelectCount >= 2;

  return (
    <header className="h-12 border-b bg-card flex items-center px-3 gap-1">
      <div className="flex items-center gap-2 mr-3">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <FileText className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="text-sm font-bold text-foreground hidden sm:inline">카드뉴스 디자이너</span>
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      {/* Undo / Redo */}
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onUndo} disabled={!canUndo} title="실행 취소 (Ctrl+Z)">
        <Undo2 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onRedo} disabled={!canRedo} title="다시 실행 (Ctrl+Shift+Z)">
        <Redo2 className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs gap-1.5">
            <LayoutTemplate className="w-3.5 h-3.5" />
            템플릿
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {TEMPLATE_CATEGORIES.map(cat => {
            const catTemplates = TEMPLATES.filter(t => t.category === cat.id);
            return (
              <DropdownMenuSub key={cat.id}>
                <DropdownMenuSubTrigger className="gap-2">
                  <span>{cat.emoji}</span>
                  <span className="text-xs font-medium">{cat.label}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent className="w-52">
                    {catTemplates.map(t => (
                      <DropdownMenuItem key={t.id} onClick={() => onApplyTemplate(t.id)}>
                        <span className="mr-2">{t.thumbnail}</span>
                        <div>
                          <div className="text-xs font-medium">{t.name}</div>
                          <div className="text-[10px] text-muted-foreground">{t.description}</div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={onAddText}>
        <Type className="w-3.5 h-3.5" />
        텍스트
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs gap-1.5">
            <Square className="w-3.5 h-3.5" />
            도형
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onAddShape('rectangle')}>
            <Square className="w-3.5 h-3.5 mr-2" /> 사각형
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddShape('circle')}>
            <Circle className="w-3.5 h-3.5 mr-2" /> 원형
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={onAddImage}>
        <Image className="w-3.5 h-3.5" />
        이미지
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={onManualSave}>
        <Save className="w-3.5 h-3.5" />
        저장
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs gap-1.5">
            <Download className="w-3.5 h-3.5" />
            내보내기
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onExportPng}>
            <Image className="w-3.5 h-3.5 mr-2" /> PNG 이미지
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExportPdf}>
            <FileText className="w-3.5 h-3.5 mr-2" /> PDF 문서
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <span className="text-[10px] text-muted-foreground ml-1 min-w-[60px]">
        {saveStatus === 'saving' && (
          <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />저장 중...</span>
        )}
        {saveStatus === 'saved' && (
          <span className="flex items-center gap-1 text-primary"><Cloud className="w-3 h-3" />자동 저장됨</span>
        )}
      </span>

      {/* Alignment tools (multi-select) */}
      {showAlign && (
        <>
          <Separator orientation="vertical" className="h-6 mx-1" />
          <TooltipProvider delayDuration={200}>
            <div className="flex items-center gap-0.5">
              <Tooltip><TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onAlign('left')}>
                  <AlignLeft className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">좌측 정렬</p></TooltipContent></Tooltip>

              <Tooltip><TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onAlign('centerH')}>
                  <AlignCenter className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">가운데 정렬 (가로)</p></TooltipContent></Tooltip>

              <Tooltip><TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onAlign('right')}>
                  <AlignRight className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">우측 정렬</p></TooltipContent></Tooltip>

              <Tooltip><TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onAlign('top')}>
                  <AlignStartVertical className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">상단 정렬</p></TooltipContent></Tooltip>

              <Tooltip><TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onAlign('centerV')}>
                  <AlignCenterVertical className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">중앙 정렬 (세로)</p></TooltipContent></Tooltip>

              <Tooltip><TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onAlign('bottom')}>
                  <AlignEndVertical className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">하단 정렬</p></TooltipContent></Tooltip>

              <Tooltip><TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onAlign('distributeH')}>
                  <GripHorizontal className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">가로 간격 균등</p></TooltipContent></Tooltip>

              <Tooltip><TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => onAlign('distributeV')}>
                  <GripVertical className="w-3.5 h-3.5" />
                </Button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">세로 간격 균등</p></TooltipContent></Tooltip>
            </div>
          </TooltipProvider>
          <span className="text-[10px] text-muted-foreground ml-1">{multiSelectCount}개 선택</span>
        </>
      )}

      <div className="flex-1" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-0.5 mr-2">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onZoomOut} title="축소">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="text-xs font-medium text-muted-foreground min-w-[44px] text-center select-none">
          {Math.round(scale * 100)}%
        </span>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onZoomIn} title="확대">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onFitToScreen} title="화면에 맞추기">
          <Maximize className="w-3.5 h-3.5" />
        </Button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="text-xs gap-1.5 h-7">
            {currentPreset.width} × {currentPreset.height} ({currentPreset.ratio})
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {CANVAS_PRESETS.map(p => (
            <DropdownMenuItem
              key={p.id}
              onClick={() => onChangePreset(p)}
              className={p.id === currentPreset.id ? 'bg-accent' : ''}
            >
              <span className="text-xs font-medium mr-2">{p.ratio}</span>
              <span className="text-[10px] text-muted-foreground">{p.label} ({p.width}×{p.height})</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
