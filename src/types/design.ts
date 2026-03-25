export type ElementType = 'text' | 'image' | 'shape';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TextStyle {
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  lineHeight: number;
  fontFamily: string;
}

export interface ShapeStyle {
  fill: string;
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  opacity: number;
}

export interface DesignElement {
  id: string;
  type: ElementType;
  position: Position;
  size: Size;
  rotation: number;
  locked: boolean;
  // Text
  text?: string;
  textStyle?: TextStyle;
  // Image
  imageUrl?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  // Shape
  shapeType?: 'rectangle' | 'circle' | 'line';
  shapeStyle?: ShapeStyle;
}

export interface PageBackground {
  type: 'solid' | 'gradient';
  color: string;
  gradientFrom?: string;
  gradientTo?: string;
  gradientDirection?: number; // degrees
}

export interface Page {
  id: string;
  elements: DesignElement[];
  background: PageBackground;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string; // emoji
  pages: Page[];
}

// Canvas presets
export interface CanvasPreset {
  id: string;
  label: string;
  width: number;
  height: number;
  ratio: string;
}

export const CANVAS_PRESETS: CanvasPreset[] = [
  { id: '1:1', label: '1:1 정사각형', width: 1080, height: 1080, ratio: '1:1' },
  { id: '3:4', label: '3:4 세로형', width: 1080, height: 1440, ratio: '3:4' },
  { id: '4:3', label: '4:3 가로형', width: 1440, height: 1080, ratio: '4:3' },
  { id: '4:5', label: '4:5 세로형', width: 1080, height: 1350, ratio: '4:5' },
  { id: '5:4', label: '5:4 가로형', width: 1350, height: 1080, ratio: '5:4' },
  { id: '9:16', label: '9:16 세로형', width: 1080, height: 1920, ratio: '9:16' },
  { id: '16:9', label: '16:9 가로형', width: 1920, height: 1080, ratio: '16:9' },
];

export const DEFAULT_PRESET = CANVAS_PRESETS[2]; // 3:4

// Legacy constants for compatibility
export const CANVAS_WIDTH = DEFAULT_PRESET.width;
export const CANVAS_HEIGHT = DEFAULT_PRESET.height;

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createDefaultPage(): Page {
  return {
    id: createId(),
    elements: [],
    background: { type: 'solid', color: '#FFFFFF' },
  };
}

export function createTextElement(overrides?: Partial<DesignElement>): DesignElement {
  return {
    id: createId(),
    type: 'text',
    position: { x: 100, y: 200 },
    size: { width: 880, height: 120 },
    rotation: 0,
    locked: false,
    text: '텍스트를 입력하세요',
    textStyle: {
      fontSize: 48,
      fontWeight: 400,
      color: '#1a1a1a',
      textAlign: 'center',
      lineHeight: 1.5,
      fontFamily: 'Pretendard',
    },
    ...overrides,
  };
}

export function createShapeElement(overrides?: Partial<DesignElement>): DesignElement {
  return {
    id: createId(),
    type: 'shape',
    position: { x: 200, y: 400 },
    size: { width: 680, height: 300 },
    rotation: 0,
    locked: false,
    shapeType: 'rectangle',
    shapeStyle: {
      fill: '#e8e8e8',
      borderRadius: 16,
      borderWidth: 0,
      borderColor: '#cccccc',
      opacity: 1,
    },
    ...overrides,
  };
}

export function createImageElement(imageUrl: string, overrides?: Partial<DesignElement>): DesignElement {
  return {
    id: createId(),
    type: 'image',
    position: { x: 100, y: 100 },
    size: { width: 880, height: 600 },
    rotation: 0,
    locked: false,
    imageUrl,
    objectFit: 'cover',
    ...overrides,
  };
}
