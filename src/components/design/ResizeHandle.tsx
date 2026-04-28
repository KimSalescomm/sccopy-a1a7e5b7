import { useCallback, useEffect, useRef } from 'react';

interface ResizeHandleProps {
  /** 'left' = drag handle resizes the panel on its LEFT side (i.e. right panel). 'right' = resizes panel on its RIGHT side (i.e. left panel). */
  side: 'left' | 'right';
  width: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}

export function ResizeHandle({ side, width, min, max, onChange }: ResizeHandleProps) {
  const startXRef = useRef(0);
  const startWRef = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startXRef.current = e.clientX;
    startWRef.current = width;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startXRef.current;
      const next = side === 'right'
        ? startWRef.current + delta // dragging right edge of left panel
        : startWRef.current - delta; // dragging left edge of right panel
      onChange(Math.min(max, Math.max(min, Math.round(next))));
    };
    const onUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [width, min, max, onChange, side]);

  useEffect(() => () => {
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  return (
    <div
      onMouseDown={onMouseDown}
      className="w-1.5 flex-shrink-0 cursor-col-resize bg-transparent hover:bg-primary/30 active:bg-primary/50 transition-colors relative group"
      title="드래그하여 패널 크기 조절"
    >
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-border group-hover:bg-primary/60" />
    </div>
  );
}
