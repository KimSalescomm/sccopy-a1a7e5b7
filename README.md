# LG 세일즈커뮤니케이션 글쓰기 & 카드뉴스 디자인 도구

LG전자 고객언어 가이드라인 기반의 **AI 글쓰기 첨삭 + 카드뉴스 디자인 통합 도구**입니다. 세일즈커뮤니케이션팀이 고객 중심의 마케팅 카피를 작성하고, 1920x1080 카드뉴스 형태로 즉시 디자인·출력할 수 있도록 지원합니다.

---

## 1. 제품 개요

| 항목 | 내용 |
|---|---|
| 제품명 | LG 세일즈커뮤니케이션 글쓰기 & 카드뉴스 디자인 도구 |
| 사용자 | LG전자 세일즈커뮤니케이션팀 |
| 핵심 가치 | 고객언어 4원칙 자동 첨삭 + Premium Card News 즉시 제작 |
| 배포 URL | https://sccopy.lovable.app |
| 기본 화면비 | 16:9 (1920 x 1080) |

---

## 2. 핵심 기능

### 2.1 AI 글쓰기 첨삭
- **고객언어 4원칙** 기반 자동 첨삭 (고객중심 / 쉽게쓰기 / 간결하게쓰기 / 바르게쓰기)
- **인라인 첨삭 패널**: 텍스트 블록 옆에 [분석 → 제안 → 수정] 흐름 제공
- **원문 어미 절대 보존**: `~해요` ↔ `~합니다` 변환 금지
- **환각 방지 가드**: 사용자가 입력하지 않은 표현(`콘텐츠들` 등)은 서버에서 필터링
- **광고법/공정거래법 위반 감지**: 최상급 표현, 그린워싱, 근거 없는 수치 등 사전 차단
- **제품군별 Benefit 매칭**: 냉장고→식재료/전기세, 세탁기→빨래시간/옷감 보호 등

### 2.2 카드뉴스 디자인 에디터
- **1920x1080 Fixed Canvas** + 멀티 페이지 관리
- **요소 조작**: 드래그, 그룹화 (Ctrl+G), 정렬, 스냅, pinToBottom 제약
- **동적 레이아웃 동기화**: 텍스트 블록 자동 확장 + 하위 요소 자동 푸시
- **이미지 업로드**: 드래그&드롭, 파일 선택, 클립보드 붙여넣기
- **자동 저장**: localStorage 1.5초 디바운스 + 세션 복원
- **기본 진입 템플릿**: `Basic (Sales Talk) → USP (특장점)` 자동 로드

### 2.3 내보내기 (Export)
- **PNG / PDF 고해상도** 출력
- **Export 전용 렌더 모드**: 선택선/가이드라인/툴바/사이드바 전부 숨김
- **캔버스 1개만 직접 캡처** (html/body 전체 캡처 X)
- **PDF 1페이지 고정** + 자동 분할 방지
- **웹폰트/이미지 로드 완료 대기** 후 캡처
- **콘텐츠 오버플로우 사전 검증**

---

## 3. 디자인 시스템

| 항목 | 사양 |
|---|---|
| 미학 | Premium Modern / Clean |
| 폰트 | Noto Sans KR |
| 배경 | White `#FFFFFF` |
| Primary | LG Red `#FD312E` |
| Element BG | `#FAFAFA` |
| Soft Card | `#FFFFFF`, radius `12px` |
| 화면비 | 16:9 (1920×1080) 표준 |

세부 토큰은 `src/index.css` 및 `tailwind.config.ts`의 시맨틱 토큰을 사용합니다.

---

## 4. 고객언어 4원칙 (가중치 순)

### ① 고객중심
- Feature → Benefit 전환
- 능동형 문장 (`~지원합니다` → `~할 수 있어요`)
- 제품군별 구체적 혜택 매칭

### ② 바르게쓰기
- 맞춤법: `금새→금세`, `몇일→며칠`, `안되요→안돼요`
- 외래어 표기: `스케쥴→스케줄`, `컨텐츠→콘텐츠`, `메세지→메시지`
- 단위/명칭 통일: `mm/cm`, `앱/어플`

### ③ 쉽게쓰기
- 한자어 순화: `탑재→있어`, `상쇄→줄여`, `상시→항상`, `잔여→남은`
- 사내/기술용어: `유로→물이 흐르는 길`, `고내→안쪽`, `토출→나와서`
- 외래어 3원칙: 자연 변환 / 원어 유지 / 풀어 설명

### ④ 간결하게쓰기
- 1문장 1메시지
- 불필요 수식어 제거 (`콘텐츠들을→콘텐츠를`, `사용이 가능한→쓸 수 있는`)
- 번역투/피동 지양 (`만들어진 소재→만든 소재`)

### 절대 원칙
- **원문 종결어미 유지** (`~해요`/`~합니다` 그대로)
- **환각 금지**: 입력 원문에 존재하지 않는 표현은 제안 불가
- **광고법 위반 사전 감지**: 업계 최초, 완벽, 압도적, 근거 없는 수치 등

---

## 5. 기술 스택

| 영역 | 사용 기술 |
|---|---|
| Frontend | React 18, Vite 5, TypeScript 5 |
| Styling | Tailwind CSS v3, shadcn/ui |
| Backend | Lovable Cloud (Supabase) |
| AI | Supabase Edge Functions + Google Gemini (fallback 전략) |
| Storage | Supabase Storage / localStorage (autosave) |
| Export | html-to-image, jsPDF |
| Test | Vitest, Playwright |

---

## 6. 디렉터리 구조 (요약)

```
src/
├── components/design/      # Canvas, Toolbar, PropertiesPanel, AICorrectionPanel 등
├── components/ui/          # shadcn 기반 UI 프리미티브
├── hooks/                  # use-history, use-auto-save 등
├── lib/                    # ai-correction, copy-analysis, export-canvas, templates
├── pages/                  # Index (에디터), NotFound
└── types/design.ts         # 디자인 도메인 타입

supabase/
└── functions/
    ├── analyze-copy/       # 카피 분석 엣지 함수
    └── correct-text/       # AI 첨삭 엣지 함수 (환각 방지 가드 포함)
```

---

## 7. 주요 동작 플로우

1. **앱 진입** → `Basic (Sales Talk) → USP` 템플릿 자동 로드
2. **텍스트 입력** → 자동 저장 (1.5s debounce) + 인라인 [분석] 버튼 노출
3. **AI 첨삭** → Edge Function `correct-text` 호출 → 4원칙 기반 제안 카드
4. **수정 적용** → 원문 어미 유지 + 환각 필터 통과 항목만 적용
5. **디자인 편집** → 드래그/그룹화/정렬/스냅으로 1920x1080 캔버스 구성
6. **내보내기** → Export 전용 렌더 모드 → 캔버스 단독 캡처 → PNG/PDF 1페이지 출력

---

## 8. 로컬 개발

```bash
# 설치
npm install

# 개발 서버
npm run dev

# 테스트
npm run test

# 빌드
npm run build
```

`.env`는 Lovable Cloud가 자동 관리합니다 (`VITE_SUPABASE_*`).

---

## 9. 라이선스 / 이용

LG전자 내부 사용 도구입니다.
