import { Button } from '@/components/ui/button';
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
}

// PPT-like ribbon tab button
function RibbonBtn({
  icon, label, onClick, disabled, title,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded
        text-[11px] text-foreground hover:bg-accent disabled:opacity-40
        disabled:cursor-not-allowed transition-colors min-w-[40px] h-14 select-none"
    >
      <span className="flex items-center justify-center w-6 h-6">{icon}</span>
      <span className="leading-none text-center whitespace-nowrap">{label}</span>
    </button>
  );
}

// PPT-like ribbon section label
function RibbonSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-0.5 flex-1 px-1">
        {children}
      </div>
      <div className="text-[9px] text-muted-foreground text-center pb-0.5 px-1 leading-none select-none border-t border-border/30 pt-0.5">
        {label}
      </div>
    </div>
  );
}

export function Toolbar({
  onAddText, onAddShape, onAddImage, onApplyTemplate,
  currentPreset, onChangePreset, saveStatus, onManualSave,
  scale,
  canUndo, canRedo, onUndo, onRedo,
  multiSelectCount, onAlign, onExportPng, onExportPdf,
  onGroup, onUngroup, hasGroupInSelection,
}: ToolbarProps) {
  const showAlign = multiSelectCount >= 2;

  return (
    <TooltipProvider delayDuration={200}>
      {/* ── 상단 제목 바 (PPT 타이틀 바) ─────────────────────────── */}
      <div className="h-7 bg-primary flex items-center px-3 gap-2">
        <div className="w-4 h-4 rounded bg-primary-foreground/20 flex items-center justify-center">
          <FileText className="w-2.5 h-2.5 text-primary-foreground" />
        </div>
        <span className="text-xs font-semibold text-primary-foreground">카드뉴스 디자이너</span>
        <div className="flex-1" />
        {/* 저장 상태 */}
        <span className="text-[10px] text-primary-foreground/70">
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />저장 중...</span>
          )}
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1"><Cloud className="w-3 h-3" />자동 저장됨</span>
          )}
        </span>
      </div>

      {/* ── 리본 메뉴 (PPT 리본 스타일) ──────────────────────────── */}
      <div className="border-b bg-card flex items-stretch px-2 gap-0" style={{ height: 72 }}>

        {/* 되돌리기 */}
        <RibbonSection label="되돌리기">
          <RibbonBtn icon={<Undo2 className="w-5 h-5" />} label="실행취소" onClick={onUndo} disabled={!canUndo} title="Ctrl+Z" />
          <RibbonBtn icon={<Redo2 className="w-5 h-5" />} label="다시실행" onClick={onRedo} disabled={!canRedo} title="Ctrl+Shift+Z" />
        </RibbonSection>

        <Separator orientation="vertical" className="h-14 self-center mx-1" />

        {/* 삽입 */}
        <RibbonSection label="삽입">
          <RibbonBtn icon={<Type className="w-5 h-5" />} label="텍스트" onClick={onAddText} title="텍스트 상자 추가" />

          {/* 도형 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded
                text-[11px] text-foreground hover:bg-accent transition-colors min-w-[40px] h-14 select-none">
                <span className="flex items-center justify-center w-6 h-6 relative">
                  <Square className="w-5 h-5" />
                  <ChevronDown className="w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5" />
                </span>
                <span className="leading-none">도형</span>
              </button>
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

          <RibbonBtn icon={<Image className="w-5 h-5" />} label="이미지" onClick={onAddImage} title="이미지 추가 (클립보드 붙여넣기)" />
        </RibbonSection>

        <Separator orientation="vertical" className="h-14 self-center mx-1" />

        {/* 템플릿 */}
        <RibbonSection label="템플릿">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded
                text-[11px] text-foreground hover:bg-accent transition-colors min-w-[48px] h-14 select-none">
                <span className="flex items-center gap-0.5 relative">
                  <LayoutTemplate className="w-5 h-5" />
                  <ChevronDown className="w-2.5 h-2.5" />
                </span>
                <span className="leading-none">템플릿</span>
              </button>
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
        </RibbonSection>

        <Separator orientation="vertical" className="h-14 self-center mx-1" />

        {/* 파일 */}
        <RibbonSection label="파일">
          <RibbonBtn icon={<Save className="w-5 h-5" />} label="저장" onClick={onManualSave} title="수동 저장 (Ctrl+S)" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded
                text-[11px] text-foreground hover:bg-accent transition-colors min-w-[48px] h-14 select-none">
                <span className="flex items-center gap-0.5">
                  <Download className="w-5 h-5" />
                  <ChevronDown className="w-2.5 h-2.5" />
                </span>
                <span className="leading-none">내보내기</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onExportPng}>
                <Image className="w-3.5 h-3.5 mr-2" /> PNG 이미지
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onExportPdf}>
                <FileText className="w-3.5 h-3.5 mr-2" /> PDF 문서
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </RibbonSection>

        {/* 정렬 (다중 선택 시만 노출 — PPT의 '그림 형식' 탭 느낌) */}
        {showAlign && (
          <>
            <Separator orientation="vertical" className="h-14 self-center mx-1" />
            <RibbonSection label="정렬">
              <Tooltip><TooltipTrigger asChild>
                <button onClick={() => onAlign('left')} className="flex items-center justify-center w-7 h-7 rounded hover:bg-accent transition-colors">
                  <AlignLeft className="w-4 h-4" />
                </button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">좌측 정렬</p></TooltipContent></Tooltip>

              <Tooltip><TooltipTrigger asChild>
                <button onClick={() => onAlign('centerH')} className="flex items-center justify-center w-7 h-7 rounded hover:bg-accent transition-colors">
                  <AlignCenter className="w-4 h-4" />
                </button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">가운데 정렬 (가로)</p></TooltipContent></Tooltip>

              <Tooltip><TooltipTrigger asChild>
                <button onClick={() => onAlign('right')} className="flex items-center justify-center w-7 h-7 rounded hover:bg-accent transition-colors">
                  <AlignRight className="w-4 h-4" />
                </button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">우측 정렬</p></TooltipContent></Tooltip>

              <Tooltip><TooltipTrigger asChild>
                <button onClick={() => onAlign('top')} className="flex items-center justify-center w-7 h-7 rounded hover:bg-accent transition-colors">
                  <AlignStartVertical className="w-4 h-4" />
                </button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">상단 정렬</p></TooltipContent></Tooltip>

              <Tooltip><TooltipTrigger asChild>
                <button onClick={() => onAlign('centerV')} className="flex items-center justify-center w-7 h-7 rounded hover:bg-accent transition-colors">
                  <AlignCenterVertical className="w-4 h-4" />
                </button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">중앙 정렬 (세로)</p></TooltipContent></Tooltip>

              <Tooltip><TooltipTrigger asChild>
                <button onClick={() => onAlign('bottom')} className="flex items-center justify-center w-7 h-7 rounded hover:bg-accent transition-colors">
                  <AlignEndVertical className="w-4 h-4" />
                </button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">하단 정렬</p></TooltipContent></Tooltip>

              <Tooltip><TooltipTrigger asChild>
                <button onClick={() => onAlign('distributeH')} className="flex items-center justify-center w-7 h-7 rounded hover:bg-accent transition-colors">
                  <GripHorizontal className="w-4 h-4" />
                </button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">가로 간격 균등</p></TooltipContent></Tooltip>

              <Tooltip><TooltipTrigger asChild>
                <button onClick={() => onAlign('distributeV')} className="flex items-center justify-center w-7 h-7 rounded hover:bg-accent transition-colors">
                  <GripVertical className="w-4 h-4" />
                </button>
              </TooltipTrigger><TooltipContent side="bottom"><p className="text-xs">세로 간격 균등</p></TooltipContent></Tooltip>
            </RibbonSection>

            <Separator orientation="vertical" className="h-14 self-center mx-1" />

            <RibbonSection label="그룹">
              {hasGroupInSelection ? (
                <RibbonBtn icon={<Ungroup className="w-5 h-5" />} label="그룹해제" onClick={onUngroup} title="Ctrl+Shift+G" />
              ) : (
                <RibbonBtn icon={<Group className="w-5 h-5" />} label="그룹화" onClick={onGroup} disabled={multiSelectCount < 2} title="Ctrl+G" />
              )}
              <span className="text-[10px] text-muted-foreground self-center px-1 whitespace-nowrap">{multiSelectCount}개 선택</span>
            </RibbonSection>
          </>
        )}

        <div className="flex-1" />

        {/* ── 화면 크기 (오른쪽 끝) ─────────────────────────────── */}
        <RibbonSection label="슬라이드 크기">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded
                text-[11px] text-foreground hover:bg-accent transition-colors h-14 select-none min-w-[72px]">
                <span className="text-xs font-semibold">{currentPreset.ratio}</span>
                <span className="text-[9px] text-muted-foreground">{currentPreset.width}×{currentPreset.height}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
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
        </RibbonSection>
      </div>
    </TooltipProvider>
  );
}

// ─── 하단 상태바 (PPT 스타일 줌 컨트롤) ─────────────────────────────────────
interface StatusBarProps {
  scale: number;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onFitToScreen: () => void;
}

export function StatusBar({ scale, onZoomOut, onZoomIn, onFitToScreen }: StatusBarProps) {
  return (
    <div className="h-7 border-t bg-muted/30 flex items-center px-3 gap-1 select-none">
      <div className="flex-1" />
      {/* PPT처럼 오른쪽 하단에 줌 컨트롤 배치 */}
      <div className="flex items-center gap-1">
        <button
          onClick={onFitToScreen}
          title="화면에 맞추기"
          className="flex items-center justify-center w-6 h-6 rounded hover:bg-accent transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-0.5 border border-border/60 rounded px-1 bg-background">
          <button
            onClick={onZoomOut}
            title="축소 (Ctrl+-)"
            className="flex items-center justify-center w-5 h-5 rounded hover:bg-accent transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <span className="text-[11px] font-medium text-foreground min-w-[36px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            title="확대 (Ctrl++)"
            className="flex items-center justify-center w-5 h-5 rounded hover:bg-accent transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
}
