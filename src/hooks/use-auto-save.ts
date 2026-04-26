import { useEffect, useRef, useState, useCallback } from 'react';
import type { Page } from '@/types/design';

const STORAGE_KEY = 'cardnews-designer-save';
const DB_NAME = 'cardnews-designer';
const DB_STORE = 'saves';
const DB_KEY = 'current';

export type SaveStatus = 'idle' | 'saving' | 'saved';

interface SaveData {
  pages: Page[];
  canvasPresetId: string;
  savedAt: string;
}

// ---------- IndexedDB helpers (큰 이미지/base64 저장 지원) ----------
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(): Promise<SaveData | null> {
  try {
    const db = await openDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const req = tx.objectStore(DB_STORE).get(DB_KEY);
      req.onsuccess = () => resolve((req.result as SaveData) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function idbSet(data: SaveData): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(data, DB_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

async function idbDel(): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(DB_STORE, 'readwrite');
      tx.objectStore(DB_STORE).delete(DB_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {}
}

// 메타데이터(저장 여부 플래그)는 빠른 동기 확인을 위해 localStorage에 별도 보관
const META_KEY = STORAGE_KEY + ':meta';

export function hasSavedData(): boolean {
  try {
    if (localStorage.getItem(META_KEY)) return true;
    // 레거시: 이전 버전이 localStorage에 직접 저장한 경우
    return !!localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }
}

export async function loadSavedData(): Promise<SaveData | null> {
  // 1) IndexedDB 우선
  const fromIdb = await idbGet();
  if (fromIdb) return fromIdb;
  // 2) 레거시 localStorage 폴백
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

export async function clearSavedData(): Promise<void> {
  try { localStorage.removeItem(META_KEY); } catch {}
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
  await idbDel();
}

export function useAutoSave(
  pages: Page[],
  canvasPresetId: string,
) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const saveNow = useCallback(async () => {
    setStatus('saving');
    const data: SaveData = {
      pages,
      canvasPresetId,
      savedAt: new Date().toISOString(),
    };
    try {
      await idbSet(data);
      try {
        localStorage.setItem(META_KEY, JSON.stringify({ savedAt: data.savedAt }));
        // 레거시 키는 정리 (용량 차지 방지)
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      setStatus('saved');
      setTimeout(() => setStatus(prev => prev === 'saved' ? 'idle' : prev), 2000);
    } catch (err) {
      setStatus('idle');
      console.warn('[AutoSave] IndexedDB 저장 실패', err);
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
      void saveNow();
    }, 1500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pages, canvasPresetId, saveNow]);

  return { status, saveNow };
}
