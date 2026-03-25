import { type Template, type Page, createId } from '@/types/design';

export const TEMPLATES: Template[] = [
  // ─── 기본 (세일즈톡) ───
  {
    id: 'basic-usp',
    category: 'basic',
    name: '특장점',
    description: 'USP 4개 블록 + 카테고리 뱃지 (16:9)',
    thumbnail: '⭐',
    presetId: '16:9',
    pages: [
      {
        id: createId(),
        elements: [
          // 배경
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1920, height: 1080 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#F7F3EB', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          // ── 상단 헤더 ──
          {
            id: createId(), type: 'text', position: { x: 560, y: 24 }, size: { width: 1000, height: 48 },
            rotation: 0, locked: false, text: '제품명 신제품 특장점',
            textStyle: { fontSize: 36, fontWeight: 700, color: '#1a1a1a', textAlign: 'center', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 1640, y: 20 }, size: { width: 240, height: 30 },
            rotation: 0, locked: false, text: '기본',
            textStyle: { fontSize: 24, fontWeight: 700, color: '#1a1a1a', textAlign: 'right', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 1640, y: 50 }, size: { width: 240, height: 24 },
            rotation: 0, locked: false, text: '세일즈커뮤니케이션팀',
            textStyle: { fontSize: 14, fontWeight: 400, color: '#FD312E', textAlign: 'right', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },

          // ── 좌측 제품 이미지 ──
          {
            id: createId(), type: 'shape', position: { x: 40, y: 90 }, size: { width: 380, height: 700 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#E9E9E9', borderRadius: 8, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 40, y: 380 }, size: { width: 380, height: 40 },
            rotation: 0, locked: false, text: '정면 사진',
            textStyle: { fontSize: 16, fontWeight: 400, color: '#C8C8C8', textAlign: 'center', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },

          // ════════════════════════════════════════
          // USP #1 (y: 90 ~ 310)
          // ════════════════════════════════════════
          // 카테고리 뱃지
          {
            id: createId(), type: 'shape', position: { x: 460, y: 90 }, size: { width: 120, height: 32 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#595959', borderRadius: 4, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 460, y: 93 }, size: { width: 120, height: 28 },
            rotation: 0, locked: false, text: '카테고리1',
            textStyle: { fontSize: 16, fontWeight: 700, color: '#ffffff', textAlign: 'center', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          // 헤드라인
          {
            id: createId(), type: 'text', position: { x: 600, y: 88 }, size: { width: 1280, height: 38 },
            rotation: 0, locked: false, text: "특점을 설명하고 베네핏을 담은 표현 'USP명1'",
            textStyle: { fontSize: 28, fontWeight: 700, color: '#1a1a1a', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          // NEW + USP명
          {
            id: createId(), type: 'text', position: { x: 460, y: 138 }, size: { width: 60, height: 24 },
            rotation: 0, locked: false, text: 'NEW',
            textStyle: { fontSize: 14, fontWeight: 700, color: '#FD312E', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Cafe24 Boldface' },
          },
          {
            id: createId(), type: 'text', position: { x: 520, y: 136 }, size: { width: 200, height: 28 },
            rotation: 0, locked: false, text: 'USP명 1',
            textStyle: { fontSize: 18, fontWeight: 700, color: '#1a1a1a', textAlign: 'left', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          // 설명
          {
            id: createId(), type: 'text', position: { x: 740, y: 134 }, size: { width: 1140, height: 60 },
            rotation: 0, locked: false, text: '해당 기능을 설명할 수 있는 상세 설명을 담아주세요\n최대 3줄 포트는 LG EI Text TTF Regular 12',
            textStyle: { fontSize: 18, fontWeight: 400, color: '#595959', textAlign: 'left', lineHeight: 1.5, fontFamily: 'LG EI Text' },
          },

          // ════════════════════════════════════════
          // USP #2 (y: 220 ~ 440)
          // ════════════════════════════════════════
          {
            id: createId(), type: 'shape', position: { x: 460, y: 220 }, size: { width: 1420, height: 1 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#E9E9E9', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 460, y: 240 }, size: { width: 120, height: 32 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#595959', borderRadius: 4, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 460, y: 243 }, size: { width: 120, height: 28 },
            rotation: 0, locked: false, text: '카테고리2',
            textStyle: { fontSize: 16, fontWeight: 700, color: '#ffffff', textAlign: 'center', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 600, y: 238 }, size: { width: 1280, height: 38 },
            rotation: 0, locked: false, text: "핵심 베네핏 헤드라인 'USP명2'",
            textStyle: { fontSize: 28, fontWeight: 700, color: '#1a1a1a', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 460, y: 290 }, size: { width: 200, height: 28 },
            rotation: 0, locked: false, text: 'USP명 2',
            textStyle: { fontSize: 18, fontWeight: 700, color: '#1a1a1a', textAlign: 'left', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 740, y: 288 }, size: { width: 1140, height: 60 },
            rotation: 0, locked: false, text: '해당 기능을 설명할 수 있는 상세 설명을 담아주세요\n최대 3줄 포트는 LG EI Text TTF Regular 12',
            textStyle: { fontSize: 18, fontWeight: 400, color: '#595959', textAlign: 'left', lineHeight: 1.5, fontFamily: 'LG EI Text' },
          },

          // ════════════════════════════════════════
          // USP #3 (y: 380 ~ 590)
          // ════════════════════════════════════════
          {
            id: createId(), type: 'shape', position: { x: 460, y: 375 }, size: { width: 1420, height: 1 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#E9E9E9', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 460, y: 395 }, size: { width: 120, height: 32 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#595959', borderRadius: 4, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 460, y: 398 }, size: { width: 120, height: 28 },
            rotation: 0, locked: false, text: '카테고리3',
            textStyle: { fontSize: 16, fontWeight: 700, color: '#ffffff', textAlign: 'center', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 600, y: 393 }, size: { width: 1280, height: 38 },
            rotation: 0, locked: false, text: "외출 전 빠르고 단정하게 'USP명3'",
            textStyle: { fontSize: 28, fontWeight: 700, color: '#1a1a1a', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 460, y: 443 }, size: { width: 60, height: 24 },
            rotation: 0, locked: false, text: 'NEW',
            textStyle: { fontSize: 14, fontWeight: 700, color: '#FD312E', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Cafe24 Boldface' },
          },
          {
            id: createId(), type: 'text', position: { x: 520, y: 441 }, size: { width: 200, height: 28 },
            rotation: 0, locked: false, text: 'USP명 3',
            textStyle: { fontSize: 18, fontWeight: 700, color: '#1a1a1a', textAlign: 'left', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 740, y: 439 }, size: { width: 1140, height: 60 },
            rotation: 0, locked: false, text: '해당 기능을 설명할 수 있는 상세 설명을 담아주세요\n최대 3줄 포트는 LG EI Text TTF Regular 12',
            textStyle: { fontSize: 18, fontWeight: 400, color: '#595959', textAlign: 'left', lineHeight: 1.5, fontFamily: 'LG EI Text' },
          },

          // ════════════════════════════════════════
          // USP #4 (y: 530 ~ 740)
          // ════════════════════════════════════════
          {
            id: createId(), type: 'shape', position: { x: 460, y: 525 }, size: { width: 1420, height: 1 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#E9E9E9', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 460, y: 545 }, size: { width: 120, height: 32 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#595959', borderRadius: 4, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 460, y: 548 }, size: { width: 120, height: 28 },
            rotation: 0, locked: false, text: '카테고리4',
            textStyle: { fontSize: 16, fontWeight: 700, color: '#ffffff', textAlign: 'center', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 600, y: 543 }, size: { width: 1280, height: 38 },
            rotation: 0, locked: false, text: "핵심 베네핏 헤드라인 'USP명4'",
            textStyle: { fontSize: 28, fontWeight: 700, color: '#1a1a1a', textAlign: 'left', lineHeight: 1.3, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 460, y: 593 }, size: { width: 60, height: 24 },
            rotation: 0, locked: false, text: 'NEW',
            textStyle: { fontSize: 14, fontWeight: 700, color: '#FD312E', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Cafe24 Boldface' },
          },
          {
            id: createId(), type: 'text', position: { x: 520, y: 591 }, size: { width: 200, height: 28 },
            rotation: 0, locked: false, text: 'USP명 4',
            textStyle: { fontSize: 18, fontWeight: 700, color: '#1a1a1a', textAlign: 'left', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 740, y: 589 }, size: { width: 1140, height: 60 },
            rotation: 0, locked: false, text: '해당 기능을 설명할 수 있는 상세 설명을 담아주세요\n최대 3줄 포트는 LG EI Text TTF Regular 12',
            textStyle: { fontSize: 18, fontWeight: 400, color: '#595959', textAlign: 'left', lineHeight: 1.5, fontFamily: 'LG EI Text' },
          },

          // ── 하단 면책 영역 ──
          {
            id: createId(), type: 'text', position: { x: 40, y: 810 }, size: { width: 1840, height: 30 },
            rotation: 0, locked: false, text: '* 미인증 제품 성능 · 인터넷 시험 결과, 자사기기 사용시 기준으로 실 사용환경에 따라 다를 수 있음',
            textStyle: { fontSize: 10, fontWeight: 400, color: '#999999', textAlign: 'left', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          // 하단 바
          {
            id: createId(), type: 'shape', position: { x: 0, y: 840 }, size: { width: 1920, height: 40 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#1a1a1a', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 40, y: 847 }, size: { width: 300, height: 26 },
            rotation: 0, locked: false, text: '사내교육용 / 대외비',
            textStyle: { fontSize: 14, fontWeight: 700, color: '#ffffff', textAlign: 'left', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
        ],
        background: { type: 'solid', color: '#F7F3EB' },
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
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1920, height: 1080 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#F7F3EB', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1920, height: 72 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#FFFFFF', borderRadius: 0, borderWidth: 0, borderColor: '#E9E9E9', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 48, y: 18 }, size: { width: 600, height: 36 },
            rotation: 0, locked: false, text: '비주얼톡',
            textStyle: { fontSize: 24, fontWeight: 700, color: '#595959', textAlign: 'left', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 48, y: 112 }, size: { width: 1120, height: 920 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#E9E9E9', borderRadius: 12, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 48, y: 520 }, size: { width: 1120, height: 50 },
            rotation: 0, locked: false, text: '키 비주얼 이미지 영역',
            textStyle: { fontSize: 18, fontWeight: 400, color: '#C8C8C8', textAlign: 'center', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 1220, y: 112 }, size: { width: 652, height: 60 },
            rotation: 0, locked: false, text: 'Key Claim',
            textStyle: { fontSize: 24, fontWeight: 700, color: '#FD312E', textAlign: 'left', lineHeight: 1.4, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'shape', position: { x: 1220, y: 184 }, size: { width: 652, height: 1 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#E9E9E9', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 1220, y: 210 }, size: { width: 652, height: 200 },
            rotation: 0, locked: false, text: '핵심 메시지를 입력하세요.\n\n제품의 가장 강력한\n비주얼 포인트를 전달합니다.',
            textStyle: { fontSize: 18, fontWeight: 400, color: '#595959', textAlign: 'left', lineHeight: 1.6, fontFamily: 'LG EI Text' },
          },
          {
            id: createId(), type: 'text', position: { x: 1220, y: 440 }, size: { width: 652, height: 40 },
            rotation: 0, locked: false, text: '부가 설명 텍스트',
            textStyle: { fontSize: 12, fontWeight: 400, color: '#C8C8C8', textAlign: 'left', lineHeight: 1.6, fontFamily: 'LG EI Text' },
          },
        ],
        background: { type: 'solid', color: '#F7F3EB' },
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
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1080, height: 1350 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#0f172a', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 100 }, size: { width: 920, height: 60 },
            rotation: 0, locked: false, text: 'ISSUE',
            textStyle: { fontSize: 24, fontWeight: 600, color: '#f59e0b', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 170 }, size: { width: 920, height: 120 },
            rotation: 0, locked: false, text: '이슈 제목을\n입력하세요',
            textStyle: { fontSize: 56, fontWeight: 700, color: '#ffffff', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 320 }, size: { width: 920, height: 60 },
            rotation: 0, locked: false, text: '핵심 요약 1~2줄을 입력하세요',
            textStyle: { fontSize: 28, fontWeight: 400, color: '#94a3b8', textAlign: 'left', lineHeight: 1.5, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'shape', position: { x: 80, y: 420 }, size: { width: 920, height: 4 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#ffffff', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 0.1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 460 }, size: { width: 920, height: 250 },
            rotation: 0, locked: false, text: '• 이슈 포인트\n• 데이터 / 수치\n• 한 줄 결론',
            textStyle: { fontSize: 32, fontWeight: 400, color: '#e2e8f0', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#0f172a' },
      },
    ],
  },
  {
    id: 'issue-card-3',
    category: 'issueCard',
    name: '이슈 카드 3장 세트',
    description: '포인트/영향/대응 3장 구성',
    thumbnail: '📇',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1080, height: 1350 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#0f172a', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 920, height: 50 },
            rotation: 0, locked: false, text: 'CARD 1 — 이슈 포인트',
            textStyle: { fontSize: 24, fontWeight: 600, color: '#f59e0b', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 160 }, size: { width: 920, height: 300 },
            rotation: 0, locked: false, text: '• 이슈 포인트\n• 데이터 / 수치\n• 한 줄 결론',
            textStyle: { fontSize: 36, fontWeight: 400, color: '#ffffff', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#0f172a' },
      },
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1080, height: 1350 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#0f172a', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 920, height: 50 },
            rotation: 0, locked: false, text: 'CARD 2 — 영향도',
            textStyle: { fontSize: 24, fontWeight: 600, color: '#f59e0b', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 160 }, size: { width: 920, height: 300 },
            rotation: 0, locked: false, text: '• 영향도 분석\n• 고객 Pain Point\n• 시나리오',
            textStyle: { fontSize: 36, fontWeight: 400, color: '#ffffff', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#0f172a' },
      },
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1080, height: 1350 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#0f172a', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 920, height: 50 },
            rotation: 0, locked: false, text: 'CARD 3 — 대응 요약',
            textStyle: { fontSize: 24, fontWeight: 600, color: '#f59e0b', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 160 }, size: { width: 920, height: 300 },
            rotation: 0, locked: false, text: '• 대응 요약\n• 핵심 해결 키\n• 실행 계획',
            textStyle: { fontSize: 36, fontWeight: 400, color: '#ffffff', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#0f172a' },
      },
    ],
  },

  // ─── 이슈 (일반) ───
  {
    id: 'issue-default-overview',
    category: 'issueDefault',
    name: '이슈 개요',
    description: '배경/원인/영향 범위 정리',
    thumbnail: '📋',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 920, height: 80 },
            rotation: 0, locked: false, text: '이슈 제목',
            textStyle: { fontSize: 52, fontWeight: 700, color: '#1a1a1a', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'shape', position: { x: 80, y: 180 }, size: { width: 120, height: 4 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#e11d48', borderRadius: 2, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 220 }, size: { width: 920, height: 700 },
            rotation: 0, locked: false, text: '■ 이슈 개요\n\n배경:\n\n원인:\n\n영향 범위:',
            textStyle: { fontSize: 32, fontWeight: 400, color: '#333333', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#ffffff' },
      },
    ],
  },
  {
    id: 'issue-default-analysis',
    category: 'issueDefault',
    name: '세부 분석 + 대응',
    description: '원인/고객/시장 분석 + 전략',
    thumbnail: '🔍',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 920, height: 80 },
            rotation: 0, locked: false, text: '세부 분석',
            textStyle: { fontSize: 48, fontWeight: 700, color: '#1a1a1a', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 180 }, size: { width: 920, height: 500 },
            rotation: 0, locked: false, text: '1) 원인 분석\n2) 고객 영향\n3) 제품 영향\n4) 시장/경쟁 영향',
            textStyle: { fontSize: 32, fontWeight: 400, color: '#333333', textAlign: 'left', lineHeight: 1.8, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'shape', position: { x: 80, y: 720 }, size: { width: 920, height: 4 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#e11d48', borderRadius: 2, borderWidth: 0, borderColor: 'transparent', opacity: 0.5 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 760 }, size: { width: 920, height: 400 },
            rotation: 0, locked: false, text: '■ 대응 전략\n• 단기 전략:\n• 중기 전략:\n• 장기 전략:\n\n■ 기대 효과\n• 개선 포인트:',
            textStyle: { fontSize: 30, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.7, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#ffffff' },
      },
    ],
  },

  // ─── 심화 ───
  {
    id: 'deep-cover',
    category: 'deep',
    name: '심화 표지',
    description: '문서 제목/버전/목차 표지',
    thumbnail: '📘',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 1080, height: 1350 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#1e293b', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 8, height: 1350 },
            rotation: 0, locked: true, shapeType: 'rectangle',
            shapeStyle: { fill: '#3b82f6', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 300 }, size: { width: 920, height: 180 },
            rotation: 0, locked: false, text: '심화 콘텐츠\n문서 제목',
            textStyle: { fontSize: 64, fontWeight: 700, color: '#ffffff', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'shape', position: { x: 80, y: 510 }, size: { width: 200, height: 4 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#3b82f6', borderRadius: 2, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 550 }, size: { width: 920, height: 400 },
            rotation: 0, locked: false, text: '버전: v1.0\n작성일: 2025.01.01\n작성자:\n\n목차:\n1. 서론\n2. 본론\n3. 전략 제안\n4. 결론',
            textStyle: { fontSize: 28, fontWeight: 400, color: '#94a3b8', textAlign: 'left', lineHeight: 1.7, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#1e293b' },
      },
    ],
  },
  {
    id: 'deep-body',
    category: 'deep',
    name: '심화 본문',
    description: '서론/본론/전략/결론 구조',
    thumbnail: '📗',
    pages: [
      {
        id: createId(),
        elements: [
          {
            id: createId(), type: 'text', position: { x: 80, y: 80 }, size: { width: 920, height: 80 },
            rotation: 0, locked: false, text: '1. 서론',
            textStyle: { fontSize: 48, fontWeight: 700, color: '#1e293b', textAlign: 'left', lineHeight: 1.3, fontFamily: 'Pretendard' },
          },
          {
            id: createId(), type: 'shape', position: { x: 80, y: 170 }, size: { width: 60, height: 4 },
            rotation: 0, locked: false, shapeType: 'rectangle',
            shapeStyle: { fill: '#3b82f6', borderRadius: 2, borderWidth: 0, borderColor: 'transparent', opacity: 1 },
          },
          {
            id: createId(), type: 'text', position: { x: 80, y: 210 }, size: { width: 920, height: 900 },
            rotation: 0, locked: false, text: '배경:\n\n문제 정의:\n\n\n2. 본론\n\n2-1. 분석\n2-2. 데이터/도표/사례\n2-3. 핵심 인사이트\n\n\n3. 전략 제안\n• 전략 1:\n• 전략 2:\n• 전략 3:\n\n\n4. 결론\n• 전체 요약\n• 실행 시나리오\n• 기대효과',
            textStyle: { fontSize: 28, fontWeight: 400, color: '#333333', textAlign: 'left', lineHeight: 1.7, fontFamily: 'Pretendard' },
          },
        ],
        background: { type: 'solid', color: '#ffffff' },
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
