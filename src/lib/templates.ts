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
          // ── 우측 상단 타입 인디케이터 뱃지 ──
          { id: createId(), type: 'shape', position: { x: 1820, y: 16 }, size: { width: 80, height: 28 }, rotation: 0, locked: true, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 14, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 1820, y: 16 }, size: { width: 80, height: 28 }, rotation: 0, locked: true, text: '기본', textStyle: { fontSize: 12, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', lineHeight: 2.2, fontFamily: 'Noto Sans KR' } },

          // ══════════════════════════════════════
          // HEADER AREA (15vh = 162px, y:0–162)
          // ══════════════════════════════════════
          { id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1920, height: 162 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#F5F5F5', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 48, y: 50 }, size: { width: 1824, height: 60 }, rotation: 0, locked: false, text: '{제품명} | {신제품 특장점}', textStyle: { fontSize: 34, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.25, fontFamily: 'Noto Sans KR' } },
          // 헤더 하단선
          { id: createId(), type: 'shape', position: { x: 0, y: 162 }, size: { width: 1920, height: 2 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },

          // ══════════════════════════════════════
          // BODY AREA (70vh = 756px, y:162–918)
          // 좌:우 = 1:4 (20%:80% = 384px : 1536px)
          // ══════════════════════════════════════

          // ── 좌측 20% 이미지 Placeholder ──
          { id: createId(), type: 'shape', position: { x: 0, y: 164 }, size: { width: 384, height: 754 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#F0F0F0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 0, y: 500 }, size: { width: 384, height: 40 }, rotation: 0, locked: false, text: '제품 이미지', textStyle: { fontSize: 16, fontWeight: 400, color: '#BFBFBF', textAlign: 'center', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          // 좌우 구분선
          { id: createId(), type: 'shape', position: { x: 384, y: 164 }, size: { width: 1, height: 754 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },

          // ── 우측 80% Feature List ──
          // Feature 1 (y:184 ~ y:424, ~240px each for 3 features)
          // 카테고리 뱃지
          { id: createId(), type: 'shape', position: { x: 432, y: 190 }, size: { width: 100, height: 28 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 4, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 432, y: 190 }, size: { width: 100, height: 28 }, rotation: 0, locked: false, text: '{카테고리}', textStyle: { fontSize: 13, fontWeight: 500, color: '#FFFFFF', textAlign: 'center', lineHeight: 2.2, fontFamily: 'Noto Sans KR' } },
          // 메인 카피
          { id: createId(), type: 'text', position: { x: 432, y: 230 }, size: { width: 1440, height: 36 }, rotation: 0, locked: false, text: '{베네핏} + {USP 1}', textStyle: { fontSize: 21, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Noto Sans KR' } },
          // 하위 기능 박스 (노란색)
          { id: createId(), type: 'shape', position: { x: 432, y: 278 }, size: { width: 1440, height: 120 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#FFF9E6', borderRadius: 8, borderWidth: 1, borderColor: '#F5E6B8', opacity: 1 } },
          // Row 1
          { id: createId(), type: 'text', position: { x: 452, y: 288 }, size: { width: 320, height: 40 }, rotation: 0, locked: false, text: 'AI 딥클린', textStyle: { fontSize: 15, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.55, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 792, y: 288 }, size: { width: 1060, height: 40 }, rotation: 0, locked: false, text: '자동으로 먼지와 이물질을 감지해 오염 상태에 맞게 조절해줘요', textStyle: { fontSize: 15, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.55, fontFamily: 'Noto Sans KR' } },
          // Row divider
          { id: createId(), type: 'shape', position: { x: 452, y: 336 }, size: { width: 1400, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#F0E6C8', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          // Row 2
          { id: createId(), type: 'text', position: { x: 452, y: 344 }, size: { width: 320, height: 40 }, rotation: 0, locked: false, text: '자동 먼지 감지', textStyle: { fontSize: 15, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.55, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 792, y: 344 }, size: { width: 1060, height: 40 }, rotation: 0, locked: false, text: '보이지 않는 미세먼지까지 자동으로 감지해 흡입력을 조절해요', textStyle: { fontSize: 15, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.55, fontFamily: 'Noto Sans KR' } },

          // 구분선 1
          { id: createId(), type: 'shape', position: { x: 432, y: 418 }, size: { width: 1440, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },

          // Feature 2 (y:430 ~ y:660)
          { id: createId(), type: 'shape', position: { x: 432, y: 438 }, size: { width: 100, height: 28 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 4, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 432, y: 438 }, size: { width: 100, height: 28 }, rotation: 0, locked: false, text: '{카테고리}', textStyle: { fontSize: 13, fontWeight: 500, color: '#FFFFFF', textAlign: 'center', lineHeight: 2.2, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 432, y: 478 }, size: { width: 1440, height: 36 }, rotation: 0, locked: false, text: '{베네핏} + {USP 2}', textStyle: { fontSize: 21, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 432, y: 526 }, size: { width: 1440, height: 120 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#FFF9E6', borderRadius: 8, borderWidth: 1, borderColor: '#F5E6B8', opacity: 1 } },
          // Row 1
          { id: createId(), type: 'text', position: { x: 452, y: 536 }, size: { width: 320, height: 40 }, rotation: 0, locked: false, text: '스마트 센서', textStyle: { fontSize: 15, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.55, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 792, y: 536 }, size: { width: 1060, height: 40 }, rotation: 0, locked: false, text: '바닥 재질에 따라 흡입력을 자동으로 전환해줘요', textStyle: { fontSize: 15, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.55, fontFamily: 'Noto Sans KR' } },
          // Row divider
          { id: createId(), type: 'shape', position: { x: 452, y: 584 }, size: { width: 1400, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#F0E6C8', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          // Row 2
          { id: createId(), type: 'text', position: { x: 452, y: 592 }, size: { width: 320, height: 40 }, rotation: 0, locked: false, text: '물걸레 시스템', textStyle: { fontSize: 15, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.55, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 792, y: 592 }, size: { width: 1060, height: 40 }, rotation: 0, locked: false, text: '진공 청소와 물걸레를 동시에 처리하는 듀얼 시스템이에요', textStyle: { fontSize: 15, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.55, fontFamily: 'Noto Sans KR' } },

          // 구분선 2
          { id: createId(), type: 'shape', position: { x: 432, y: 666 }, size: { width: 1440, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },

          // Feature 3 (y:678 ~ y:908)
          { id: createId(), type: 'shape', position: { x: 432, y: 686 }, size: { width: 100, height: 28 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 4, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 432, y: 686 }, size: { width: 100, height: 28 }, rotation: 0, locked: false, text: '{카테고리}', textStyle: { fontSize: 13, fontWeight: 500, color: '#FFFFFF', textAlign: 'center', lineHeight: 2.2, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 432, y: 726 }, size: { width: 1440, height: 36 }, rotation: 0, locked: false, text: '{베네핏} + {USP 3}', textStyle: { fontSize: 21, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 432, y: 774 }, size: { width: 1440, height: 70 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#FFF9E6', borderRadius: 8, borderWidth: 1, borderColor: '#F5E6B8', opacity: 1 } },
          // Row 1 (single row)
          { id: createId(), type: 'text', position: { x: 452, y: 784 }, size: { width: 320, height: 40 }, rotation: 0, locked: false, text: '스크래퍼', textStyle: { fontSize: 15, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.55, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 792, y: 784 }, size: { width: 1060, height: 40 }, rotation: 0, locked: false, text: '눌어붙은 음식물도 긁어내듯 깨끗하게 제거해줘요', textStyle: { fontSize: 15, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.55, fontFamily: 'Noto Sans KR' } },

          // ══════════════════════════════════════
          // FOOTER AREA (15vh = 162px, y:918–1080)
          // ══════════════════════════════════════
          { id: createId(), type: 'shape', position: { x: 0, y: 918 }, size: { width: 1920, height: 2 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 48, y: 940 }, size: { width: 1824, height: 50 }, rotation: 0, locked: false, text: '{유의사항 및 디스클레이머 텍스트 입력 영역}', textStyle: { fontSize: 12, fontWeight: 400, color: '#AAAAAA', textAlign: 'left', lineHeight: 1.6, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 48, y: 990 }, size: { width: 1824, height: 24 }, rotation: 0, locked: false, text: '사내교육용 / 대외비', textStyle: { fontSize: 11, fontWeight: 700, color: '#888888', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
        ],
        background: { type: 'solid', color: '#FFFFFF' },
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
          // 상단 라벨
          { id: createId(), type: 'shape', position: { x: 80, y: 80 }, size: { width: 72, height: 28 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 4, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 72, height: 28 }, rotation: 0, locked: false, text: 'ISSUE', textStyle: { fontSize: 12, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', lineHeight: 2.2, fontFamily: 'Noto Sans KR' } },
          // 제목
          { id: createId(), type: 'text', position: { x: 80, y: 130 }, size: { width: 920, height: 120 }, rotation: 0, locked: false, text: '이슈 제목을\n입력하세요', textStyle: { fontSize: 40, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.35, fontFamily: 'Noto Sans KR' } },
          // 요약
          { id: createId(), type: 'text', position: { x: 80, y: 270 }, size: { width: 920, height: 50 }, rotation: 0, locked: false, text: '핵심 요약 1~2줄을 입력하세요', textStyle: { fontSize: 16, fontWeight: 400, color: '#888888', textAlign: 'left', lineHeight: 1.5, fontFamily: 'Noto Sans KR' } },
          // 구분선
          { id: createId(), type: 'shape', position: { x: 80, y: 350 }, size: { width: 920, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          // 본문
          { id: createId(), type: 'text', position: { x: 80, y: 390 }, size: { width: 920, height: 300 }, rotation: 0, locked: false, text: '•  이슈 포인트를 작성하세요\n\n•  관련 데이터 / 수치\n\n•  한 줄 결론', textStyle: { fontSize: 18, fontWeight: 400, color: '#333333', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          // 하단 페이지 번호
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
      // Card 1
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
      // Card 2
      {
        id: createId(),
        elements: [
          { id: createId(), type: 'shape', position: { x: 80, y: 80 }, size: { width: 28, height: 28 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 14, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 28, height: 28 }, rotation: 0, locked: false, text: '2', textStyle: { fontSize: 13, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', lineHeight: 2.0, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 120, y: 80 }, size: { width: 880, height: 32 }, rotation: 0, locked: false, text: '영향도 분석', textStyle: { fontSize: 14, fontWeight: 500, color: '#888888', textAlign: 'left', lineHeight: 2.0, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 140 }, size: { width: 920, height: 100 }, rotation: 0, locked: false, text: '영향 범위를 입력하세요', textStyle: { fontSize: 32, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.35, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 80, y: 270 }, size: { width: 920, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E8E8E8', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 310 }, size: { width: 920, height: 400 }, rotation: 0, locked: false, text: '•  고객 영향\n\n•  시장 / 경쟁 영향\n\n•  내부 영향', textStyle: { fontSize: 16, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 1290 }, size: { width: 920, height: 30 }, rotation: 0, locked: false, text: '02 / 03', textStyle: { fontSize: 11, fontWeight: 400, color: '#CCCCCC', textAlign: 'right', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
        ],
        background: { type: 'solid', color: '#FFFFFF' },
      },
      // Card 3
      {
        id: createId(),
        elements: [
          { id: createId(), type: 'shape', position: { x: 80, y: 80 }, size: { width: 28, height: 28 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 14, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 28, height: 28 }, rotation: 0, locked: false, text: '3', textStyle: { fontSize: 13, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', lineHeight: 2.0, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 120, y: 80 }, size: { width: 880, height: 32 }, rotation: 0, locked: false, text: '대응 전략', textStyle: { fontSize: 14, fontWeight: 500, color: '#888888', textAlign: 'left', lineHeight: 2.0, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 140 }, size: { width: 920, height: 100 }, rotation: 0, locked: false, text: '대응 방안을 입력하세요', textStyle: { fontSize: 32, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.35, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 80, y: 270 }, size: { width: 920, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E8E8E8', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 310 }, size: { width: 920, height: 400 }, rotation: 0, locked: false, text: '•  단기 대응\n\n•  중장기 전략\n\n•  기대 효과', textStyle: { fontSize: 16, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 1290 }, size: { width: 920, height: 30 }, rotation: 0, locked: false, text: '03 / 03', textStyle: { fontSize: 11, fontWeight: 400, color: '#CCCCCC', textAlign: 'right', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
        ],
        background: { type: 'solid', color: '#FFFFFF' },
      },
    ],
  },

  // ─── 이슈 (일반) ───
  {
    id: 'issue-default-overview',
    category: 'issueDefault',
    name: '이슈 일반',
    description: '헤더 + 빈 본문 + 디스클레이머 (16:9)',
    thumbnail: '📋',
    presetId: '16:9',
    pages: [
      {
        id: createId(),
        elements: [
          // ── 우측 상단 타입 인디케이터 뱃지 ──
          { id: createId(), type: 'shape', position: { x: 1820, y: 16 }, size: { width: 80, height: 28 }, rotation: 0, locked: true, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 14, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 1820, y: 16 }, size: { width: 80, height: 28 }, rotation: 0, locked: true, text: '이슈', textStyle: { fontSize: 12, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', lineHeight: 2.2, fontFamily: 'Noto Sans KR' } },

          // ══════════════════════════════════════
          // HEADER AREA (15vh = 162px, y:0–162)
          // ══════════════════════════════════════
          { id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1920, height: 162 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#F5F5F5', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 48, y: 50 }, size: { width: 1724, height: 60 }, rotation: 0, locked: false, text: '이슈 제목을 입력하세요', textStyle: { fontSize: 34, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.25, fontFamily: 'Noto Sans KR' } },
          // 헤더 하단선
          { id: createId(), type: 'shape', position: { x: 0, y: 162 }, size: { width: 1920, height: 2 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },

          // ══════════════════════════════════════
          // BODY AREA (70vh = 756px, y:162–918)
          // 완전한 빈 공간 (Blank Canvas)
          // 세일즈톡 등을 자유롭게 구성
          // ══════════════════════════════════════
          { id: createId(), type: 'text', position: { x: 48, y: 480 }, size: { width: 1824, height: 40 }, rotation: 0, locked: false, text: '이 영역에 세일즈톡 등을 자유롭게 구성하세요', textStyle: { fontSize: 15, fontWeight: 400, color: '#CCCCCC', textAlign: 'center', lineHeight: 1.55, fontFamily: 'Noto Sans KR' } },

          // ══════════════════════════════════════
          // FOOTER AREA (15vh = 162px, y:918–1080)
          // ══════════════════════════════════════
          { id: createId(), type: 'shape', position: { x: 0, y: 918 }, size: { width: 1920, height: 2 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 48, y: 940 }, size: { width: 1824, height: 50 }, rotation: 0, locked: false, text: '{유의사항 및 디스클레이머 텍스트 입력 영역}', textStyle: { fontSize: 12, fontWeight: 400, color: '#AAAAAA', textAlign: 'left', lineHeight: 1.6, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 48, y: 990 }, size: { width: 1824, height: 24 }, rotation: 0, locked: false, text: '사내교육용 / 대외비', textStyle: { fontSize: 11, fontWeight: 700, color: '#888888', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
        ],
        background: { type: 'solid', color: '#FFFFFF' },
      },
    ],
  },



  // ─── 심화 ───
  {
    id: 'deep-cover',
    category: 'deep',
    name: '심화 표지',
    description: '문서 제목 / 버전 / 목차',
    thumbnail: '📘',
    pages: [
      {
        id: createId(),
        elements: [
          // 상단 얇은 액센트 바
          { id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1080, height: 4 }, rotation: 0, locked: true, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          // 분류 라벨
          { id: createId(), type: 'text', position: { x: 80, y: 100 }, size: { width: 400, height: 24 }, rotation: 0, locked: false, text: 'IN-DEPTH REPORT', textStyle: { fontSize: 11, fontWeight: 500, color: '#AAAAAA', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          // 문서 제목
          { id: createId(), type: 'text', position: { x: 80, y: 340 }, size: { width: 920, height: 160 }, rotation: 0, locked: false, text: '심화 콘텐츠\n문서 제목', textStyle: { fontSize: 48, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Noto Sans KR' } },
          // 구분선
          { id: createId(), type: 'shape', position: { x: 80, y: 530 }, size: { width: 60, height: 3 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 2, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          // 메타 정보
          { id: createId(), type: 'text', position: { x: 80, y: 570 }, size: { width: 920, height: 140 }, rotation: 0, locked: false, text: '버전  v1.0\n작성일  2025.01.01\n작성자  홍길동', textStyle: { fontSize: 14, fontWeight: 400, color: '#888888', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          // 목차
          { id: createId(), type: 'shape', position: { x: 80, y: 760 }, size: { width: 920, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 790 }, size: { width: 120, height: 24 }, rotation: 0, locked: false, text: '목차', textStyle: { fontSize: 13, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 830 }, size: { width: 920, height: 300 }, rotation: 0, locked: false, text: '01    서론\n\n02    본론\n\n03    전략 제안\n\n04    결론', textStyle: { fontSize: 14, fontWeight: 400, color: '#555555', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          // 하단 Confidential
          { id: createId(), type: 'text', position: { x: 80, y: 1290 }, size: { width: 920, height: 30 }, rotation: 0, locked: false, text: 'CONFIDENTIAL', textStyle: { fontSize: 10, fontWeight: 500, color: '#CCCCCC', textAlign: 'right', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
        ],
        background: { type: 'solid', color: '#FFFFFF' },
      },
    ],
  },
  {
    id: 'deep-body',
    category: 'deep',
    name: '심화 본문',
    description: '서론 / 본론 / 전략 / 결론',
    thumbnail: '📗',
    pages: [
      {
        id: createId(),
        elements: [
          // 좌측 컬러 바
          { id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 4, height: 1350 }, rotation: 0, locked: true, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          // 섹션 번호
          { id: createId(), type: 'text', position: { x: 80, y: 60 }, size: { width: 100, height: 24 }, rotation: 0, locked: false, text: 'SECTION 01', textStyle: { fontSize: 11, fontWeight: 500, color: '#AAAAAA', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          // 제목
          { id: createId(), type: 'text', position: { x: 80, y: 90 }, size: { width: 920, height: 50 }, rotation: 0, locked: false, text: '서론', textStyle: { fontSize: 32, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Noto Sans KR' } },
          // 구분선
          { id: createId(), type: 'shape', position: { x: 80, y: 155 }, size: { width: 920, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          // 본문
          { id: createId(), type: 'text', position: { x: 80, y: 185 }, size: { width: 920, height: 200 }, rotation: 0, locked: false, text: '배경:\n\n문제 정의:', textStyle: { fontSize: 14, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          // 섹션 2
          { id: createId(), type: 'shape', position: { x: 80, y: 420 }, size: { width: 920, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 440 }, size: { width: 100, height: 24 }, rotation: 0, locked: false, text: 'SECTION 02', textStyle: { fontSize: 11, fontWeight: 500, color: '#AAAAAA', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 470 }, size: { width: 920, height: 50 }, rotation: 0, locked: false, text: '본론', textStyle: { fontSize: 32, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 530 }, size: { width: 920, height: 200 }, rotation: 0, locked: false, text: '2-1.  분석\n\n2-2.  데이터 / 도표 / 사례\n\n2-3.  핵심 인사이트', textStyle: { fontSize: 14, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          // 섹션 3
          { id: createId(), type: 'shape', position: { x: 80, y: 770 }, size: { width: 920, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 790 }, size: { width: 100, height: 24 }, rotation: 0, locked: false, text: 'SECTION 03', textStyle: { fontSize: 11, fontWeight: 500, color: '#AAAAAA', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 820 }, size: { width: 920, height: 50 }, rotation: 0, locked: false, text: '전략 제안', textStyle: { fontSize: 32, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 880 }, size: { width: 920, height: 160 }, rotation: 0, locked: false, text: '•  전략 1:\n\n•  전략 2:\n\n•  전략 3:', textStyle: { fontSize: 14, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          // 섹션 4
          { id: createId(), type: 'shape', position: { x: 80, y: 1080 }, size: { width: 920, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 80, y: 1100 }, size: { width: 100, height: 24 }, rotation: 0, locked: false, text: 'SECTION 04', textStyle: { fontSize: 11, fontWeight: 500, color: '#AAAAAA', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 1130 }, size: { width: 920, height: 50 }, rotation: 0, locked: false, text: '결론', textStyle: { fontSize: 32, fontWeight: 700, color: '#1A1A1A', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 80, y: 1190 }, size: { width: 920, height: 80 }, rotation: 0, locked: false, text: '•  전체 요약 / 실행 시나리오 / 기대효과', textStyle: { fontSize: 14, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          // 페이지 번호
          { id: createId(), type: 'text', position: { x: 80, y: 1290 }, size: { width: 920, height: 30 }, rotation: 0, locked: false, text: '02', textStyle: { fontSize: 11, fontWeight: 400, color: '#CCCCCC', textAlign: 'right', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
        ],
        background: { type: 'solid', color: '#FFFFFF' },
      },
    ],
  },
];

export function getTemplatePages(templateId: string): Page[] {
  const template = TEMPLATES.find(t => t.id === templateId);
  if (!template) return [];
  return JSON.parse(JSON.stringify(template.pages)).map((p: Page) => ({
    ...p,
    id: createId(),
    elements: p.elements.map((e: any) => ({ ...e, id: createId() })),
  }));
}

export function getTemplatePresetId(templateId: string): string | undefined {
  const template = TEMPLATES.find(t => t.id === templateId);
  return template?.presetId;
}
