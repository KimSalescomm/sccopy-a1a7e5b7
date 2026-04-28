import { Minus, Plus, Maximize2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ZoomSliderProps {
  scale: number;
  onChange: (value: number) => void;
  onFit: () => void;
  rightOffset: number; // px — usually right panel width + margin
}

const MIN = 0.5;
const MAX = 1.0;
const STEP = 0.05;

function clamp(v: number) {
  return Math.min(MAX, Math.max(MIN, v));
}

export function ZoomSlider({ scale, onChange, onFit, rightOffset }: ZoomSliderProps) {
  const pct = Math.round(scale * 100);

  return (
    <div
      data-editing-ui
      data-zoom-control
      className="zoom-control fixed bottom-6 z-40 flex h-[42px] w-[240px] items-center gap-1.5 bg-card/95 backdrop-blur border border-border rounded-full shadow-lg px-2 text-sm"
      style={{ right: rightOffset }}
    >
      <button
        onClick={() => onChange(clamp(scale - STEP))}
        title="축소"
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent transition-colors flex-shrink-0"
      >
        <Minus className="w-4 h-4" />
      </button>

      <div className="w-[72px] px-1 flex-shrink-0">
        <Slider
          className="[&>span:first-child]:h-1 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          value={[Math.round(clamp(scale) * 100)]}
          min={MIN * 100}
          max={MAX * 100}
          step={STEP * 100}
          onValueChange={([v]) => onChange(clamp(v / 100))}
        />
      </div>

      <button
        onClick={() => onChange(clamp(scale + STEP))}
        title="확대"
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-accent transition-colors flex-shrink-0"
      >
        <Plus className="w-4 h-4" />
      </button>

      <span className="text-sm font-medium tabular-nums w-10 text-center select-none flex-shrink-0">
        {pct}%
      </span>

      <button
        onClick={onFit}
        title="화면에 맞추기"
        className="flex items-center gap-1 h-8 px-2 rounded-full text-sm font-medium hover:bg-accent transition-colors border border-border/60 flex-shrink-0"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        Fit
      </button>
    </div>
  );
}
