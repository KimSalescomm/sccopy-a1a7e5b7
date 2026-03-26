import { type Template, type Page, createId } from '@/types/design';

export const TEMPLATES: Template[] = [
  // ─── 기본 (세일즈톡) ───
  {
    id: 'basic-usp',
    category: 'basic',
    name: '특장점',
    description: 'USP 4단 구성 (16:9)',
    thumbnail: '⭐',
    presetId: '16:9',
    pages: [
      {
        id: createId(),
        elements: [
          // ── 좌측 34% 이미지 placeholder ──
          { id: createId(), type: 'shape', position: { x: 0, y: 0 }, size: { width: 653, height: 1080 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#F0F0F0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 0, y: 510 }, size: { width: 653, height: 60 }, rotation: 0, locked: false, text: '제품 사진', textStyle: { fontSize: 20, fontWeight: 400, color: '#BFBFBF', textAlign: 'center', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },

          // ── 우측 66% (x:653) ──
          // ─ 헤더 12% (y:0–130) ─
          { id: createId(), type: 'text', position: { x: 701, y: 50 }, size: { width: 1170, height: 32 }, rotation: 0, locked: false, text: '제품명 | 신제품 특장점', textStyle: { fontSize: 22, fontWeight: 700, color: '#222222', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 701, y: 100 }, size: { width: 1170, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },

          // ─ USP 1  22% (y:130–368) ─
          { id: createId(), type: 'text', position: { x: 701, y: 140 }, size: { width: 300, height: 26 }, rotation: 0, locked: false, text: '카테고리명', textStyle: { fontSize: 13, fontWeight: 500, color: '#888888', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          // NEW pill
          { id: createId(), type: 'shape', position: { x: 701, y: 176 }, size: { width: 44, height: 20 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 999, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 701, y: 176 }, size: { width: 44, height: 20 }, rotation: 0, locked: false, text: 'NEW', textStyle: { fontSize: 10, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          // USP 제목
          { id: createId(), type: 'text', position: { x: 753, y: 174 }, size: { width: 500, height: 24 }, rotation: 0, locked: false, text: 'USP 제목을 입력하세요', textStyle: { fontSize: 16, fontWeight: 700, color: '#222222', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          // USP 설명
          { id: createId(), type: 'text', position: { x: 701, y: 210 }, size: { width: 1120, height: 110 }, rotation: 0, locked: false, text: '이 기능이 고객에게 어떤 이점을 주는지 설명하세요.\n최대 2~3줄로 간결하게 작성합니다.', textStyle: { fontSize: 13, fontWeight: 400, color: '#555555', textAlign: 'left', lineHeight: 1.7, fontFamily: 'Noto Sans KR' } },
          // 구분선
          { id: createId(), type: 'shape', position: { x: 701, y: 348 }, size: { width: 1170, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },

          // ─ USP 2  22% (y:368–606) ─
          { id: createId(), type: 'text', position: { x: 701, y: 378 }, size: { width: 300, height: 26 }, rotation: 0, locked: false, text: '카테고리명', textStyle: { fontSize: 13, fontWeight: 500, color: '#888888', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 701, y: 414 }, size: { width: 44, height: 20 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 999, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 701, y: 414 }, size: { width: 44, height: 20 }, rotation: 0, locked: false, text: 'NEW', textStyle: { fontSize: 10, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 753, y: 412 }, size: { width: 500, height: 24 }, rotation: 0, locked: false, text: 'USP 제목을 입력하세요', textStyle: { fontSize: 16, fontWeight: 700, color: '#222222', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 701, y: 448 }, size: { width: 1120, height: 110 }, rotation: 0, locked: false, text: '이 기능이 고객에게 어떤 이점을 주는지 설명하세요.\n최대 2~3줄로 간결하게 작성합니다.', textStyle: { fontSize: 13, fontWeight: 400, color: '#555555', textAlign: 'left', lineHeight: 1.7, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 701, y: 586 }, size: { width: 1170, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },

          // ─ USP 3  22% (y:606–844) ─
          { id: createId(), type: 'text', position: { x: 701, y: 616 }, size: { width: 300, height: 26 }, rotation: 0, locked: false, text: '카테고리명', textStyle: { fontSize: 13, fontWeight: 500, color: '#888888', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 701, y: 652 }, size: { width: 44, height: 20 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E53935', borderRadius: 999, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 701, y: 652 }, size: { width: 44, height: 20 }, rotation: 0, locked: false, text: 'NEW', textStyle: { fontSize: 10, fontWeight: 700, color: '#FFFFFF', textAlign: 'center', lineHeight: 1.8, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 753, y: 650 }, size: { width: 500, height: 24 }, rotation: 0, locked: false, text: 'USP 제목을 입력하세요', textStyle: { fontSize: 16, fontWeight: 700, color: '#222222', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 701, y: 686 }, size: { width: 1120, height: 110 }, rotation: 0, locked: false, text: '이 기능이 고객에게 어떤 이점을 주는지 설명하세요.\n최대 2~3줄로 간결하게 작성합니다.', textStyle: { fontSize: 13, fontWeight: 400, color: '#555555', textAlign: 'left', lineHeight: 1.7, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 701, y: 824 }, size: { width: 1170, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },

          // ─ USP 4  12% (y:844–972) ─
          { id: createId(), type: 'text', position: { x: 701, y: 854 }, size: { width: 300, height: 26 }, rotation: 0, locked: false, text: '카테고리명', textStyle: { fontSize: 13, fontWeight: 500, color: '#888888', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 701, y: 886 }, size: { width: 1120, height: 60 }, rotation: 0, locked: false, text: '간단한 USP 한 줄 설명을 입력하세요.', textStyle: { fontSize: 13, fontWeight: 400, color: '#555555', textAlign: 'left', lineHeight: 1.7, fontFamily: 'Noto Sans KR' } },

          // ─ 푸터 10% (y:972–1080) ─
          { id: createId(), type: 'shape', position: { x: 701, y: 972 }, size: { width: 1170, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 701, y: 990 }, size: { width: 1170, height: 20 }, rotation: 0, locked: false, text: '* 이미지, 문안, 날짜는 예시입니다. 실제 사용 시 검수 완료 문안을 반영해주세요.', textStyle: { fontSize: 11, fontWeight: 400, color: '#BBBBBB', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 701, y: 1014 }, size: { width: 1170, height: 20 }, rotation: 0, locked: false, text: '사내교육용 / 대외비', textStyle: { fontSize: 11, fontWeight: 700, color: '#888888', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
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
          { id: createId(), type: 'text', position: { x: 1200, y: 120 }, size: { width: 672, height: 40 }, rotation: 0, locked: false, text: 'Key Claim', textStyle: { fontSize: 22, fontWeight: 700, color: '#E53935', textAlign: 'left', lineHeight: 1.4, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'shape', position: { x: 1200, y: 172 }, size: { width: 672, height: 1 }, rotation: 0, locked: false, shapeType: 'rectangle', shapeStyle: { fill: '#E0E0E0', borderRadius: 0, borderWidth: 0, borderColor: 'transparent', opacity: 1 } },
          { id: createId(), type: 'text', position: { x: 1200, y: 200 }, size: { width: 672, height: 200 }, rotation: 0, locked: false, text: '핵심 메시지를 입력하세요.\n\n고객에게 가장 강력하게 전달할\n비주얼 포인트를 작성합니다.', textStyle: { fontSize: 15, fontWeight: 400, color: '#444444', textAlign: 'left', lineHeight: 1.7, fontFamily: 'Noto Sans KR' } },
          { id: createId(), type: 'text', position: { x: 1200, y: 430 }, size: { width: 672, height: 40 }, rotation: 0, locked: false, text: '부가 설명 텍스트를 입력하세요.', textStyle: { fontSize: 12, fontWeight: 400, color: '#AAAAAA', textAlign: 'left', lineHeight: 1.6, fontFamily: 'Noto Sans KR' } },
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
