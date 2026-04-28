import React from 'react';
import type { Page } from '@/types/design';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/types/design';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageSidebarProps {
  pages: Page[];
  currentIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDeletePage: (index: number) => void;
}

export function PageSidebar({ pages, currentIndex, onSelectPage, onAddPage, onDeletePage }: PageSidebarProps) {
  return (
    <div className="w-[200px] border-r bg-card flex flex-col">
      <div className="p-3 border-b">
        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">페이지</span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {pages.map((page, i) => {
          const bgStyle: React.CSSProperties = page.background.type === 'gradient'
            ? { background: `linear-gradient(${page.background.gradientDirection ?? 180}deg, ${page.background.gradientFrom}, ${page.background.gradientTo})` }
            : { backgroundColor: page.background.color };

          return (
            <div
              key={page.id}
              className={`cursor-pointer rounded-lg border-2 transition-all overflow-hidden ${
                i === currentIndex ? 'border-primary shadow-md' : 'border-transparent hover:border-border'
              }`}
              onClick={() => onSelectPage(i)}
              onContextMenu={e => {
                e.preventDefault();
                if (pages.length > 1) onDeletePage(i);
              }}
            >
              <div className="relative" style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}>
                <div className="absolute inset-0" style={bgStyle}>
                  {/* Mini preview of elements */}
                  {page.elements.map(el => {
                    const sx = 1; // simplified thumbnail
                    if (el.type === 'shape') {
                      return (
                        <div
                          key={el.id}
                          className="absolute"
                          style={{
                            left: `${(el.position.x / CANVAS_WIDTH) * 100}%`,
                            top: `${(el.position.y / CANVAS_HEIGHT) * 100}%`,
                            width: `${(el.size.width / CANVAS_WIDTH) * 100}%`,
                            height: `${(el.size.height / CANVAS_HEIGHT) * 100}%`,
                            backgroundColor: el.shapeStyle?.fill,
                            borderRadius: el.shapeType === 'circle' ? '50%' : (el.shapeStyle?.borderRadius ? 4 : 0),
                            opacity: el.shapeStyle?.opacity,
                          }}
                        />
                      );
                    }
                    if (el.type === 'text') {
                      return (
                        <div
                          key={el.id}
                          className="absolute overflow-hidden"
                          style={{
                            left: `${(el.position.x / CANVAS_WIDTH) * 100}%`,
                            top: `${(el.position.y / CANVAS_HEIGHT) * 100}%`,
                            width: `${(el.size.width / CANVAS_WIDTH) * 100}%`,
                            height: `${(el.size.height / CANVAS_HEIGHT) * 100}%`,
                            fontSize: 3,
                            color: el.textStyle?.color,
                            fontWeight: el.textStyle?.fontWeight,
                          }}
                        >
                          <div className="w-full h-[2px] rounded bg-current opacity-40 mt-[1px]" />
                          <div className="w-3/4 h-[2px] rounded bg-current opacity-30 mt-[1px]" />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
              <div className="px-2 py-1 bg-card text-center">
                <span className="text-xs text-muted-foreground">{i + 1}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="p-2 border-t">
        <Button variant="ghost" size="sm" className="w-full text-sm" onClick={onAddPage}>
          <Plus className="w-4 h-4 mr-1" />
          페이지 추가
        </Button>
      </div>
    </div>
  );
}
