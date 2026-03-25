import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Type, Square, Circle, Image, LayoutTemplate, FileText, ChevronRight } from 'lucide-react';
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

interface ToolbarProps {
  onAddText: () => void;
  onAddShape: (shape: 'rectangle' | 'circle') => void;
  onAddImage: () => void;
  onApplyTemplate: (templateId: string) => void;
  currentPreset: CanvasPreset;
  onChangePreset: (preset: CanvasPreset) => void;
}

export function Toolbar({ onAddText, onAddShape, onAddImage, onApplyTemplate, currentPreset, onChangePreset }: ToolbarProps) {
  return (
    <header className="h-12 border-b bg-card flex items-center px-3 gap-1">
      <div className="flex items-center gap-2 mr-3">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <FileText className="w-3.5 h-3.5 text-primary-foreground" />
        </div>
        <span className="text-sm font-bold text-foreground hidden sm:inline">카드뉴스 디자이너</span>
      </div>

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

      <div className="flex-1" />

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
