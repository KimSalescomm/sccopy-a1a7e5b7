import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

class ExportValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExportValidationError';
  }
}

interface StyleSnapshot {
  element: HTMLElement;
  overflow: string;
  transform: string;
  transformOrigin: string;
}

function waitForNextPaint() {
  return new Promise<void>(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

async function waitForAssets(root: HTMLElement) {
  if ('fonts' in document) {
    await document.fonts.ready;
  }

  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(images.map(async (img) => {
    if (img.complete && img.naturalWidth > 0) {
      if ('decode' in img) {
        try {
          await img.decode();
        } catch {
          // ignore decode failures and continue export
        }
      }
      return;
    }

    await new Promise<void>(resolve => {
      const done = () => resolve();
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    });
  }));

  await waitForNextPaint();
  await waitForNextPaint();
}

function getAncestorChain(root: HTMLElement) {
  const chain: HTMLElement[] = [root];
  let current = root.parentElement;

  while (current) {
    chain.push(current);
    current = current.parentElement;
  }

  return chain;
}

function applyTemporaryExportStyles(elements: HTMLElement[]) {
  const snapshots: StyleSnapshot[] = elements.map((element) => ({
    element,
    overflow: element.style.overflow,
    transform: element.style.transform,
    transformOrigin: element.style.transformOrigin,
  }));

  elements.forEach((element) => {
    element.style.overflow = 'visible';
    element.style.transform = 'none';
    element.style.transformOrigin = 'top left';
  });

  return () => {
    snapshots.forEach(({ element, overflow, transform, transformOrigin }) => {
      element.style.overflow = overflow;
      element.style.transform = transform;
      element.style.transformOrigin = transformOrigin;
    });
  };
}

function getElementMetrics(element: HTMLElement) {
  const left = element.offsetLeft || Number.parseFloat(element.style.left || '0') || 0;
  const top = element.offsetTop || Number.parseFloat(element.style.top || '0') || 0;
  const width = element.offsetWidth || Number.parseFloat(element.style.width || '0') || 0;
  const baseHeight = element.offsetHeight || Number.parseFloat(element.style.height || '0') || 0;

  let height = baseHeight;
  if (element.dataset.designElementType === 'text') {
    const textNode = element.querySelector(':scope > div') as HTMLElement | null;
    if (textNode) {
      height = Math.max(baseHeight, Math.ceil(textNode.scrollHeight));
    }
  }

  return {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(width),
    height: Math.round(height),
  };
}

function getPinnedBottomDelta(elements: HTMLElement[], canvasHeight: number) {
  const pinnedElements = elements.filter((element) => element.dataset.pinToBottom === 'true');
  if (pinnedElements.length === 0) return 0;

  const maxBottom = Math.max(
    ...pinnedElements.map((element) => {
      const metrics = getElementMetrics(element);
      return metrics.top + metrics.height;
    }),
  );

  return canvasHeight - maxBottom;
}

function validateCanvasLayout(canvasEl: HTMLElement, canvasWidth: number, canvasHeight: number) {
  const elements = Array.from(canvasEl.querySelectorAll<HTMLElement>('[data-design-element-id]'));
  if (elements.length === 0) return;

  const pinnedBottomDelta = getPinnedBottomDelta(elements, canvasHeight);
  let contentHeight = 0;
  let hasOutOfBoundsElement = false;

  for (const element of elements) {
    const metrics = getElementMetrics(element);
    const adjustedTop = metrics.top + (element.dataset.pinToBottom === 'true' ? pinnedBottomDelta : 0);
    const right = metrics.left + metrics.width;
    const bottom = adjustedTop + metrics.height;

    contentHeight = Math.max(contentHeight, bottom);

    if (metrics.left < 0 || adjustedTop < 0 || right > canvasWidth || bottom > canvasHeight) {
      hasOutOfBoundsElement = true;
      break;
    }
  }

  if (contentHeight > canvasHeight || hasOutOfBoundsElement) {
    throw new ExportValidationError('콘텐츠가 캔버스를 벗어나 저장 시 잘릴 수 있습니다');
  }
}

function pinBottomElements(root: HTMLElement, canvasHeight: number) {
  const pinnedElements = Array.from(root.querySelectorAll<HTMLElement>('[data-pin-to-bottom="true"]'));
  if (pinnedElements.length === 0) return;

  const maxBottom = Math.max(
    ...pinnedElements.map((element) => {
      const metrics = getElementMetrics(element);
      return metrics.top + metrics.height;
    }),
  );

  const delta = canvasHeight - maxBottom;
  pinnedElements.forEach((element) => {
    const currentTop = element.offsetTop || Number.parseFloat(element.style.top || '0') || 0;
    element.style.top = `${Math.round(currentTop + delta)}px`;
    element.style.bottom = 'auto';
  });
}

function prepareClonedCanvas(clonedDoc: Document, exportId: string, canvasWidth: number, canvasHeight: number) {
  const clonedCanvas = clonedDoc.querySelector(`[data-export-id="${exportId}"]`) as HTMLElement | null;
  if (!clonedCanvas) return;

  clonedDoc.documentElement.style.overflow = 'visible';
  clonedDoc.body.style.overflow = 'visible';

  let parent = clonedCanvas.parentElement;
  while (parent) {
    parent.style.overflow = 'visible';
    parent.style.transform = 'none';
    parent.style.transformOrigin = 'top left';
    parent.style.maxHeight = 'none';
    parent.style.maxWidth = 'none';
    parent = parent.parentElement;
  }

  clonedCanvas.classList.add('export-mode');
  clonedCanvas.style.transform = 'none';
  clonedCanvas.style.transformOrigin = 'top left';
  clonedCanvas.style.boxShadow = 'none';
  clonedCanvas.style.overflow = 'visible';
  clonedCanvas.style.width = `${canvasWidth}px`;
  clonedCanvas.style.height = `${canvasHeight}px`;
  clonedCanvas.style.maxWidth = 'none';
  clonedCanvas.style.maxHeight = 'none';

  clonedCanvas.querySelectorAll('[data-editing-ui]').forEach((node) => {
    (node as HTMLElement).style.display = 'none';
  });

  clonedCanvas.querySelectorAll<HTMLElement>('[data-design-element-id]').forEach((node) => {
    node.style.outline = 'none';
    node.style.boxShadow = 'none';
    node.style.cursor = 'default';
    node.style.zIndex = 'auto';
  });

  clonedCanvas.querySelectorAll('[data-design-element-type="text"] > div').forEach((node) => {
    const textNode = node as HTMLElement;
    textNode.style.overflow = 'visible';
    textNode.style.minHeight = '100%';
  });

  pinBottomElements(clonedCanvas, canvasHeight);
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error('이미지 생성에 실패했습니다.'));
    }, type);
  });
}

/**
 * Capture the visible canvas at its real size without editor-only UI.
 */
async function captureCanvas(canvasEl: HTMLElement, canvasWidth: number, canvasHeight: number): Promise<HTMLCanvasElement> {
  const exportId = `export-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  canvasEl.setAttribute('data-export-id', exportId);

  const restoreStyles = applyTemporaryExportStyles(getAncestorChain(canvasEl));

  try {
    await waitForAssets(canvasEl);
    void canvasEl.offsetHeight;
    await waitForNextPaint();
    validateCanvasLayout(canvasEl, canvasWidth, canvasHeight);

    const captureOptions = {
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
      onclone: (clonedDoc: Document) => {
        prepareClonedCanvas(clonedDoc, exportId, canvasWidth, canvasHeight);
      },
    };

    try {
      return await html2canvas(canvasEl, {
        ...captureOptions,
        foreignObjectRendering: true,
      });
    } catch {
      return await html2canvas(canvasEl, {
        ...captureOptions,
        foreignObjectRendering: false,
      });
    }
  } finally {
    restoreStyles();
    canvasEl.removeAttribute('data-export-id');
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportAsPng(canvasEl: HTMLElement, canvasWidth: number, canvasHeight: number, filename = '카드뉴스.png') {
  const captured = await captureCanvas(canvasEl, canvasWidth, canvasHeight);
  const blob = await canvasToBlob(captured, 'image/png');
  downloadBlob(blob, filename);
}

export async function exportAsPdf(
  canvasEl: HTMLElement,
  width: number,
  height: number,
  filename = '카드뉴스.pdf',
) {
  const captured = await captureCanvas(canvasEl, width, height);
  const imgData = captured.toDataURL('image/png');

  const orientation = width >= height ? 'landscape' : 'portrait';
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [width, height],
    hotfixes: ['px_scaling'],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  pdf.save(filename);
}
