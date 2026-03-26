import type { AnalysisResult } from '@/lib/analysis-engine';

interface CategoryStatsProps {
  stats: AnalysisResult['stats'];
}

const categories = [
  { key: 'customer' as const, label: '고객 중심', emoji: '👤' },
  { key: 'easy' as const, label: '쉽게', emoji: '💡' },
  { key: 'concise' as const, label: '간결하게', emoji: '✂️' },
  { key: 'correct' as const, label: '바르게', emoji: '✅' },
  { key: 'benefit' as const, label: '베네핏', emoji: '🎯' },
];

export function CategoryStats({ stats }: CategoryStatsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {categories.map(c => (
        <div
          key={c.key}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            stats[c.key] > 0
              ? 'bg-destructive/10 text-destructive'
              : 'bg-success/10 text-success'
          }`}
        >
          <span>{c.emoji}</span>
          <span>{c.label}</span>
          {stats[c.key] > 0 && (
            <span className="bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
              {stats[c.key]}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
