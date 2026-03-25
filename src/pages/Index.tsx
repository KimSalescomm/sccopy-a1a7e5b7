import { useState, useMemo, useCallback } from 'react';
import { analyzeText, type AnalysisError } from '@/lib/analysis-engine';
import { ScoreGauge } from '@/components/ScoreGauge';
import { ErrorCard } from '@/components/ErrorCard';
import { CategoryStats } from '@/components/CategoryStats';
import { FileText, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SAMPLE_TEXT = `LG전자는 업계 최초로 스마트 온도 감지 자동 제어 기능을 탑재했습니다.
전원 버튼을 눌러 기동합니다.
완벽하게 세척할수있습니다.
몇일 안에 배송됩니다.`;

const Index = () => {
  const [text, setText] = useState('');

  const result = useMemo(() => analyzeText(text), [text]);

  const handleApplySuggestion = useCallback((error: AnalysisError, suggestion: string) => {
    setText(prev => prev.replace(error.original, suggestion));
  }, []);

  const handleLoadSample = () => setText(SAMPLE_TEXT);
  const handleClear = () => setText('');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">고객언어 글쓰기 분석기</h1>
              <p className="text-[11px] text-muted-foreground">LG 고객언어 4원칙 기반 실시간 분석</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleLoadSample} className="text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              예시 불러오기
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-[calc(100vh-120px)]">
          {/* Left: Editor */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <ScoreGauge score={result.score} />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {text.trim() ? `${result.errors.length}개 항목 발견` : '텍스트를 입력해주세요'}
                  </p>
                  <CategoryStats stats={result.stats} />
                </div>
              </div>
              {text && (
                <Button variant="ghost" size="sm" onClick={handleClear} className="text-xs text-muted-foreground">
                  <Trash2 className="w-3 h-3 mr-1" />
                  지우기
                </Button>
              )}
            </div>

            <div className="relative">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="고객에게 전달할 문장을 입력해주세요...&#10;&#10;예: 전원 버튼을 눌러 기동합니다."
                className="w-full min-h-[400px] lg:min-h-[520px] rounded-xl border border-input bg-card p-5 text-base leading-8 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none transition-shadow"
                spellCheck={false}
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {text.length}자
              </div>
            </div>
          </div>

          {/* Right: Analysis Panel */}
          <div className="lg:col-span-2 space-y-3">
            <div className="sticky top-20">
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                📋 분석 결과
                {result.errors.length > 0 && (
                  <span className="text-xs font-normal text-muted-foreground">
                    ({result.errors.length}건)
                  </span>
                )}
              </h2>

              {result.errors.length === 0 && text.trim() && (
                <div className="bg-success/5 border border-success/20 rounded-xl p-6 text-center space-y-2">
                  <div className="text-3xl">🎉</div>
                  <p className="text-sm font-medium text-success">완벽해요!</p>
                  <p className="text-xs text-muted-foreground">고객언어 원칙에 맞는 글입니다.</p>
                </div>
              )}

              {!text.trim() && (
                <div className="border border-dashed rounded-xl p-8 text-center space-y-3">
                  <div className="text-3xl">✍️</div>
                  <p className="text-sm text-muted-foreground">
                    왼쪽에 텍스트를 입력하면<br />실시간으로 분석 결과가 표시됩니다.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleLoadSample} className="text-xs">
                    예시 텍스트로 시작하기
                  </Button>
                </div>
              )}

              <div className="space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
                {result.errors.map(error => (
                  <ErrorCard
                    key={error.id}
                    error={error}
                    onApplySuggestion={handleApplySuggestion}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
