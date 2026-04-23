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

function prepareClone(clonedDoc: Document, exportId: string, w: number, h: number) {
  const el = clonedDoc.querySelector<HTMLElement>(`[data-export-id="${exportId}"]`);
  if (!el) return;

  let parent: HTMLElement | null = el;
  while (parent) {
    parent.style.overflow = 'visible';
    parent.style.transform = 'none';
    parent.style.transformOrigin = 'top left';
    parent.style.maxHeight = 'none';
    parent.style.maxWidth = 'none';
    parent = parent.parentElement as HTMLElement | null;
  }

  clonedDoc.documentElement.style.overflow = 'visible';
  clonedDoc.body.style.overflow = 'visible';
  clonedDoc.body.style.margin = '0';
  clonedDoc.body.style.padding = '0';

  el.style.transform = 'none';
  el.style.transformOrigin = 'top left';
  el.style.boxShadow = 'none';
  el.style.overflow = 'hidden';
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
  el.style.maxWidth = 'none';
  el.style.maxHeight = 'none';
  el.style.borderRadius = '0';

  el.querySelectorAll('[data-editing-ui]').forEach(n => {
    (n as HTMLElement).style.display = 'none';
  });

  el.querySelectorAll<HTMLElement>('[data-design-element-id]').forEach(n => {
    n.style.outline = 'none';
    n.style.boxShadow = 'none';
    n.style.cursor = 'default';
  });

  el.querySelectorAll<HTMLElement>('[data-design-element-type="text"] > div').forEach(n => {
    n.style.overflow = 'visible';
    n.style.minHeight = '100%';
  });
}

// ─── capture ────────────────────────────────────────────────────────────────

async function captureCanvas(
  canvasEl: HTMLElement,
  canvasWidth: number,
  canvasHeight: number,
): Promise<HTMLCanvasElement> {
  const exportId = `export-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  canvasEl.setAttribute('data-export-id', exportId);

  type Snap = { el: HTMLElement; transform: string; overflow: string };
  const chain: Snap[] = [];
  let cur: HTMLElement | null = canvasEl;
  while (cur) {
    chain.push({ el: cur, transform: cur.style.transform, overflow: cur.style.overflow });
    cur.style.transform = 'none';
    cur.style.overflow = 'visible';
    cur = cur.parentElement;
  }

  const restore = () => {
    chain.forEach(s => {
      s.el.style.transform = s.transform;
      s.el.style.overflow = s.overflow;
    });
    canvasEl.removeAttribute('data-export-id');
  };

  try {
    await waitForAssets(canvasEl);
    void canvasEl.offsetHeight;
    await waitForNextPaint();

    const opts = {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null as string | null,
      logging: false,
      width: canvasWidth,
      height: canvasHeight,
      windowWidth: canvasWidth,
      windowHeight: canvasHeight,
      scrollX: 0,
      scrollY: 0,
      x: 0,
      y: 0,
      onclone: (doc: Document) => prepareClone(doc, exportId, canvasWidth, canvasHeight),
    };

    try {
      return await html2canvas(canvasEl, { ...opts, foreignObjectRendering: true });
    } catch {
      return await html2canvas(canvasEl, { ...opts, foreignObjectRendering: false });
    }
  } finally {
    restore();
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
