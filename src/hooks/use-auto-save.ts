import { useEffect, useRef, useState, useCallback } from 'react';
import type { DesignElement, Page } from '@/types/design';
import { getElementImageSrc } from '@/types/design';

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

function isDataImage(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('data:image/');
}

function normalizeImageElement(element: DesignElement): DesignElement {
  if (element.type !== 'image') return element;
  const legacy = element as DesignElement & { dataUrl?: string; image?: string; src?: string };
  const dataImage = [element.imageData, element.imageUrl, legacy.dataUrl, legacy.image, legacy.src].find(isDataImage);
  if (dataImage) {
    return { ...element, imageData: dataImage, imageUrl: dataImage };
  }
  if (getElementImageSrc(element).startsWith('blob:')) {
    console.warn('[ImagePersistence] blob URL detected and not persisted', element.id);
    return { ...element, imageData: undefined, imageUrl: '' };
  }
  return element;
}

function normalizePagesForPersistence(pages: Page[]): Page[] {
  return pages.map(page => ({
    ...page,
    elements: page.elements.map(normalizeImageElement),
  }));
}

function logFirstImage(stage: string, pages: Page[]) {
  const image = pages.flatMap(page => page.elements).find(element => element.type === 'image' && getElementImageSrc(element));
  if (!image) return;
  const src = getElementImageSrc(image);
  console.log(`[ImagePersistence] ${stage} imageData prefix`, image.imageData?.slice(0, 30) ?? '', 'src prefix', src.slice(0, 30), 'length', src.length);
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
    const data = await new Promise<SaveData | null>((resolve, reject) => {
      const tx = db.transaction(DB_STORE, 'readonly');
      const req = tx.objectStore(DB_STORE).get(DB_KEY);
      req.onsuccess = () => resolve((req.result as SaveData) ?? null);
      req.onerror = () => reject(req.error);
    });
    return data ? { ...data, pages: normalizePagesForPersistence(data.pages) } : null;
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
  if (fromIdb) {
    logFirstImage('restore/from-indexeddb', fromIdb.pages);
    return fromIdb;
  }
  // 2) 레거시 localStorage 폴백
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SaveData;
    const normalized = { ...parsed, pages: normalizePagesForPersistence(parsed.pages) };
    logFirstImage('restore/from-localstorage', normalized.pages);
    return normalized;
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
    const persistedPages = normalizePagesForPersistence(pages);
    logFirstImage('before-save', persistedPages);
    const data: SaveData = {
      pages: persistedPages,
      canvasPresetId,
      savedAt: new Date().toISOString(),
    };
    try {
      await idbSet(data);
      const stored = await idbGet();
      if (stored) logFirstImage('after-indexeddb-save', stored.pages);
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
