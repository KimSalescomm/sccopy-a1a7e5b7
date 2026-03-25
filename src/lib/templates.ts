import { type Template, type Page, createId } from '@/types/design';

export const TEMPLATES: Template[] = [
  {
    id: 'cover-bold',
    name: '표지 — 볼드',
    description: '큰 제목과 부제목이 중앙 배치된 표지',
    thumbnail: '📰',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1080, height: 1350 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#1a1a2e', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 60, y: 520 }, size: { width: 960, height: 4 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#ffffff', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 0.3 },
          },
          {
            id: createId(), type: 'text', position: { x: 60, y: 540 }, size: { width: 960, height: 200 },
            rotation: 0, locked: false, text: '카드뉴스\n제목을 입력하세요',
            textStyle: { fontSize: 72, fontWeight: 700, color: '#ffffff', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 60, y: 780 }, size: { width: 960, height: 80 },
            rotation: 0, locked: false, text: '부제목 또는 날짜를 입력하세요',
            textStyle: { fontSize: 32, fontWeight: 300, color: '#aaaacc', textAlign: 'left', lineHeight: 1.5, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#1a1a2e' },
      },
    ],
  },
  {
    id: 'content-clean',
    name: '본문 — 클린',
    description: '제목 + 본문 + 이미지 영역이 깔끔하게 배치',
    thumbnail: '📝',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 920, height: 80 },
            rotation: 0, locked: false, text: '제목을 입력하세요',
            textStyle: { fontSize: 52, fontWeight: 700, color: '#1a1a1a', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'shape', position: { x: 80, y: 180 }, size: { width: 120, height: 4 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#4361ee', borderRadius: 2, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 80, y: 220 }, size: { width: 920, height: 520 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#f0f0f5', borderRadius: 16, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 800 }, size: { width: 920, height: 400 },
            rotation: 0, locked: false, text: '본문 내용을 입력하세요.\n\n고객이 쉽게 이해할 수 있는 문장으로 작성해보세요.',
            textStyle: { fontSize: 34, fontWeight: 400, color: '#333333', textAlign: 'left', lineHeight: 1.7, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#ffffff' },
      },
    ],
  },
  {
    id: 'content-highlight',
    name: '본문 — 강조',
    description: '숫자/핵심 메시지를 크게 강조하는 레이아웃',
    thumbnail: '💡',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'text', position: { x: 80, y: 120 }, size: { width: 920, height: 60 },
            rotation: 0, locked: false, text: '핵심 포인트',
            textStyle: { fontSize: 28, fontWeight: 600, color: '#4361ee', textAlign: 'center', lineHeight: 1.5, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 300 }, size: { width: 920, height: 250 },
            rotation: 0, locked: false, text: '핵심 숫자나\n메시지를 입력',
            textStyle: { fontSize: 96, fontWeight: 800, color: '#1a1a1a', textAlign: 'center', lineHeight: 1.2, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'shape', position: { x: 340, y: 590 }, size: { width: 400, height: 4 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#4361ee', borderRadius: 2, borderWidth: 0, borderColor: 'transparent', opacity: 0.5 },
          },
          {
            id: createId(), type: 'text', position: { x: 100, y: 660 }, size: { width: 880, height: 400 },
            rotation: 0, locked: false, text: '부연 설명을 입력하세요.\n고객에게 왜 이 숫자가 중요한지 알려주세요.',
            textStyle: { fontSize: 32, fontWeight: 400, color: '#666666', textAlign: 'center', lineHeight: 1.7, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#fafafa' },
      },
    ],
  },
  {
    id: 'closing',
    name: '마무리',
    description: 'CTA와 마무리 메시지',
    thumbnail: '🎯',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1080, height: 1350 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#4361ee', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 450 }, size: { width: 920, height: 180 },
            rotation: 0, locked: false, text: '지금 바로\n시작하세요',
            textStyle: { fontSize: 80, fontWeight: 700, color: '#ffffff', textAlign: 'center', lineHeight: 1.3, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 140, y: 680 }, size: { width: 800, height: 80 },
            rotation: 0, locked: false, text: 'CTA 또는 연락처를 입력하세요',
            textStyle: { fontSize: 30, fontWeight: 400, color: '#ffffffcc', textAlign: 'center', lineHeight: 1.5, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'shape', position: { x: 340, y: 820 }, size: { width: 400, height: 70 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#ffffff', borderRadius: 35, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 340, y: 830 }, size: { width: 400, height: 50 },
            rotation: 0, locked: false, text: '자세히 보기 →',
            textStyle: { fontSize: 28, fontWeight: 600, color: '#4361ee', textAlign: 'center', lineHeight: 1.5, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#4361ee' },
      },
    ],
  },
];

export function getTemplatePages(templateId: string): Page[] {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) return [];
  // Deep clone to avoid reference issues
  return JSON.parse(JSON.stringify(template.pages)).map((p: Page) => ({
    ...p,
    id: createId(),
    elements: p.elements.map((e: any) => ({ ...e, id: createId() })),
  }));
}
