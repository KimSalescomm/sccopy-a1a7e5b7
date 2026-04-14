import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

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
}

/**
 * Capture the visible canvas at its real size without editor-only UI.
 */
async function captureCanvas(canvasEl: HTMLElement, canvasWidth: number, canvasHeight: number): Promise<HTMLCanvasElement> {
  const exportId = `export-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  canvasEl.setAttribute('data-export-id', exportId);

  // Save original styles
  const origTransform = canvasEl.style.transform;
  const origTransformOrigin = canvasEl.style.transformOrigin;
  const origOverflow = canvasEl.style.overflow;

  // Temporarily reset for accurate capture
  canvasEl.style.transform = 'none';
  canvasEl.style.transformOrigin = 'top left';
  canvasEl.style.overflow = 'visible';

  try {
    await waitForAssets(canvasEl);

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
        const clonedCanvas = clonedDoc.querySelector(`[data-export-id="${exportId}"]`) as HTMLElement | null;
        if (!clonedCanvas) return;

        clonedCanvas.classList.add('export-mode');
        clonedCanvas.style.transform = 'none';
        clonedCanvas.style.transformOrigin = 'top left';
        clonedCanvas.style.boxShadow = 'none';
        clonedCanvas.style.overflow = 'hidden';
        clonedCanvas.style.width = `${canvasWidth}px`;
        clonedCanvas.style.height = `${canvasHeight}px`;

        // Hide all editing UI
        clonedCanvas.querySelectorAll('[data-editing-ui]').forEach((node) => {
          (node as HTMLElement).style.display = 'none';
        });

        // Ensure text doesn't clip
        clonedCanvas.querySelectorAll('[data-design-element-type="text"] > div').forEach((node) => {
          const textNode = node as HTMLElement;
          textNode.style.overflow = 'visible';
        });
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
    canvasEl.style.transform = origTransform;
    canvasEl.style.transformOrigin = origTransformOrigin;
    canvasEl.style.overflow = origOverflow;
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
  captured.toBlob((blob) => {
    if (blob) downloadBlob(blob, filename);
  }, 'image/png');
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
