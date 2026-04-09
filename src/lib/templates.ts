import { type Template, type Page, createId } from '@/types/design';

export const TEMPLATES: Template[] = [
  // ─── 기본 (세일즈톡) ───
  {
    id: 'basic-usp',
    category: 'basic',
    name: '특장점',
    description: '제품명 + USP 3단 구성 (16:9)',
    thumbnail: '⭐',
    presetId: '16:9',
    pages: [
      {
        id: createId(),
        elements: [
          // ══════════════════════════════════════
          // TOP ACCENT LINE
          // ══════════════════════════════════════
          { id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1920, height: 3 }, rotation: 0, locked: true, shapeType: 'rectangle', shapeStyle: { fill: '#E11D48', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },

          // ══════════════════════════════════════
          // HEADER (y:3–76)
          // ══════════════════════════════════════
          { id: createId(), type: 'text', position: { x: 60, y: 20 }, size: { width: 1800, height: 44 }, rotation: 0, locked: false, text: '{제품명} | {신제품 특장점}', textStyle: { fontSize: 28, fontWeight: 700, color: '#111827', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 0, y: 76 }, size: { width: 1920, height: 1 }, rotation: 0, locked: true, shapeType: 'rectangle', shapeStyle: { fill: '#EEEEEE', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },

          // ══════════════════════════════════════
          // LEFT: IMAGE UPLOAD ZONE (x:40, y:96, 500×884)
          // ══════════════════════════════════════
          { id: createId(), type: 'image', position: { x: 40, y: 96 }, size: { width: 500, height: 884 }, rotation: 0, locked: false, objectFit: 'cover' },

          // ══════════════════════════════════════
          // RIGHT: USP CARDS
          // ══════════════════════════════════════

          // ── USP Card 1 (y:96, h:260) ──
          { id: createId(), type: 'shape', position: { x: 580, y: 96 }, size: { width: 1300, height: 260 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#EEEEEE', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 604, y: 114 }, size: { width: 200, height: 18 }, rotation: 0, locked: false, text: 'USP 1', textStyle: { fontSize: 12, fontWeight: 700, color: '#E11D48', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 604, y: 138 }, size: { width: 100, height: 26 }, rotation: 0, locked: false, text: '베네핏', textStyle: { fontSize: 14, fontWeight: 500, color: '#9CA3AF', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 710, y: 136 }, size: { width: 1146, height: 28 }, rotation: 0, locked: false, text: 'USP명', textStyle: { fontSize: 18, fontWeight: 700, color: '#111827', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          // Feature 1
          { id: createId(), type: 'text', position: { x: 604, y: 180 }, size: { width: 1252, height: 22 }, rotation: 0, locked: false, text: 'USP명', textStyle: { fontSize: 15, fontWeight: 600, color: '#374151', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 604, y: 204 }, size: { width: 1252, height: 22 }, rotation: 0, locked: false, text: '자세한 설명을 적어주세요', textStyle: { fontSize: 14, fontWeight: 400, color: '#6B7280', textAlign: 'left', lineHeight: 1.5, fontFamily: 'Noto Sans KR' } },
          // Divider
          { id: createId(), type: 'shape', position: { x: 604, y: 240 }, size: { width: 1252, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#F3F4F6', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          // Feature 2
          { id: createId(), type: 'text', position: { x: 604, y: 256 }, size: { width: 1252, height: 22 }, rotation: 0, locked: false, text: 'USP명', textStyle: { fontSize: 15, fontWeight: 600, color: '#374151', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 604, y: 280 }, size: { width: 1252, height: 22 }, rotation: 0, locked: false, text: '자세한 설명을 적어주세요', textStyle: { fontSize: 14, fontWeight: 400, color: '#6B7280', textAlign: 'left', lineHeight: 1.5, fontFamily: 'Noto Sans KR' } },

          // ── USP Card 2 (y:376, h:260) ──
          { id: createId(), type: 'shape', position: { x: 580, y: 376 }, size: { width: 1300, height: 260 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#EEEEEE', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 604, y: 394 }, size: { width: 200, height: 18 }, rotation: 0, locked: false, text: 'USP 2', textStyle: { fontSize: 12, fontWeight: 700, color: '#E11D48', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 604, y: 418 }, size: { width: 100, height: 26 }, rotation: 0, locked: false, text: '베네핏', textStyle: { fontSize: 14, fontWeight: 500, color: '#9CA3AF', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 710, y: 416 }, size: { width: 1146, height: 28 }, rotation: 0, locked: false, text: 'USP명', textStyle: { fontSize: 18, fontWeight: 700, color: '#111827', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 604, y: 460 }, size: { width: 1252, height: 22 }, rotation: 0, locked: false, text: 'USP명', textStyle: { fontSize: 15, fontWeight: 600, color: '#374151', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 604, y: 484 }, size: { width: 1252, height: 22 }, rotation: 0, locked: false, text: '자세한 설명을 적어주세요', textStyle: { fontSize: 14, fontWeight: 400, color: '#6B7280', textAlign: 'left', lineHeight: 1.5, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 604, y: 520 }, size: { width: 1252, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#F3F4F6', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 604, y: 536 }, size: { width: 1252, height: 22 }, rotation: 0, locked: false, text: 'USP명', textStyle: { fontSize: 15, fontWeight: 600, color: '#374151', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 604, y: 560 }, size: { width: 1252, height: 22 }, rotation: 0, locked: false, text: '자세한 설명을 적어주세요', textStyle: { fontSize: 14, fontWeight: 400, color: '#6B7280', textAlign: 'left', lineHeight: 1.5, fontFamily: 'Noto Sans KR' } },

          // ── USP Card 3 (y:656, h:260) ──
          { id: createId(), type: 'shape', position: { x: 580, y: 656 }, size: { width: 1300, height: 260 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#EEEEEE', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 604, y: 674 }, size: { width: 200, height: 18 }, rotation: 0, locked: false, text: 'USP 3', textStyle: { fontSize: 12, fontWeight: 700, color: '#E11D48', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 604, y: 698 }, size: { width: 100, height: 26 }, rotation: 0, locked: false, text: '베네핏', textStyle: { fontSize: 14, fontWeight: 500, color: '#9CA3AF', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 710, y: 696 }, size: { width: 1146, height: 28 }, rotation: 0, locked: false, text: 'USP명', textStyle: { fontSize: 18, fontWeight: 700, color: '#111827', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 604, y: 740 }, size: { width: 1252, height: 22 }, rotation: 0, locked: false, text: 'USP명', textStyle: { fontSize: 15, fontWeight: 600, color: '#374151', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 604, y: 764 }, size: { width: 1252, height: 22 }, rotation: 0, locked: false, text: '자세한 설명을 적어주세요', textStyle: { fontSize: 14, fontWeight: 400, color: '#6B7280', textAlign: 'left', lineHeight: 1.5, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 604, y: 800 }, size: { width: 1252, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#F3F4F6', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 604, y: 816 }, size: { width: 1252, height: 22 }, rotation: 0, locked: false, text: 'USP명', textStyle: { fontSize: 15, fontWeight: 600, color: '#374151', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 604, y: 840 }, size: { width: 1252, height: 22 }, rotation: 0, locked: false, text: '자세한 설명을 적어주세요', textStyle: { fontSize: 14, fontWeight: 400, color: '#6B7280', textAlign: 'left', lineHeight: 1.5, fontFamily: 'Noto Sans KR' } },

          // ══════════════════════════════════════
          // FOOTER (y:1000–1080)
          // ══════════════════════════════════════
          { id: createId(), type: 'text', position: { x: 60, y: 1040 }, size: { width: 1800, height: 20 }, rotation: 0, locked: false, text: '{유의사항 및 디스클레이머 텍스트 입력 영역}', textStyle: { fontSize: 9, fontWeight: 400, color: '#9CA3AF', textAlign: 'left', lineHeight: 1.6, fontFamily: 'Noto Sans KR' } },
        ],
        background: { type: 'solid', color: '#FAFAFA' },
      },
    ],
  },
  {
    id: 'basic-visual',
    category: 'basic',
    name: '비주얼톡',
    description: '키 비주얼 + Key Claim (16:9)',
    thumbnail: '🖼️',
    presetId: '16:9',
    pages: [
      {
        id: createId(),
        elements: [
          // ── 헤더 바 ──
          { id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1920, height: 64 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#FAFAFA', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 48, y: 16 }, size: { width: 400, height: 32 }, rotation: 0, locked: false, text: '비주얼톡', textStyle: { fontSize: 18, fontWeight: 700, color: '#333333', textAlign: 'left', lineHeight: 1.6, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 0, y: 64 }, size: { width: 1920, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },

          // ── 좌측 키 비주얼 (60%) ──
          { id: createId(), type: 'shape', position: { x: 48, y: 96 }, size: { width: 1100, height: 936 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#F0F0F0', borderRadius: 8, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 48, y: 530 }, size: { width: 1100, height: 40 }, rotation: 0, locked: false, text: '키 비주얼 이미지 영역', textStyle: { fontSize: 16, fontWeight: 400, color: '#BFBFBF', textAlign: 'center', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },

          // ── 우측 텍스트 영역 (40%) ──
          { id: createId(), type: 'text', position: { x: 1200, y: 120 }, size: { width: 672, height: 40 }, rotation: 0, locked: false, text: 'Key Claim', textStyle: { fontSize: 21, fontWeight: 700, color: '#E53935', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 1200, y: 172 }, size: { width: 672, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 1200, y: 200 }, size: { width: 672, height: 200 }, rotation: 0, locked: false, text: '핵심 메시지를 입력하세요.\n\n고객에게 가장 강력하게 전달할\n비주얼 포인트를 작성합니다.', textStyle: { fontSize: 15, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.55, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 1200, y: 430 }, size: { width: 672, height: 40 }, rotation: 0, locked: false, text: '부가 설명 텍스트를 입력하세요.', textStyle: { fontSize: 13, fontWeight: 500, color: '#AAAAAA', textAlign: 'left', lineHeight: 1.6, fontFamily: 'Noto Sans KR' } },
        ],
        background: { type: 'solid', color: '#FFFFFF' },
      },
    ],
  },

  // ─── 이슈 (카드형) ───
  {
    id: 'issue-card-1',
    category: 'issueCard',
    name: '이슈 카드 1장',
    description: '이슈 포인트 + 데이터 + 결론',
    thumbnail: '🃏',
    pages: [
      {
        id: createId(),
        elements: [
          { id: createId(), type: 'shape', position: { x: 80, y: 80 }, size: { width: 72, height: 28 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 4, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 72, height: 28 }, rotation: 0, locked: false, text: 'ISSUE', textStyle: { fontSize: 12, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', lineHeight: 2.2, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 130 }, size: { width: 920, height: 120 }, rotation: 0, locked: false, text: '이슈 제목을\n입력하세요', textStyle: { fontSize: 40, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.35, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 270 }, size: { width: 920, height: 50 }, rotation: 0, locked: false, text: '핵심 요약 1~2줄을 입력하세요', textStyle: { fontSize: 16, fontWeight: 400, color: '#888888', textAlign: 'left', lineHeight: 1.5, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 80, y: 350 }, size: { width: 920, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 390 }, size: { width: 920, height: 300 }, rotation: 0, locked: false, text: '•  이슈 포인트를 작성하세요\n\n•  관련 데이터 / 수치\n\n•  한 줄 결론', textStyle: { fontSize: 18, fontWeight: 400, color: '#333333', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 1290 }, size: { width: 920, height: 30 }, rotation: 0, locked: false, text: '01', textStyle: { fontSize: 11, fontWeight: 400, color: '#CCCCCC', textAlign: 'right', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
        ],
        background: { type: 'solid', color: '#FFFFFF' },
      },
    ],
  },
  {
    id: 'issue-card-3',
    category: 'issueCard',
    name: '이슈 카드 3장 세트',
    description: '포인트 → 영향 → 대응 3단계',
    thumbnail: '📇',
    pages: [
      {
        id: createId(),
        elements: [
          { id: createId(), type: 'shape', position: { x: 80, y: 80 }, size: { width: 28, height: 28 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 14, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 28, height: 28 }, rotation: 0, locked: false, text: '1', textStyle: { fontSize: 13, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', lineHeight: 2.0, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 120, y: 80 }, size: { width: 880, height: 32 }, rotation: 0, locked: false, text: '이슈 포인트', textStyle: { fontSize: 14, fontWeight: 500, color: '#888888', textAlign: 'left', lineHeight: 2.0, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 140 }, size: { width: 920, height: 100 }, rotation: 0, locked: false, text: '이슈 제목을 입력하세요', textStyle: { fontSize: 32, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.35, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 80, y: 270 }, size: { width: 920, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E8E8E8', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 310 }, size: { width: 920, height: 400 }, rotation: 0, locked: false, text: '•  핵심 이슈를 정리하세요\n\n•  관련 데이터 / 수치\n\n•  한 줄 결론', textStyle: { fontSize: 16, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 1290 }, size: { width: 920, height: 30 }, rotation: 0, locked: false, text: '01 / 03', textStyle: { fontSize: 11, fontWeight: 400, color: '#CCCCCC', textAlign: 'right', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
        ],
        background: { type: 'solid', color: '#FFFFFF' },
      },
      {
        id: createId(),
        elements: [
          { id: createId(), type: 'shape', position: { x: 80, y: 80 }, size: { width: 28, height: 28 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 14, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 28, height: 28 }, rotation: 0, locked: false, text: '2', textStyle: { fontSize: 13, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', lineHeight: 2.0, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 120, y: 80 }, size: { width: 880, height: 32 }, rotation: 0, locked: false, text: '영향', textStyle: { fontSize: 14, fontWeight: 500, color: '#888888', textAlign: 'left', lineHeight: 2.0, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 140 }, size: { width: 920, height: 100 }, rotation: 0, locked: false, text: '영향 범위를 입력하세요', textStyle: { fontSize: 32, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.35, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 80, y: 270 }, size: { width: 920, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E8E8E8', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 310 }, size: { width: 920, height: 400 }, rotation: 0, locked: false, text: '•  영향 분석 포인트\n\n•  관련 수치 / 비교\n\n•  핵심 시사점', textStyle: { fontSize: 16, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 1290 }, size: { width: 920, height: 30 }, rotation: 0, locked: false, text: '02 / 03', textStyle: { fontSize: 11, fontWeight: 400, color: '#CCCCCC', textAlign: 'right', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
        ],
        background: { type: 'solid', color: '#FFFFFF' },
      },
      {
        id: createId(),
        elements: [
          { id: createId(), type: 'shape', position: { x: 80, y: 80 }, size: { width: 28, height: 28 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 14, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 28, height: 28 }, rotation: 0, locked: false, text: '3', textStyle: { fontSize: 13, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', lineHeight: 2.0, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 120, y: 80 }, size: { width: 880, height: 32 }, rotation: 0, locked: false, text: '대응 방안', textStyle: { fontSize: 14, fontWeight: 500, color: '#888888', textAlign: 'left', lineHeight: 2.0, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 140 }, size: { width: 920, height: 100 }, rotation: 0, locked: false, text: '대응 전략을 입력하세요', textStyle: { fontSize: 32, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.35, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 80, y: 270 }, size: { width: 920, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E8E8E8', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 310 }, size: { width: 920, height: 400 }, rotation: 0, locked: false, text: '•  단기 대응책\n\n•  중장기 전략\n\n•  실행 일정', textStyle: { fontSize: 16, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 1290 }, size: { width: 920, height: 30 }, rotation: 0, locked: false, text: '03 / 03', textStyle: { fontSize: 11, fontWeight: 400, color: '#CCCCCC', textAlign: 'right', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
        ],
        background: { type: 'solid', color: '#FFFFFF' },
      },
    ],
  },

  // ─── 이슈 (일반) ───
  {
    id: 'issue-default',
    category: 'issueDefault',
    name: '이슈 기본',
    description: '제목 + 본문 구조',
    thumbnail: '📋',
    pages: [
      {
        id: createId(),
        elements: [
          { id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1080, height: 64 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#FAFAFA', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 48, y: 16 }, size: { width: 400, height: 32 }, rotation: 0, locked: false, text: '이슈 리포트', textStyle: { fontSize: 16, fontWeight: 700, color: '#333333', textAlign: 'left', lineHeight: 1.6, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 0, y: 64 }, size: { width: 1080, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 48, y: 100 }, size: { width: 984, height: 80 }, rotation: 0, locked: false, text: '이슈 제목을 입력하세요', textStyle: { fontSize: 28, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 48, y: 200 }, size: { width: 984, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 48, y: 230 }, size: { width: 984, height: 600 }, rotation: 0, locked: false, text: '이슈 내용을 자유롭게 작성하세요.\n\n배경, 원인, 영향, 대응 방안 등을 포함할 수 있습니다.', textStyle: { fontSize: 16, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.7, fontFamily: 'Noto Sans KR' } },
        ],
        background: { type: 'solid', color: '#FFFFFF' },
      },
    ],
  },

  // ─── 심화 ───
  {
    id: 'deep-comparison',
    category: 'deep',
    name: '비교 분석',
    description: '자사 vs 경쟁사 비교',
    thumbnail: '⚖️',
    pages: [
      {
        id: createId(),
        elements: [
          { id: createId(), type: 'text', position: { x: 48, y: 48 }, size: { width: 984, height: 44 }, rotation: 0, locked: false, text: '비교 분석', textStyle: { fontSize: 24, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 48, y: 108 }, size: { width: 984, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'shape', position: { x: 48, y: 140 }, size: { width: 480, height: 700 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E8F5E9', borderRadius: 12, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 72, y: 164 }, size: { width: 432, height: 36 }, rotation: 0, locked: false, text: '자사 제품', textStyle: { fontSize: 20, fontWeight: 700, color: '#2E7D32', textAlign: 'center', lineHeight: 1.3, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 72, y: 220 }, size: { width: 432, height: 580 }, rotation: 0, locked: false, text: '•  특장점 1\n\n•  특장점 2\n\n•  특장점 3', textStyle: { fontSize: 16, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 552, y: 140 }, size: { width: 480, height: 700 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#FFF3E0', borderRadius: 12, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 576, y: 164 }, size: { width: 432, height: 36 }, rotation: 0, locked: false, text: '경쟁사 제품', textStyle: { fontSize: 20, fontWeight: 700, color: '#E65100', textAlign: 'center', lineHeight: 1.3, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 576, y: 220 }, size: { width: 432, height: 580 }, rotation: 0, locked: false, text: '•  비교 포인트 1\n\n•  비교 포인트 2\n\n•  비교 포인트 3', textStyle: { fontSize: 16, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
        ],
        background: { type: 'solid', color: '#FFFFFF' },
      },
    ],
  },
];

// ─── helpers ───
export function getTemplatePages(templateId: string): Page[] {
  const tpl = TEMPLATES.find(t => t.id === templateId);
  if (!tpl) return [];
  return tpl.pages.map(p => ({
    ...p,
    id: createId(),
    elements: p.elements.map(e => ({ ...e, id: createId() })),
  }));
}

export function getTemplatePresetId(templateId: string): string | undefined {
  return TEMPLATES.find(t => t.id === templateId)?.presetId;
}
