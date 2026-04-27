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

function normalizeExportRoot(root: HTMLElement, w: number, h: number) {
  root.id = 'export-clone-root';
  root.setAttribute('data-export-clone-root', 'true');
  // 화면 안에 표시 (html2canvas가 hidden/off-screen DOM을 빈 화면으로 캡처하는 문제 회피)
  // 사용자에게는 0.25배 축소 + pointer-events: none 으로 잠깐만 보임
  root.style.position = 'fixed';
  root.style.left = '0';
  root.style.top = '0';
  root.style.width = `${w}px`;
  root.style.height = `${h}px`;
  root.style.minWidth = `${w}px`;
  root.style.minHeight = `${h}px`;
  root.style.maxWidth = 'none';
  root.style.maxHeight = 'none';
  root.style.overflow = 'visible';
  root.style.transform = 'scale(0.25)';
  root.style.transformOrigin = 'top left';
  root.style.zoom = '1';
  root.style.boxShadow = 'none';
  root.style.borderRadius = '0';
  root.style.pointerEvents = 'none';
  root.style.opacity = '1';
  root.style.zIndex = '999999';
  root.style.background = '#FAFAFA';

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

async function createExportClone(canvasEl: HTMLElement, w: number, h: number) {
  const clone = canvasEl.cloneNode(true) as HTMLElement;
  normalizeExportRoot(clone, w, h);
  document.body.appendChild(clone);
  await waitForAssets(clone);
  void clone.offsetHeight;
  await waitForNextPaint();
  return clone;
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
  const exportRoot = await createExportClone(canvasEl, canvasWidth, canvasHeight);
  const debug = isDebugExport();

  try {
    const rect = exportRoot.getBoundingClientRect();
    console.log('[Export] target selector', '#export-clone-root');
    console.log('[Export] target width / height', canvasWidth, canvasHeight);
    console.log('[Export] target scrollWidth / scrollHeight', exportRoot.scrollWidth, exportRoot.scrollHeight);
    console.log('[Export] target getBoundingClientRect()', rect.toJSON ? rect.toJSON() : rect);
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
      captured = await html2canvas(exportRoot, { ...opts, foreignObjectRendering: true });
    } catch {
      captured = await html2canvas(exportRoot, { ...opts, foreignObjectRendering: false });
    }
    console.log('[Export] generated canvas width / height', captured.width, captured.height);
    return captured;
  } finally {
    if (debug) {
      // 2초간 보여서 사용자가 export DOM 내용을 확인할 수 있게 함
      setTimeout(() => exportRoot.remove(), 2000);
    } else {
      exportRoot.remove();
    }
  }
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
