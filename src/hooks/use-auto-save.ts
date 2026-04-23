import { useEffect, useRef, useState, useCallback } from 'react';
import type { Page, CanvasPreset } from '@/types/design';

const STORAGE_KEY = 'cardnews-designer-save';

export type SaveStatus = 'idle' | 'saving' | 'saved';

interface SaveData {
  pages: Page[];
  canvasPresetId: string;
  savedAt: string;
}

export function hasSavedData(): boolean {
  try {
    return !!localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

export function loadSavedData(): SaveData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

export function clearSavedData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function useAutoSave(
  pages: Page[],
  canvasPresetId: string,
) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const saveNow = useCallback(() => {
    setStatus('saving');
    try {
      const data: SaveData = {
        pages,
        canvasPresetId,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setStatus('saved');
      setTimeout(() => setStatus(prev => prev === 'saved' ? 'idle' : prev), 2000);
    } catch (err: unknown) {
      setStatus('idle');
      // 5MB 한도 초과 시 사용자에게 알림
      const isQuota = err instanceof DOMException && (
        err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      );
      if (isQuota) {
        console.warn('[AutoSave] localStorage 용량 초과 — 이미지 포함 시 세션 간 복원 불가');
      }
    }
  }, [pages, canvasPresetId]);

  // Auto-save with 1.5s debounce
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setStatus('saving');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveNow();
    }, 1500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pages, canvasPresetId, saveNow]);

  return { status, saveNow };
}
