import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Type, Square, Circle, Image, LayoutTemplate, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TEMPLATES } from '@/lib/templates';

import { CANVAS_PRESETS, type CanvasPreset } from '@/types/design';

interface ToolbarProps {
  onAddText: () => void;
  onAddShape: (shape: 'rectangle' | 'circle') => void;
  onAddImage: () => void;
  onApplyTemplate: (templateId: string) => void;
  currentPreset: CanvasPreset;
  onChangePreset: (preset: CanvasPreset) => void;
}

export function Toolbar({ onAddText, onAddShape, onAddImage, onApplyTemplate }: ToolbarProps) {
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
        <DropdownMenuContent>
          {TEMPLATES.map(t => (
            <DropdownMenuItem key={t.id} onClick={() => onApplyTemplate(t.id)}>
              <span className="mr-2">{t.thumbnail}</span>
              <div>
                <div className="text-xs font-medium">{t.name}</div>
                <div className="text-[10px] text-muted-foreground">{t.description}</div>
              </div>
            </DropdownMenuItem>
          ))}
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

      <span className="text-[10px] text-muted-foreground hidden md:inline">1080 × 1350 (4:5)</span>
    </header>
  );
}
