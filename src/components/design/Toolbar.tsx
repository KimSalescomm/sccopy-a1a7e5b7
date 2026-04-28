import { Separator } from '@/components/ui/separator';
import {
  Type, Square, Circle, Image, LayoutTemplate, FileText,
  Save, Cloud, Loader2, Undo2, Redo2,
  AlignLeft, AlignCenter, AlignRight,
  AlignStartVertical, AlignCenterVertical, AlignEndVertical,
  GripHorizontal, GripVertical, Download, Group, Ungroup,
  ZoomIn, ZoomOut, Maximize2, ChevronDown,
} from 'lucide-react';
import type { SaveStatus } from '@/hooks/use-auto-save';
import type { AlignAction } from './AlignmentGuides';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger,
  DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { TEMPLATES } from '@/lib/templates';
import { TEMPLATE_CATEGORIES, CANVAS_PRESETS, type CanvasPreset } from '@/types/design';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  multiSelectCount: number;
  onAlign: (action: AlignAction) => void;
  onExportPng: () => void;
  onExportPdf: () => void;
  onGroup: () => void;
  onUngroup: () => void;
  hasGroupInSelection: boolean;
  onSetZoom?: (value: 'fit' | number) => void;
}

// 컴팩트 가로형 툴바 버튼 — 아이콘 + 라벨, 클릭 영역 ≥ 40px
function ToolBtn({
  icon, label, onClick, disabled, title,
}: {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex items-center gap-1.5 px-2.5 h-10 rounded-md
        text-[14px] font-medium text-foreground hover:bg-accent disabled:opacity-40
        disabled:cursor-not-allowed transition-colors select-none"
    >
      <span className="flex items-center justify-center">{icon}</span>
      {label && <span className="leading-none whitespace-nowrap">{label}</span>}
    </button>
  );
}

// 아이콘 전용 (정렬 버튼 등)
function IconBtn({
  icon, onClick, disabled, title,
}: {
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex items-center justify-center w-10 h-10 rounded-md
        text-foreground hover:bg-accent disabled:opacity-40
        disabled:cursor-not-allowed transition-colors select-none"
    >
      {icon}
    </button>
  );
}

export function Toolbar({
  onAddText, onAddShape, onAddImage, onApplyTemplate,
  currentPreset, onChangePreset, saveStatus, onManualSave,
  scale,
  canUndo, canRedo, onUndo, onRedo,
  multiSelectCount, onAlign, onExportPng, onExportPdf,
  onGroup, onUngroup, hasGroupInSelection,
  onSetZoom,
}: ToolbarProps) {
  const showAlign = multiSelectCount >= 2;

  const ICON = "w-[22px] h-[22px]";

  return (
    <TooltipProvider delayDuration={200}>
      {/* ── 단일 가로 툴바 (높이 64px) ─────────────────────────── */}
      <div
        className="border-b bg-card flex items-center px-3 gap-1"
        style={{ height: 64 }}
      >
        {/* 브랜드 */}
        <div className="flex items-center gap-2 pr-2 mr-1 border-r border-border h-10">
          <div className="w-7 h-7 rounded bg-primary/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[15px] font-semibold text-foreground whitespace-nowrap">
            카드뉴스 디자이너
          </span>
        </div>

        {/* 되돌리기 / 다시실행 */}
        <ToolBtn icon={<Undo2 className={ICON} />} label="실행취소" onClick={onUndo} disabled={!canUndo} title="Ctrl+Z" />
        <ToolBtn icon={<Redo2 className={ICON} />} label="다시실행" onClick={onRedo} disabled={!canRedo} title="Ctrl+Shift+Z" />

        <Separator orientation="vertical" className="h-7 mx-1.5" />

        {/* 삽입 */}
        <ToolBtn icon={<Type className={ICON} />} label="텍스트" onClick={onAddText} title="텍스트 상자 추가" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-1.5 px-2.5 h-10 rounded-md text-[14px] font-medium text-foreground hover:bg-accent transition-colors select-none"
              title="도형 추가"
            >
              <Square className={ICON} />
              <span className="leading-none">도형</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onAddShape('rectangle')} className="text-sm">
              <Square className="w-4 h-4 mr-2" /> 사각형
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddShape('circle')} className="text-sm">
              <Circle className="w-4 h-4 mr-2" /> 원형
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ToolBtn icon={<Image className={ICON} />} label="이미지" onClick={onAddImage} title="이미지 추가" />

        <Separator orientation="vertical" className="h-7 mx-1.5" />

        {/* 템플릿 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-1.5 px-2.5 h-10 rounded-md text-[14px] font-medium text-foreground hover:bg-accent transition-colors select-none"
              title="템플릿 적용"
            >
              <LayoutTemplate className={ICON} />
              <span className="leading-none">템플릿</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60">
            {TEMPLATE_CATEGORIES.map(cat => {
              const catTemplates = TEMPLATES.filter(t => t.category === cat.id);
              return (
                <DropdownMenuSub key={cat.id}>
                  <DropdownMenuSubTrigger className="gap-2">
                    <span>{cat.emoji}</span>
                    <span className="text-sm font-medium">{cat.label}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="w-56">
                      {catTemplates.map(t => (
                        <DropdownMenuItem key={t.id} onClick={() => onApplyTemplate(t.id)}>
                          <span className="mr-2">{t.thumbnail}</span>
                          <div>
                            <div className="text-sm font-medium">{t.name}</div>
                            <div className="text-xs text-muted-foreground">{t.description}</div>
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

        <Separator orientation="vertical" className="h-7 mx-1.5" />

        {/* 파일 */}
        <ToolBtn icon={<Save className={ICON} />} label="저장" onClick={onManualSave} title="수동 저장 (Ctrl+S)" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-1.5 px-2.5 h-10 rounded-md text-[14px] font-medium text-foreground hover:bg-accent transition-colors select-none"
              title="내보내기"
            >
              <Download className={ICON} />
              <span className="leading-none">내보내기</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onExportPng} className="text-sm">
              <Image className="w-4 h-4 mr-2" /> PNG 이미지
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onExportPdf} className="text-sm">
              <FileText className="w-4 h-4 mr-2" /> PDF 문서
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 정렬 (다중 선택 시만) */}
        {showAlign && (
          <>
            <Separator orientation="vertical" className="h-7 mx-1.5" />
            <Tooltip><TooltipTrigger asChild><div><IconBtn icon={<AlignLeft className="w-5 h-5" />} onClick={() => onAlign('left')} title="좌측 정렬" /></div></TooltipTrigger><TooltipContent side="bottom"><p className="text-sm">좌측 정렬</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><div><IconBtn icon={<AlignCenter className="w-5 h-5" />} onClick={() => onAlign('centerH')} title="가운데 정렬" /></div></TooltipTrigger><TooltipContent side="bottom"><p className="text-sm">가운데 정렬</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><div><IconBtn icon={<AlignRight className="w-5 h-5" />} onClick={() => onAlign('right')} title="우측 정렬" /></div></TooltipTrigger><TooltipContent side="bottom"><p className="text-sm">우측 정렬</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><div><IconBtn icon={<AlignStartVertical className="w-5 h-5" />} onClick={() => onAlign('top')} title="상단 정렬" /></div></TooltipTrigger><TooltipContent side="bottom"><p className="text-sm">상단 정렬</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><div><IconBtn icon={<AlignCenterVertical className="w-5 h-5" />} onClick={() => onAlign('centerV')} title="중앙 정렬" /></div></TooltipTrigger><TooltipContent side="bottom"><p className="text-sm">중앙 정렬</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><div><IconBtn icon={<AlignEndVertical className="w-5 h-5" />} onClick={() => onAlign('bottom')} title="하단 정렬" /></div></TooltipTrigger><TooltipContent side="bottom"><p className="text-sm">하단 정렬</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><div><IconBtn icon={<GripHorizontal className="w-5 h-5" />} onClick={() => onAlign('distributeH')} title="가로 간격 균등" /></div></TooltipTrigger><TooltipContent side="bottom"><p className="text-sm">가로 간격 균등</p></TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><div><IconBtn icon={<GripVertical className="w-5 h-5" />} onClick={() => onAlign('distributeV')} title="세로 간격 균등" /></div></TooltipTrigger><TooltipContent side="bottom"><p className="text-sm">세로 간격 균등</p></TooltipContent></Tooltip>

            <Separator orientation="vertical" className="h-7 mx-1.5" />
            {hasGroupInSelection ? (
              <ToolBtn icon={<Ungroup className={ICON} />} label="그룹해제" onClick={onUngroup} title="Ctrl+Shift+G" />
            ) : (
              <ToolBtn icon={<Group className={ICON} />} label="그룹화" onClick={onGroup} disabled={multiSelectCount < 2} title="Ctrl+G" />
            )}
            <span className="text-sm text-muted-foreground px-1.5 whitespace-nowrap">{multiSelectCount}개 선택</span>
          </>
        )}

        <div className="flex-1" />

        {/* 저장 상태 */}
        <span className="text-[13px] text-muted-foreground mr-2 whitespace-nowrap">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1.5"><Loader2 className="w-4 h-4 animate-spin" />저장 중...</span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1.5"><Cloud className="w-4 h-4" />자동 저장됨</span>
          )}
        </span>

        {/* 줌 컨트롤은 화면 우측 하단 슬라이더로 이동 */}

        {/* 슬라이드 크기 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-1.5 px-2.5 h-10 rounded-md text-[14px] font-medium text-foreground hover:bg-accent transition-colors select-none ml-1"
              title="슬라이드 크기"
            >
              <span className="font-semibold">{currentPreset.ratio}</span>
              <span className="text-[12px] text-muted-foreground">{currentPreset.width}×{currentPreset.height}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {CANVAS_PRESETS.map(p => (
              <DropdownMenuItem
                key={p.id}
                onClick={() => onChangePreset(p)}
                className={p.id === currentPreset.id ? 'bg-accent' : ''}
              >
                <span className="text-sm font-medium mr-2">{p.ratio}</span>
                <span className="text-xs text-muted-foreground">{p.label} ({p.width}×{p.height})</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}

// ─── 하단 상태바 (줌 +/- 버튼) ─────────────────────────────────────
interface StatusBarProps {
  scale: number;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onFitToScreen: () => void;
}

export function StatusBar({ scale, onZoomOut, onZoomIn, onFitToScreen }: StatusBarProps) {
  return (
    <div className="h-9 border-t bg-muted/30 flex items-center px-4 gap-1.5 select-none">
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <button
          onClick={onFitToScreen}
          title="화면에 맞추기"
          className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-accent transition-colors"
        >
          <Maximize2 className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-0.5 border border-border/60 rounded-md px-1.5 bg-background h-8">
          <button
            onClick={onZoomOut}
            title="축소 (Ctrl+-)"
            className="flex items-center justify-center w-7 h-7 rounded hover:bg-accent transition-colors"
          >
            <ZoomOut className="w-4 h-4 text-muted-foreground" />
          </button>
          <span className="text-sm font-medium text-foreground min-w-[44px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            title="확대 (Ctrl++)"
            className="flex items-center justify-center w-7 h-7 rounded hover:bg-accent transition-colors"
          >
            <ZoomIn className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
