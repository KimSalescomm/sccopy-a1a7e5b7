import { useState, useCallback, useRef } from 'react';
import type { Page } from '@/types/design';

const MAX_HISTORY = 50;

export function useHistory(initialPages: Page[]) {
  const [history, setHistory] = useState<Page[][]>([initialPages]);
  const [pointer, setPointer] = useState(0);
  const skipNextPush = useRef(false);

  const current = history[pointer];

  const push = useCallback((pages: Page[]) => {
    if (skipNextPush.current) {
      skipNextPush.current = false;
      return;
    }
    setHistory(prev => {
      const newHistory = prev.slice(0, pointer + 1);
      newHistory.push(JSON.parse(JSON.stringify(pages)));
      if (newHistory.length > MAX_HISTORY) newHistory.shift();
      return newHistory;
    });
    setPointer(prev => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [pointer]);

  const undo = useCallback((): Page[] | null => {
    if (pointer <= 0) return null;
    skipNextPush.current = true;
    const newPointer = pointer - 1;
    setPointer(newPointer);
    return JSON.parse(JSON.stringify(history[newPointer]));
  }, [pointer, history]);

  const redo = useCallback((): Page[] | null => {
    if (pointer >= history.length - 1) return null;
    skipNextPush.current = true;
    const newPointer = pointer + 1;
    setPointer(newPointer);
    return JSON.parse(JSON.stringify(history[newPointer]));
  }, [pointer, history]);

  const canUndo = pointer > 0;
  const canRedo = pointer < history.length - 1;

  const reset = useCallback((pages: Page[]) => {
    setHistory([JSON.parse(JSON.stringify(pages))]);
    setPointer(0);
  }, []);

  return { current, push, undo, redo, canUndo, canRedo, reset };
}
