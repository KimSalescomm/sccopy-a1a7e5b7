// LG 고객언어 글쓰기 분석 엔진

export type ErrorSeverity = 'error' | 'warning' | 'suggestion';
export type ErrorCategory = 'customer' | 'easy' | 'concise' | 'correct';

export interface AnalysisError {
  id: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  principle: string;
  description: string;
  original: string;
  suggestions: string[];
  startIndex: number;
  endIndex: number;
}

export interface AnalysisResult {
  score: number;
  errors: AnalysisError[];
  stats: {
    customer: number;
    easy: number;
    concise: number;
    correct: number;
  };
}

// ── 사전 데이터 ──

const CORPORATE_VERBS = [
  '지원합니다', '제공됩니다', '탑재되었습니다', '적용됩니다',
  '지원합니다', '제공합니다', '탑재했습니다', '적용했습니다',
  '출시합니다', '출시했습니다', '개발했습니다', '개발합니다',
];

const CORPORATE_SUBJECTS = [
  'LG전자는', 'LG전자가', '당사는', '당사가', '본사는', '본사가',
  '삼성전자는', '삼성전자가',
];

const TECH_JARGON: Record<string, string[]> = {
  '기동': ['켜져요', '작동돼요', '전원이 켜져요'],
  '탑재': ['들어 있어요', '사용할 수 있어요', '갖추고 있어요'],
  '동작': ['움직여요', '작동해요'],
  '화구': ['불판', '열이 나오는 부분'],
  '포인트리': ['포인트'],
  '스펙': ['사양', '성능'],
  '디폴트': ['기본값', '기본 설정'],
  '인터페이스': ['연결 방식', '화면'],
  '컨버전': ['전환'],
  '솔루션': ['해결 방법'],
  '리소스': ['자원', '자료'],
  '옵티마이즈': ['최적화'],
  '프로세스': ['과정', '절차'],
  '매뉴얼': ['설명서', '안내서'],
  '어태치': ['부착', '붙이기'],
  '캘리브레이션': ['보정', '조정'],
  '펌웨어': ['소프트웨어 업데이트'],
  '모듈': ['부품', '장치'],
};

const BLACKLIST = [
  '업계 최초', '압도적', '완벽하게', '100% 보장', '최고의 기술력',
  '세계 최고', '혁신적인', '획기적인', '놀라운', '경이로운',
  '타의 추종을 불허', '독보적인',
];

const UNNECESSARY_WORDS = ['적', '것', '들', '적으로', '위하여'];

const SPELLING_ERRORS: Record<string, string> = {
  '몇일': '며칠',
  '안되요': '안돼요',
  '안됩니다': '안 됩니다',
  '일일히': '일일이',
  '금새': '금세',
  '어떻게 해야되나요': '어떻게 해야 되나요',
  '되어지다': '되다',
  '됬': '됐',
  '않됩니다': '안 됩니다',
  '할께요': '할게요',
  '할껀데': '할 건데',
  '왠지': '웬지',
  '왠만하면': '웬만하면',
  '어의없다': '어이없다',
  '희안하다': '희한하다',
  '문안하다': '무난하다',
  '설래다': '설레다',
  '할려고': '하려고',
  '틀리다': '다르다',
  '바래다': '바라다',
  '않해': '안 해',
  '돼서': '되어서',
  '라고': '이라고',
};

const SPACING_ERRORS: Record<string, string> = {
  '할수있': '할 수 있',
  '할수없': '할 수 없',
  '것같다': '것 같다',
  '수있습니다': '수 있습니다',
  '수없습니다': '수 없습니다',
  '해주세요': '해 주세요',
  '안에서': '안에서',
};

let errorIdCounter = 0;
function nextId(): string {
  return `err-${++errorIdCounter}`;
}

// ── 탐지 함수들 ──

function detectCorporateVoice(text: string, errors: AnalysisError[]) {
  for (const verb of CORPORATE_VERBS) {
    let idx = text.indexOf(verb);
    while (idx !== -1) {
      errors.push({
        id: nextId(),
        severity: 'warning',
        category: 'customer',
        principle: '원칙1 — 고객 중심',
        description: `"${verb}"은 기업 관점 표현입니다. 고객이 주어가 되는 표현으로 바꿔보세요.`,
        original: verb,
        suggestions: [
          verb.replace(/지원합니다|제공합니다|제공됩니다/, '사용할 수 있어요'),
          verb.replace(/탑재|적용/, '들어 있어요'),
        ].filter(s => s !== verb).slice(0, 2),
        startIndex: idx,
        endIndex: idx + verb.length,
      });
      idx = text.indexOf(verb, idx + 1);
    }
  }
}

function detectCorporateSubject(text: string, errors: AnalysisError[]) {
  const sentences = text.split(/[.!?\n]+/).filter(Boolean);
  if (sentences.length === 0) return;
  const first = sentences[0];
  for (const subj of CORPORATE_SUBJECTS) {
    const idx = first.indexOf(subj);
    if (idx !== -1 && idx < 20) {
      errors.push({
        id: nextId(),
        severity: 'warning',
        category: 'customer',
        principle: '원칙1 — 고객 중심',
        description: `첫 문장에 "${subj}"이 등장합니다. 고객 관점으로 시작해보세요.`,
        original: subj,
        suggestions: ['고객이 주어가 되는 문장으로 시작하세요', '예: "더 편리하게 사용할 수 있어요"'],
        startIndex: text.indexOf(subj),
        endIndex: text.indexOf(subj) + subj.length,
      });
    }
  }
}

function detectTechJargon(text: string, errors: AnalysisError[]) {
  for (const [jargon, alternatives] of Object.entries(TECH_JARGON)) {
    let idx = text.indexOf(jargon);
    while (idx !== -1) {
      errors.push({
        id: nextId(),
        severity: 'warning',
        category: 'easy',
        principle: '원칙2 — 쉽게',
        description: `"${jargon}"은 고객에게 어려운 전문용어입니다.`,
        original: jargon,
        suggestions: alternatives,
        startIndex: idx,
        endIndex: idx + jargon.length,
      });
      idx = text.indexOf(jargon, idx + 1);
    }
  }
}

function detectNounChain(text: string, errors: AnalysisError[]) {
  // 한글 명사 연속 패턴 (공백으로 구분된 2글자 이상 한글 단어 3개 이상 연속)
  const pattern = /([가-힣]{2,}\s){2,}[가-힣]{2,}\s*(기능|모듈|센서|장치|시스템|모드|설정|방식|제어|관리|처리|동작)/g;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    const words = match[0].trim().split(/\s+/);
    if (words.length >= 3) {
      errors.push({
        id: nextId(),
        severity: 'warning',
        category: 'concise',
        principle: '원칙3 — 간결하게',
        description: `명사 ${words.length}개가 연속 나열됩니다: "${match[0].trim()}". 풀어서 써보세요.`,
        original: match[0].trim(),
        suggestions: ['명사를 줄이고 동사/조사를 활용해 문장으로 풀어보세요'],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }
}

function detectUnnecessaryWords(text: string, errors: AnalysisError[]) {
  for (const word of UNNECESSARY_WORDS) {
    const pattern = new RegExp(`[가-힣]${word}[^가-힣]|[가-힣]${word}$`, 'g');
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const fullMatch = match[0];
      const wordStart = match.index + 1;
      errors.push({
        id: nextId(),
        severity: 'suggestion',
        category: 'concise',
        principle: '원칙3 — 간결하게',
        description: `"${word}"은 불필요한 표현일 수 있습니다. 제거를 검토해보세요.`,
        original: fullMatch.trim(),
        suggestions: [`"${word}" 없이 문장을 다시 구성해보세요`],
        startIndex: wordStart,
        endIndex: wordStart + word.length,
      });
    }
  }
}

function detectBlacklist(text: string, errors: AnalysisError[]) {
  for (const term of BLACKLIST) {
    let idx = text.indexOf(term);
    while (idx !== -1) {
      errors.push({
        id: nextId(),
        severity: 'error',
        category: 'correct',
        principle: '금지 표현',
        description: `"${term}"은 근거 없는 과장 표현으로 사용이 금지됩니다.`,
        original: term,
        suggestions: ['객관적 데이터나 고객 경험 기반 표현으로 대체하세요'],
        startIndex: idx,
        endIndex: idx + term.length,
      });
      idx = text.indexOf(term, idx + 1);
    }
  }
}

function detectSpellingErrors(text: string, errors: AnalysisError[]) {
  for (const [wrong, correct] of Object.entries(SPELLING_ERRORS)) {
    let idx = text.indexOf(wrong);
    while (idx !== -1) {
      errors.push({
        id: nextId(),
        severity: 'error',
        category: 'correct',
        principle: '원칙4 — 바르게',
        description: `"${wrong}"은 맞춤법 오류입니다.`,
        original: wrong,
        suggestions: [correct],
        startIndex: idx,
        endIndex: idx + wrong.length,
      });
      idx = text.indexOf(wrong, idx + 1);
    }
  }
}

function detectSpacingErrors(text: string, errors: AnalysisError[]) {
  for (const [wrong, correct] of Object.entries(SPACING_ERRORS)) {
    let idx = text.indexOf(wrong);
    while (idx !== -1) {
      errors.push({
        id: nextId(),
        severity: 'warning',
        category: 'correct',
        principle: '원칙4 — 바르게',
        description: `"${wrong}" → "${correct}" 띄어쓰기를 확인해주세요.`,
        original: wrong,
        suggestions: [correct],
        startIndex: idx,
        endIndex: idx + wrong.length,
      });
      idx = text.indexOf(wrong, idx + 1);
    }
  }
}

// ── 메인 분석 함수 ──

export function analyzeText(text: string): AnalysisResult {
  errorIdCounter = 0;
  if (!text.trim()) {
    return { score: 100, errors: [], stats: { customer: 0, easy: 0, concise: 0, correct: 0 } };
  }

  const errors: AnalysisError[] = [];

  detectCorporateVoice(text, errors);
  detectCorporateSubject(text, errors);
  detectTechJargon(text, errors);
  detectNounChain(text, errors);
  detectUnnecessaryWords(text, errors);
  detectBlacklist(text, errors);
  detectSpellingErrors(text, errors);
  detectSpacingErrors(text, errors);

  // 중복 제거 (같은 위치에 같은 카테고리)
  const unique = errors.filter((e, i, arr) =>
    arr.findIndex(x => x.startIndex === e.startIndex && x.category === e.category) === i
  );

  // 점수 계산
  let score = 100;
  for (const e of unique) {
    if (e.severity === 'error') score -= 5;
    else if (e.severity === 'warning') score -= 3;
    else score -= 1;
  }
  score = Math.max(0, score);

  // 카테고리별 통계
  const stats = { customer: 0, easy: 0, concise: 0, correct: 0 };
  for (const e of unique) {
    stats[e.category]++;
  }

  return { score, errors: unique, stats };
}

export function getSeverityLabel(s: ErrorSeverity): string {
  return s === 'error' ? '오류' : s === 'warning' ? '경고' : '제안';
}

export function getCategoryLabel(c: ErrorCategory): string {
  switch (c) {
    case 'customer': return '고객 중심';
    case 'easy': return '쉽게';
    case 'concise': return '간결하게';
    case 'correct': return '바르게';
  }
}
