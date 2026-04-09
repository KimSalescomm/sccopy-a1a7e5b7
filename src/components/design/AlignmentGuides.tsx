import React from 'react';
import type { DesignElement } from '@/types/design';

const SNAP_THRESHOLD = 5;

export interface GuideLine {
  type: 'h' | 'v'; // horizontal or vertical
  pos: number;
}

export interface SnapResult {
  x?: number;
  y?: number;
  guides: GuideLine[];
}

/** Compute snap targets and guide lines for a moving element(s) among siblings */
export function computeSnap(
  movingIds: string[],
  allElements: DesignElement[],
  proposedX: number,
  proposedY: number,
  movingWidth: number,
  movingHeight: number,
  canvasWidth: number,
  canvasHeight: number,
): SnapResult {
  const guides: GuideLine[] = [];
  let snapX: number | undefined;
  let snapY: number | undefined;

  const mCx = proposedX + movingWidth / 2;
  const mCy = proposedY + movingHeight / 2;
  const mRight = proposedX + movingWidth;
  const mBottom = proposedY + movingHeight;

  // Reference lines from other elements + canvas edges/center
  const vLines: number[] = [0, canvasWidth / 2, canvasWidth];
  const hLines: number[] = [0, canvasHeight / 2, canvasHeight];

  for (const el of allElements) {
    if (movingIds.includes(el.id)) continue;
    const ex = el.position.x;
    const ey = el.position.y;
    const ew = el.size.width;
    const eh = el.size.height;
    vLines.push(ex, ex + ew / 2, ex + ew);
    hLines.push(ey, ey + eh / 2, ey + eh);
  }

  // Check vertical snapping (x-axis)
  let bestDx = SNAP_THRESHOLD + 1;
  for (const vl of vLines) {
    // left edge
    const d1 = Math.abs(proposedX - vl);
    if (d1 < bestDx) { bestDx = d1; snapX = vl; }
    // center
    const d2 = Math.abs(mCx - vl);
    if (d2 < bestDx) { bestDx = d2; snapX = vl - movingWidth / 2; }
    // right edge
    const d3 = Math.abs(mRight - vl);
    if (d3 < bestDx) { bestDx = d3; snapX = vl - movingWidth; }
  }

  // Check horizontal snapping (y-axis)
  let bestDy = SNAP_THRESHOLD + 1;
  for (const hl of hLines) {
    const d1 = Math.abs(proposedY - hl);
    if (d1 < bestDy) { bestDy = d1; snapY = hl; }
    const d2 = Math.abs(mCy - hl);
    if (d2 < bestDy) { bestDy = d2; snapY = hl - movingHeight / 2; }
    const d3 = Math.abs(mBottom - hl);
    if (d3 < bestDy) { bestDy = d3; snapY = hl - movingHeight; }
  }

  // Build guide lines for active snaps
  const finalX = snapX ?? proposedX;
  const finalY = snapY ?? proposedY;

  if (snapX !== undefined) {
    // Which reference line are we snapped to?
    const fx = finalX;
    const fCx = fx + movingWidth / 2;
    const fRight = fx + movingWidth;
    for (const vl of vLines) {
      if (Math.abs(fx - vl) < 1 || Math.abs(fCx - vl) < 1 || Math.abs(fRight - vl) < 1) {
        guides.push({ type: 'v', pos: vl });
      }
    }
  }
  if (snapY !== undefined) {
    const fy = finalY;
    const fCy = fy + movingHeight / 2;
    const fBottom = fy + movingHeight;
    for (const hl of hLines) {
      if (Math.abs(fy - hl) < 1 || Math.abs(fCy - hl) < 1 || Math.abs(fBottom - hl) < 1) {
        guides.push({ type: 'h', pos: hl });
      }
    }
  }

  return { x: snapX, y: snapY, guides };
}

/** Spacing between two elements */
interface SpacingLabel {
  x: number;
  y: number;
  value: number;
  orientation: 'h' | 'v';
}

export function computeSpacingLabels(
  movingIds: string[],
  allElements: DesignElement[],
  canvasWidth: number,
  canvasHeight: number,
): SpacingLabel[] {
  if (movingIds.length !== 1) return [];
  const moving = allElements.find(e => e.id === movingIds[0]);
  if (!moving) return [];

  const labels: SpacingLabel[] = [];
  const mx = moving.position.x;
  const my = moving.position.y;
  const mw = moving.size.width;
  const mh = moving.size.height;

  for (const el of allElements) {
    if (el.id === moving.id) continue;
    const ex = el.position.x;
    const ey = el.position.y;
    const ew = el.size.width;
    const eh = el.size.height;

    // Horizontal spacing (elements roughly on the same row)
    const overlapY = Math.min(my + mh, ey + eh) - Math.max(my, ey);
    if (overlapY > 0) {
      if (mx > ex + ew) {
        const gap = mx - (ex + ew);
        if (gap < 200) {
          labels.push({ x: ex + ew + gap / 2, y: Math.max(my, ey) + overlapY / 2, value: Math.round(gap), orientation: 'h' });
        }
      } else if (ex > mx + mw) {
        const gap = ex - (mx + mw);
        if (gap < 200) {
          labels.push({ x: mx + mw + gap / 2, y: Math.max(my, ey) + overlapY / 2, value: Math.round(gap), orientation: 'v' });
        }
      }
    }

    // Vertical spacing
    const overlapX = Math.min(mx + mw, ex + ew) - Math.max(mx, ex);
    if (overlapX > 0) {
      if (my > ey + eh) {
        const gap = my - (ey + eh);
        if (gap < 200) {
          labels.push({ x: Math.max(mx, ex) + overlapX / 2, y: ey + eh + gap / 2, value: Math.round(gap), orientation: 'v' });
        }
      } else if (ey > my + mh) {
        const gap = ey - (my + mh);
        if (gap < 200) {
          labels.push({ x: Math.max(mx, ex) + overlapX / 2, y: my + mh + gap / 2, value: Math.round(gap), orientation: 'v' });
        }
      }
    }
  }

  return labels;
}

interface AlignmentGuidesProps {
  guides: GuideLine[];
  spacingLabels: SpacingLabel[];
  canvasWidth: number;
  canvasHeight: number;
}

export function AlignmentGuidesOverlay({ guides, spacingLabels, canvasWidth, canvasHeight }: AlignmentGuidesProps) {
  if (guides.length === 0 && spacingLabels.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width={canvasWidth}
      height={canvasHeight}
      style={{ zIndex: 9999 }}
    >
      {guides.map((g, i) =>
        g.type === 'v' ? (
          <line key={`g-${i}`} x1={g.pos} y1={0} x2={g.pos} y2={canvasHeight} stroke="#6366F1" strokeWidth={1} strokeDasharray="4 3" />
        ) : (
          <line key={`g-${i}`} x1={0} y1={g.pos} x2={canvasWidth} y2={g.pos} stroke="#6366F1" strokeWidth={1} strokeDasharray="4 3" />
        )
      )}
      {spacingLabels.map((s, i) => (
        <g key={`s-${i}`}>
          <rect x={s.x - 16} y={s.y - 8} width={32} height={16} rx={3} fill="#6366F1" />
          <text x={s.x} y={s.y + 4} textAnchor="middle" fill="white" fontSize={10} fontWeight={600}>{s.value}</text>
        </g>
      ))}
    </svg>
  );
}

// Alignment actions for multi-select
export type AlignAction = 'left' | 'centerH' | 'right' | 'top' | 'centerV' | 'bottom' | 'distributeH' | 'distributeV';

export function alignElements(elements: DesignElement[], ids: string[], action: AlignAction): DesignElement[] {
  const targets = elements.filter(e => ids.includes(e.id));
  if (targets.length < 2) return elements;

  const updates: Record<string, { x?: number; y?: number }> = {};

  switch (action) {
    case 'left': {
      const minX = Math.min(...targets.map(e => e.position.x));
      targets.forEach(e => { updates[e.id] = { x: minX }; });
      break;
    }
    case 'centerH': {
      const centers = targets.map(e => e.position.x + e.size.width / 2);
      const avg = centers.reduce((a, b) => a + b, 0) / centers.length;
      targets.forEach(e => { updates[e.id] = { x: avg - e.size.width / 2 }; });
      break;
    }
    case 'right': {
      const maxRight = Math.max(...targets.map(e => e.position.x + e.size.width));
      targets.forEach(e => { updates[e.id] = { x: maxRight - e.size.width }; });
      break;
    }
    case 'top': {
      const minY = Math.min(...targets.map(e => e.position.y));
      targets.forEach(e => { updates[e.id] = { y: minY }; });
      break;
    }
    case 'centerV': {
      const centers = targets.map(e => e.position.y + e.size.height / 2);
      const avg = centers.reduce((a, b) => a + b, 0) / centers.length;
      targets.forEach(e => { updates[e.id] = { y: avg - e.size.height / 2 }; });
      break;
    }
    case 'bottom': {
      const maxBottom = Math.max(...targets.map(e => e.position.y + e.size.height));
      targets.forEach(e => { updates[e.id] = { y: maxBottom - e.size.height }; });
      break;
    }
    case 'distributeH': {
      const sorted = [...targets].sort((a, b) => a.position.x - b.position.x);
      const totalWidth = sorted.reduce((s, e) => s + e.size.width, 0);
      const minX = sorted[0].position.x;
      const maxRight = sorted[sorted.length - 1].position.x + sorted[sorted.length - 1].size.width;
      const totalSpace = maxRight - minX - totalWidth;
      const gap = totalSpace / (sorted.length - 1);
      let cx = minX;
      sorted.forEach(e => {
        updates[e.id] = { x: Math.round(cx) };
        cx += e.size.width + gap;
      });
      break;
    }
    case 'distributeV': {
      const sorted = [...targets].sort((a, b) => a.position.y - b.position.y);
      const totalHeight = sorted.reduce((s, e) => s + e.size.height, 0);
      const minY = sorted[0].position.y;
      const maxBottom = sorted[sorted.length - 1].position.y + sorted[sorted.length - 1].size.height;
      const totalSpace = maxBottom - minY - totalHeight;
      const gap = totalSpace / (sorted.length - 1);
      let cy = minY;
      sorted.forEach(e => {
        updates[e.id] = { y: Math.round(cy) };
        cy += e.size.height + gap;
      });
      break;
    }
  }

  return elements.map(e => {
    const u = updates[e.id];
    if (!u) return e;
    return { ...e, position: { x: u.x ?? e.position.x, y: u.y ?? e.position.y } };
  });
}
