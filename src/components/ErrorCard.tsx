import { AnalysisError, getSeverityLabel, getCategoryLabel } from '@/lib/analysis-engine';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, AlertCircle, Lightbulb } from 'lucide-react';

interface ErrorCardProps {
  error: AnalysisError;
  onApplySuggestion: (error: AnalysisError, suggestion: string) => void;
}

export function ErrorCard({ error, onApplySuggestion }: ErrorCardProps) {
  const borderColor = error.severity === 'error'
    ? 'border-l-destructive'
    : error.severity === 'warning'
    ? 'border-l-warning'
    : 'border-l-info';

  const Icon = error.severity === 'error'
    ? AlertCircle
    : error.severity === 'warning'
    ? AlertTriangle
    : Lightbulb;

  const iconColor = error.severity === 'error'
    ? 'text-destructive'
    : error.severity === 'warning'
    ? 'text-warning'
    : 'text-info';

  return (
    <div className={`bg-card rounded-lg border border-l-4 ${borderColor} p-4 shadow-sm transition-all hover:shadow-md`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={error.severity === 'error' ? 'destructive' : 'secondary'}
              className="text-[10px] px-1.5 py-0"
            >
              {getSeverityLabel(error.severity)}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {getCategoryLabel(error.category)}
            </Badge>
          </div>

          <p className="text-sm text-foreground leading-relaxed">{error.description}</p>

          <div className="bg-muted rounded-md px-3 py-1.5">
            <code className="text-xs text-muted-foreground">"{error.original}"</code>
          </div>

          {error.suggestions.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">개선 제안:</p>
              {error.suggestions.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm text-foreground">→ {s}</span>
                  {error.original !== s && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-primary hover:text-primary"
                      onClick={() => onApplySuggestion(error, s)}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      적용
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground">{error.principle}</p>
        </div>
      </div>
    </div>
  );
}
