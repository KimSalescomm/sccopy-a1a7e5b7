import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// ─── helpers ────────────────────────────────────────────────────────────────

function waitForNextPaint() {
  return new Promise<void>(resolve => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

async function waitForAssets(root: HTMLElement) {
  if ('fonts' in document) await document.fonts.ready;

  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    images.map(img => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>(resolve => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
      });
    }),
  );

  await waitForNextPaint();
  await waitForNextPaint();
}

// ─── clone & prepare ────────────────────────────────────────────────────────

function normalizeExportCanvas(root: HTMLElement, w: number, h: number) {
  root.id = 'export-canvas';
  root.setAttribute('data-export-canvas', 'true');
  // 캡처 대상 자체에는 transform/scale을 절대 적용하지 않음 (1920x1080 원본 유지)
  root.style.position = 'relative';
  root.style.left = '0';
  root.style.top = '0';
  root.style.width = `${w}px`;
  root.style.height = `${h}px`;
  root.style.minWidth = `${w}px`;
  root.style.minHeight = `${h}px`;
  root.style.maxWidth = 'none';
  root.style.maxHeight = 'none';
  root.style.overflow = 'visible';
  root.style.transform = 'none';
  root.style.transformOrigin = 'top left';
  root.style.zoom = '1';
  root.style.boxShadow = 'none';
  root.style.borderRadius = '0';
  root.style.opacity = '1';
  root.style.background = '#FAFAFA';
  root.style.margin = '0';

  root.querySelectorAll('[data-editing-ui]').forEach(n => n.remove());

  root.querySelectorAll<HTMLElement>('*').forEach(n => {
    n.style.animation = 'none';
    n.style.transition = 'none';
  });

  root.querySelectorAll<HTMLElement>('[data-design-element-id]').forEach(n => {
    n.style.outline = 'none';
    n.style.boxShadow = 'none';
    n.style.cursor = 'default';
  });

  root.querySelectorAll<HTMLElement>('[data-design-element-type="text"] > div').forEach(n => {
    n.style.overflow = 'hidden';
    n.style.minHeight = '100%';
  });
}

function createPreviewWrapper(w: number, h: number) {
  const wrapper = document.createElement('div');
  wrapper.id = 'export-preview-wrapper';
  wrapper.setAttribute('data-export-preview-wrapper', 'true');
  // wrapper에만 미리보기 축소 적용 — 캡처 대상에는 영향 없음
  wrapper.style.position = 'fixed';
  wrapper.style.left = '0';
  wrapper.style.top = '0';
  wrapper.style.width = `${w}px`;
  wrapper.style.height = `${h}px`;
  wrapper.style.transform = 'scale(0.25)';
  wrapper.style.transformOrigin = 'top left';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.zIndex = '999999';
  wrapper.style.overflow = 'visible';
  wrapper.style.background = 'transparent';
  return wrapper;
}

async function createExportClone(canvasEl: HTMLElement, w: number, h: number) {
  const wrapper = createPreviewWrapper(w, h);
  const clone = canvasEl.cloneNode(true) as HTMLElement;
  normalizeExportCanvas(clone, w, h);
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);
  await waitForAssets(clone);
  void clone.offsetHeight;
  await waitForNextPaint();
  return { wrapper, clone };
}

// ─── capture ────────────────────────────────────────────────────────────────

function isDebugExport() {
  if (typeof window === 'undefined') return false;
  try {
    if (new URLSearchParams(window.location.search).get('debugExport') === 'true') return true;
    if ((window as any).debugExport === true) return true;
  } catch {}
  return false;
}

async function captureCanvas(
  canvasEl: HTMLElement,
  canvasWidth: number,
  canvasHeight: number,
): Promise<HTMLCanvasElement> {
  const { wrapper, clone } = await createExportClone(canvasEl, canvasWidth, canvasHeight);
  const debug = isDebugExport();

  try {
    const rect = clone.getBoundingClientRect();
    const computed = window.getComputedStyle(clone);
    console.log('[Export] target selector', '#export-canvas');
    console.log('[Export] target width / height', canvasWidth, canvasHeight);
    console.log('[Export] target offsetWidth / offsetHeight', clone.offsetWidth, clone.offsetHeight);
    console.log('[Export] target scrollWidth / scrollHeight', clone.scrollWidth, clone.scrollHeight);
    console.log('[Export] target getBoundingClientRect()', rect.toJSON ? rect.toJSON() : rect);
    console.log('[Export] target computed transform', computed.transform);
    console.log('[Export] debugExport mode', debug);

    const opts = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FAFAFA',
      logging: false,
      width: canvasWidth,
      height: canvasHeight,
      windowWidth: canvasWidth,
      windowHeight: canvasHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
    };

    let captured: HTMLCanvasElement;
    try {
      captured = await html2canvas(clone, { ...opts, foreignObjectRendering: true });
    } catch {
      captured = await html2canvas(clone, { ...opts, foreignObjectRendering: false });
    }
    console.log('[Export] generated canvas width / height', captured.width, captured.height);
    return captured;
  } finally {
    if (debug) {
      setTimeout(() => wrapper.remove(), 2000);
    } else {
      wrapper.remove();
    }
  }
}

// ─── download helper ─────────────────────────────────────────────────────────

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// ─── public API ──────────────────────────────────────────────────────────────

export async function exportAsPng(
  canvasEl: HTMLElement,
  canvasWidth: number,
  canvasHeight: number,
  filename = '카드뉴스.png',
) {
  const captured = await captureCanvas(canvasEl, canvasWidth, canvasHeight);
  const blob = await new Promise<Blob>((res, rej) =>
    captured.toBlob(b => (b ? res(b) : rej(new Error('PNG 변환 실패'))), 'image/png'),
  );
  downloadBlob(blob, filename);
}

export async function exportAsPdf(
  canvasEl: HTMLElement,
  canvasWidth: number,
  canvasHeight: number,
  filename = '카드뉴스.pdf',
) {
  const captured = await captureCanvas(canvasEl, canvasWidth, canvasHeight);
  const imgData = captured.toDataURL('image/png', 1.0);

  const orientation = canvasWidth >= canvasHeight ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [canvasWidth, canvasHeight],
    // hotfixes 제거: px_scaling이 이미지 2배 확대 버그를 일으킴
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvasWidth, canvasHeight, '', 'FAST');
  pdf.save(filename);
}
