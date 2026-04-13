import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Capture the canvas element as a high-res image (2x for retina).
 * Temporarily removes scale transform and hides editing UI for a clean capture.
 */
async function captureCanvas(canvasEl: HTMLElement): Promise<HTMLCanvasElement> {
  // Save original styles
  const originalTransform = canvasEl.style.transform;
  const originalTransformOrigin = canvasEl.style.transformOrigin;

  // Remove scale transform so html2canvas captures at actual size
  canvasEl.style.transform = 'none';
  canvasEl.style.transformOrigin = 'top left';

  // Hide editing UI
  canvasEl.classList.add('export-mode');

  // Ensure the parent scrolls to show the full canvas
  const parent = canvasEl.parentElement;
  const parentOverflow = parent?.style.overflow;
  if (parent) {
    parent.style.overflow = 'visible';
  }

  try {
    const result = await html2canvas(canvasEl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      width: canvasEl.scrollWidth || canvasEl.offsetWidth,
      height: canvasEl.scrollHeight || canvasEl.offsetHeight,
    });
    return result;
  } finally {
    // Restore everything
    canvasEl.style.transform = originalTransform;
    canvasEl.style.transformOrigin = originalTransformOrigin;
    canvasEl.classList.remove('export-mode');
    if (parent && parentOverflow !== undefined) {
      parent.style.overflow = parentOverflow;
    }
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

export async function exportAsPng(canvasEl: HTMLElement, filename = '카드뉴스.png') {
  const captured = await captureCanvas(canvasEl);
  captured.toBlob(blob => {
    if (blob) downloadBlob(blob, filename);
  }, 'image/png');
}

export async function exportAsPdf(
  canvasEl: HTMLElement,
  width: number,
  height: number,
  filename = '카드뉴스.pdf',
) {
  const captured = await captureCanvas(canvasEl);
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
