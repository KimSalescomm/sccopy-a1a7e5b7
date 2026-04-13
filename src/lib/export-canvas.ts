import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Capture the canvas element as a high-res image (2x for retina).
 * Temporarily hides selection outlines, guides, resize handles etc.
 */
async function captureCanvas(canvasEl: HTMLElement): Promise<HTMLCanvasElement> {
  // Temporarily hide editing UI
  canvasEl.classList.add('export-mode');
  try {
    const result = await html2canvas(canvasEl, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
    });
    return result;
  } finally {
    canvasEl.classList.remove('export-mode');
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

  // Create PDF with exact canvas aspect ratio
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
